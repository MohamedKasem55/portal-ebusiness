import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { AuthenticationService } from '../../../core/security/authentication.service'
import { ConfigResourceService } from '../../../core/config/config.resource.local'
import { Injector } from '@angular/core'

import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

@Injectable()
export class EtradeService {
  private servicesUrl: string
  baseRoute = '/eTrade/url'
  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    public authenticationService: AuthenticationService,
    private injector: Injector,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  getData() {
    return this.http
      .get<Observable<any>>(this.servicesUrl + this.baseRoute)
      .pipe(
        map((res) => res),
        catchError((err, caught) => {
          const result: any = {}
          result.error = true
          result.errorCode = -1
          result.errorDescription = 'Operation not available'
          return err
        }),
      )
  }

  getURL(data){
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    })
    // const body = JSON.parse(JSON.stringify(data.body))
    const body = new HttpParams()
    .set('AuthToken', data.body.AuthToken)
    .set('jsonbodyrequest', data.body.jsonbodyrequest)
    .set('signedJsonbodyrequest', data.body.signedJsonbodyrequest)
    return this.http
      .post<Observable<any>>(data.url, body.toString(), {headers})
      .pipe(
        map((res) => res),
        catchError((err, caught) => {
          const result: any = {}
          result.error = true
          result.errorCode = -1
          result.errorDescription = 'Operation not available'
          return err
        }),
      )
  }
}
