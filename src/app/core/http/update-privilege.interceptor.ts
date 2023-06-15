import { Injectable } from '@angular/core'
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http'
import { Observable } from 'rxjs'
import { SimpleMQ } from 'ng2-simple-mq'
import { StorageService } from '../storage/storage.service'
import { tap } from 'rxjs/operators'

@Injectable()
export class UpdatePrivilegeInterceptor implements HttpInterceptor {
  constructor(private smq: SimpleMQ, public storageService: StorageService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (event.headers.get('refreshFlag') === 'Y') {
            this.smq.publish('privilege-changed', true)
          } else {
            this.smq.publish('privilege-changed', false)
          }
        }
      }),
    )
  }
}
