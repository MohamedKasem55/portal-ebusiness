import { Injectable } from '@angular/core'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { Exception } from '../../../Model/exception'

@Injectable({
  providedIn: 'root',
})
export class OpenAdditionalAccountService {
  servicesUrl: string

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

  public getEligibilityInquiry(relationTypeCode: any): Observable<any> {
    const data = { relationTypeCode: relationTypeCode, subcategory: '' }
    return this.http
      .get(this.servicesUrl + '/accounts/eligibilityInquiry', { params: data })
      .pipe(
        map((response: any) => response),
        catchError(this.handleError),
      )
  }

  public getsubcategoryInquiry(currency: any): Observable<any> {
    const data = {
      relationTypeCode: 'CUR',
      currency: currency,
      accountTypeCode: 'NOR',
    }
    return this.http
      .get(this.servicesUrl + '/accounts/subcategoryInquiry', { params: data })
      .pipe(
        map((response: any) => response),
        catchError(this.handleError),
      )
  }

  public createAccount(data: any): Observable<any> {
    const body = data
    return this.http
      .post(this.servicesUrl + '/accounts/createAccount/confirm', body)
      .pipe(
        map((response: any) => response),
        catchError(this.handleError),
      )
  }

  public validateAccount(data: any): Observable<any> {
    const body = data
    return this.http
      .post(this.servicesUrl + '/accounts/createAccount/validate', body)
      .pipe(
        map((response: any) => response),
        catchError(this.handleError),
      )
  }
}
