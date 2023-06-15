import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http'
import { Injectable, Injector } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { SimpleMQ } from 'ng2-simple-mq'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
//import { ConfigResourceService } from "../config/config.resource.local";
import { environment } from '../../../environments/environment'
import { CryptoService } from '../crypto/crypto.service'
import { StorageService } from '../storage/storage.service'

@Injectable()
export class CriptInterceptor implements HttpInterceptor {
  private cryptedEndpoints: string[] = []

  //	private configResourceService:ConfigResourceService;
  constructor(
    private cryptoService: CryptoService,
    private storageService: StorageService,
    private smq: SimpleMQ,
    private injector: Injector,
  ) {
    //this.configResourceService = injector.get(ConfigResourceService);
    // this.cryptedEndpoints.push(this.configResourceService.getServicesUrl());
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    // ////console.log("httpClients ccking crypt and session");
    let newBody = req.body

    if (environment.crypto) {
      if (this.isCryptedEndpoint(req.url)) {
        newBody = this.cryptoService.encryptHttp(req.body)
      }
    }

    let authReq = req
    authReq = req.clone({
      body: newBody,
    })
    return next.handle(authReq).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            if (!event.url.endsWith('finance/attachDocument')) {
              if (environment.crypto) {
                const _newBody = this.cryptoService.decryptHttp(event.body)
                event = event.clone({
                  body: _newBody,
                })
              }

              try {
                let output
                try {
                  output = JSON.parse(event.body)
                } catch (e) {
                  output = event.body
                }

                if (output.errorCode && output.errorCode !== '0' && !req.headers.get('IgnoreError')) {
                  let message: string

                  if (output.errorCode === '-2') {
                    message = 'Following fields contains error:<br/>'
                    for (const entry of output.fieldErrors) {
                      message =
                        message +
                        '<b> - Field: ' +
                        entry.field +
                        ' Error: ' +
                        entry.message +
                        '</b><br/>'
                    }
                    if (output.errorResponse) {
                      message.concat('|').concat(output.errorResponse.reference)
                    }
                  } else {
                    if (output.errorResponse) {
                      if (
                        this.injector.get(TranslateService).currentLang === 'ar'
                      ) {
                        message = output.errorResponse.arabicMessage
                          .concat('|')
                          .concat(output.errorResponse.reference)
                      } else {
                        message = output.errorResponse.englishMessage
                          .concat('|')
                          .concat(output.errorResponse.reference)
                      }
                    }
                  }

                  if (!message || message === '') {
                    message = output.errorDescription
                  }

                  if (!message || message === '') {
                    message = 'Operation not available'
                  }

                  if (event.url.endsWith('finance/initiate') && output.errorCode == '-8') {
                    let errorMsg = ''
                    output.errorList.forEach((element) => {
                      errorMsg += element + ', '
                    })
                    errorMsg = errorMsg.substring(0, errorMsg.length - 2)
                    message = errorMsg
                  }

                  this.smq.publish('error-mq', message)
                  this.smq.publish('error-ref', output.errorResponse.reference)
                }
              } catch (e) {
              }
            }
          }
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              this.storageService.clear('currentUser')
              this.injector.get(Router).navigateByUrl('/login');
            }
            if (err.status === 400) {
              const output = err.error
              ////console.log(output)
              if (output.error) {
                this.smq.publish(
                  'error-mq',
                  this.injector.get(TranslateService).get(output.error),
                )
              } else if (output.errors) {
                if (output.errors) {
                  if (output.errors.length > 0) {
                    for (const _err of output.errors) {
                      this.injector
                        .get(TranslateService)
                        .get(_err.errorCode)
                        .subscribe((value) => {
                          this.smq.publish('error-mq', value)
                        })
                    }
                  } else {
                    this.injector
                      .get(TranslateService)
                      .get(output.fatalErrorCode)
                      .subscribe((value) => {
                        this.smq.publish('error-mq', value)
                      })
                  }
                }
              } else {
                this.injector
                  .get(TranslateService)
                  .get('error.operationNotAvailable')
                  .subscribe((value) => {
                    this.smq.publish('error-mq', value)
                  })
              }
            }
          }
        },
      ),
    )
  }

  private isCryptedEndpoint(url): boolean {
    for (const cryptedEndpoint of this.cryptedEndpoints) {
      if (url.includes(cryptedEndpoint)) {
        return true
      }
    }
    return false
  }
}
