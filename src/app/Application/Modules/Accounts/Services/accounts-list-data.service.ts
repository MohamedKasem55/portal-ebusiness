import { HttpClient, HttpResponse } from '@angular/common/http'
/**
 * Service to obtain the balance certificate
 */
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from 'app/Application/Model/exception'

@Injectable()
export class AccountsList {
  token: string
  servicesUrl: string
  currentUser

  constructor(private http: HttpClient, public config: ConfigResourceService) {
    this.servicesUrl = config.getServicesUrl()
  }

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

  public getAccountsList(): Observable<any> {
    return this.http.get(this.servicesUrl + '/accounts/nicknameList').pipe(
      map((response: any) => response),
      catchError(this.handleError),
    )
  }

  public getAccountsInquiry(): Observable<any> {
    const data = {
      order: '',
      orderType: '',
      page: 1,
      rows: 100,
      txType: 'ECIA',
    }
    return this.http.post(this.servicesUrl + '/accounts', data).pipe(
      map((response: any) => response),
      catchError(this.handleError),
    )
  }

  public getAccountsCombo(): Observable<any> {
    const data = {
      order: '',
      orderType: '',
      page: 1,
      rows: 100,
      txType: 'ECIA',
    }
    return this.http.post(this.servicesUrl + '/accounts/combo', data).pipe(
      map((response: any) => response),
      catchError(this.handleError),
    )
  }
}
