import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http'
import { DomSanitizer } from '@angular/platform-browser'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

import { SimpleMQ } from 'ng2-simple-mq'

export class FireWallInterceptor implements HttpInterceptor {
  constructor(private smq: SimpleMQ, protected sanitizer: DomSanitizer) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<HttpEventType.Response>> {
    if (req.url.endsWith('.json')) {
      return next.handle(req)
    } else {
      return next.handle(req).pipe(
        tap(
            (event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    if (event.headers.get('Content-Type') !== null &&
                        (event.headers.get('Content-Type').indexOf('text/html') !== -1 ||
                            event.headers.get('Content-Type').indexOf('application/html') >= 0)) {
                        if (event.body.includes('Your Support ID:')) {
                            this.smq.publish(
                                'error-mq',
                                event.body.replace(/<script>[^\<]*<\/script>/g, ''),
                            )
                        } else {
                            this.smq.publish('error-mq', event.status + ' ' + event.statusText)
                        }
                    }
                }
            },
            (err: any) => {
                if (err instanceof HttpErrorResponse) {
                    if (err.headers.get('Content-Type') !== null) {
                        if ((err.headers.get('Content-Type').indexOf('text/html') !== -1 ||
                            err.headers.get('Content-Type').indexOf('application/html') >= 0)) {
                            if (err.error.includes('Your Support ID:')) {
                                this.smq.publish('error-mq', err.error)
                            } else {
                                this.smq.publish('error-mq', `Operation not available please try again later : ${err.status}`)
                            }
                        }
                    }
                }
            }
        )
      )
    }
  }
}