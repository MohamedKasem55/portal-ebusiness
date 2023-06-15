import {
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { v4 as uuidv4 } from 'uuid';

export class ContenttypeInterceptor implements HttpInterceptor {
  private config = require('../../../../package.json')

  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<HttpEventType.Response>> {
    let newHeaders = req.headers
    let definedResponseType

    if (req.url.endsWith('.json')) {
      definedResponseType = req.responseType
    } else if (req.responseType === 'json') {
      definedResponseType = 'text'
    } else {
      definedResponseType = req.responseType
    }

    if (!newHeaders.get('Content-Type')) {
      newHeaders = newHeaders.set('Content-Type', 'application/json')
    } else if (newHeaders.get('Content-Type') === 'multipart/form-data') {
      newHeaders = newHeaders.delete('Content-Type')
    } else if (newHeaders.get('Content-Type') === 'text/plain') {
      newHeaders = newHeaders.set('Content-Type', 'application/json')
    }
    newHeaders = newHeaders.set('x-channel', this.config.name)
    newHeaders = newHeaders.set('x-platform', getOs())
    newHeaders = newHeaders.set('x-version', this.config.version)
    newHeaders=newHeaders.set('x-uuid',uuidv4())

    let authReq = req
    authReq = req.clone({
      headers: newHeaders,
      responseType: definedResponseType,
    })

    if (req.url.endsWith('.json')) {
      return next.handle(authReq)
    } else {
      return next.handle(authReq).pipe(
        map(
          (event: HttpEvent<any>) => {
            if (
              event instanceof HttpResponse &&
              req.responseType === 'json' &&
              event.headers.get('Content-Type').indexOf('application/html') ==
                -1
            ) {
              let nevent
              if (event.body.includes('%PDF')) {
                nevent = event.clone({ body: event.body })
              } else {
                nevent = event.clone({ body: JSON.parse(event.body) })
              }
              return nevent
            }
            return event
          },
          (error) => {
            return error
          },
        ),
      )
    }
  }
}

export interface AppResponse {
  errorCode: string
  errorDescription: string
  errorResponse: any
}

function getOs() {
  var OSName = 'Unknown OS'
  if (navigator.appVersion.indexOf('Win') != -1) OSName = 'Windows'
  if (navigator.appVersion.indexOf('Mac') != -1) OSName = 'MacOS'
  if (navigator.appVersion.indexOf('X11') != -1) OSName = 'UNIX'
  if (navigator.appVersion.indexOf('Linux') != -1) OSName = 'Linux'
  return OSName
}
