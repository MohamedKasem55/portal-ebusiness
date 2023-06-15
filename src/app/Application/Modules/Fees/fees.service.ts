import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../core/config/config.resource.local'
import { Exception } from '../../Model/exception'

@Injectable()
export class FeesService {
  private _servicesUrl: string

  constructor(
    private _httpClient: HttpClient,
    private _config: ConfigResourceService,
  ) {
    this._servicesUrl = _config.getServicesUrl()
  }

  public getGeneralFees(): Observable<any> {
    return this._httpClient
      .get<any>(this._servicesUrl + '/feesManagement/generalFees')
      .pipe(
        map((res) => {
          if (res.errorCode !== '0') {
            const exception = new Exception(res.errorCode, res.errorDescription)
            return throwError(exception)
          }
          return res.generalFees
        }),
        catchError(this._handleError),
      )
  }

  public getPayRollFees(): Observable<any> {
    return this._httpClient
      .get<any>(this._servicesUrl + '/feesManagement/payroll')
      .pipe(
        map((res) => {
          if (res.errorCode !== '0') {
            const exception = new Exception(res.errorCode, res.errorDescription)
            return throwError(exception)
          }
          return res
        }),
        catchError(this._handleError),
      )
  }

  public getWPSPayRollFees(): Observable<any> {
    return this._httpClient
      .get<any>(this._servicesUrl + '/feesManagement/WPSpayroll')
      .pipe(
        map((res) => {
          if (res.errorCode !== '0') {
            const exception = new Exception(res.errorCode, res.errorDescription)
            return throwError(exception)
          }
          return res
        }),
        catchError(this._handleError),
      )
  }

  public getPayrollCardFees(): Observable<any> {
    return this._httpClient
      .get<any>(this._servicesUrl + '/feesManagement/payrollCards')
      .pipe(
        map((res) => {
          if (res.errorCode !== '0') {
            const exception = new Exception(res.errorCode, res.errorDescription)
            return throwError(exception)
          }
          return res
        }),
        catchError(this._handleError),
      )
  }

  public getBulkPaymentFees(): Observable<any> {
    return this._httpClient
      .get<any>(this._servicesUrl + '/feesManagement/bulkPaymentFees')
      .pipe(
        map((res) => {
          if (res.errorCode !== '0') {
            const exception = new Exception(res.errorCode, res.errorDescription)
            return throwError(exception)
          }
          return res
        }),
        catchError(this._handleError),
      )
  }

  private _handleError(error: HttpResponse<any> | any) {
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
    return throwError(errorService)
  }
}
