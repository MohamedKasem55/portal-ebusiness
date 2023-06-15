import {
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { Injector } from '@angular/core'
import { Observable } from 'rxjs'
import { StorageService } from '../storage/storage.service'

export class AuthInterceptor implements HttpInterceptor {
  private storageService: StorageService
  constructor(private injector: Injector) {
    this.storageService = this.injector.get(StorageService)
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<HttpEventType.Response>> {
    const currentUser = JSON.parse(this.storageService.retrieve('currentUser'))
    const regToken = this.storageService.retrieve('regToken')
    const token = currentUser && currentUser.token

    let authReq = req
    if (token) {
      //console.log("httpClients adding token");
      if (
        req.url.indexOf('mailCenter') === -1 &&
        req.url.indexOf('pendingActions/counters') === -1
      ) {
        const actualTime = new Date()
        this.storageService.store('lastCall', actualTime)
      }
      const newHeaders = req.headers.set('Authorization', `Bearer ${token}`)
      authReq = req.clone({
        headers: newHeaders,
      })
    } else {
      if (regToken) {
        //console.log("httpClients adding token");
        const newHeaders = req.headers.set('Authorization', regToken)
        //console.log(regToken);
        authReq = req.clone({
          headers: newHeaders,
        })
      }
    }

    return next.handle(authReq)
  }
}
