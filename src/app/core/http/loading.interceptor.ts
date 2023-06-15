import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { SimpleMQ } from 'ng2-simple-mq'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private id = 1
  private httpPetitions = 0
  constructor(private smq: SimpleMQ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const interception = this.id++
    let displayLoading =
      req.params && req.params.get('displayLoading') == 'false' ? false : true

    if (req.body && req.body.displayLoading == false) {
      displayLoading = false
    }

    if (displayLoading) {
      this.httpPetitions++
      this.smq.publish('loader-mq', true)
    }

    return next.handle(req).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            if (displayLoading) {
              this.httpPetitions--
              if (this.httpPetitions === 0) {
                this.smq.publish('loader-mq', false)
              }
            }
          }
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (displayLoading) {
              this.httpPetitions--
              if (this.httpPetitions === 0) {
                this.smq.publish('loader-mq', false)
              }
            }
          }
        },
      ),
    )
  }
}
