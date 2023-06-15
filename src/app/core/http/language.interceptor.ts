import {
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { Injector } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Observable } from 'rxjs'

export class LanguageInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<HttpEventType.Response>> {
    let contentLanguage = 'ar_SA'
    let acceptLanguage = 'ar-SA'
    let localeSet = false
    let newHeaders = req.headers
    const currentLang = this.injector.get(TranslateService).currentLang
    if (
      currentLang === 'en' ||
      currentLang === 'en_US' ||
      currentLang === 'en-US'
    ) {
      contentLanguage = 'en_US'
      acceptLanguage = 'en-US'
      localeSet = true
    }
    if (
      !localeSet ||
      currentLang === 'ar' ||
      currentLang === 'ar_SA' ||
      currentLang === 'ar-SA'
    ) {
      contentLanguage = 'ar_SA'
      acceptLanguage = 'ar-SA'
    }

    if (!newHeaders.get('Content-Language')) {
      newHeaders = newHeaders.set('Content-Language', contentLanguage)
    } else {
      newHeaders = newHeaders.set('Content-Language', contentLanguage)
    }

    if (!newHeaders.get('Accept-Language')) {
      newHeaders = newHeaders.set('Accept-Language', acceptLanguage)
    } else {
      newHeaders = newHeaders.set('Accept-Language', acceptLanguage)
    }

    let authReq = req
    authReq = req.clone({
      headers: newHeaders,
    })

    return next.handle(authReq)
  }
}
