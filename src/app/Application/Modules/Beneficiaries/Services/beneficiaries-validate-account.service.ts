/**
 * Service to obtain the balance certificate
 */
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from '../../../Model/exception'
@Injectable()
export class ValidateAccount {
  public token: string
  public servicesUrl: string
  public currentUser

  constructor(private http: HttpClient, public config: ConfigResourceService) {
    this.servicesUrl = config.getServicesUrl()
  }

  // Service management error
  public handleError(error: HttpResponse<any> | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string
    if (error instanceof HttpResponse) {
      const err = error['error'] || JSON.stringify(error)
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`
    } else {
      errMsg = error.message ? error.message : error.toString()
    }
    console.error(errMsg)
    const errorService: Exception = new Exception('handle', errMsg)
    return observableThrowError(errorService)
  }

  public getVelidationAccount(account: string): Observable<any> {
    return this.http
      .get(this.servicesUrl + '/beneficiaries/within/' + account + '/valid')
      .pipe(
        map((response: any) => response),
        catchError(this.handleError),
      )
  }

  public getVelidatioAddAccount(account: string, params: any): Observable<any> {
    // Input params

    return this.http
      .post(
        this.servicesUrl + '/beneficiaries/within/' + account + '/validateAdd',
        params,
      )
      .pipe(
        map((response: any) => {
          const body = response
          return body || {}
        }),
        catchError(this.handleError),
      )
  }
}
