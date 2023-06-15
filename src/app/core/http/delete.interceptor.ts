import {
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { Observable } from 'rxjs'

export class DeleteInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<HttpEventType.Response>> {
    let authReq = req

    if (req.method === 'DELETE') {
      const deletebody = req.params.get('deletebody')

      const _params = req.params.delete('deletebody')
      authReq = req.clone({
        body: JSON.parse(deletebody),
        params: _params,
      })
    }

    return next.handle(authReq)
  }
}

export interface AppResponse {
  errorCode: string
  errorDescription: string
  errorResponse: any
}
