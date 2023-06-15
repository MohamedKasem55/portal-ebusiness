import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { DateFormatPipe } from '../../../../Components/common/Pipes/date-format-pipe'
import { Exception } from '../../../../Model/exception'

@Injectable()
export class SearchByChequeNumberService {
  servicesUrl: string
  dateFormat = 'yyyy-MM-dd'

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    private dateFormatPipe: DateFormatPipe,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  public getAccounts(): Observable<any> {
    return this.http.get(this.servicesUrl + '/positivePayCheck/list').pipe(
      map((response: any) => {
        const body = response
        if (response.errorCode !== '0') {
          const exception: Exception = new Exception(
            body.errorCode,
            body.errorDescription,
          )
          return observableThrowError(exception)
        } else {
          const output = body.accountListPositivePay
          return output
        }
      }),
      catchError(this.handleError),
    )
  }

  public getChequeNumber(data): Observable<any> {
    return this.http
      .post(this.servicesUrl + '/positivePayCheck/searchCheckNumber', data)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return observableThrowError(exception)
          } else {
            const output = body.positivePayCheck
            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  public deleteChequeNumber(
    accountNumber,
    amount,
    chequeNumber,
  ): Observable<any> {
    const data = {
      accountNumber,
      amount,
      checkNumber: chequeNumber,
    }

    let _param: HttpParams = new HttpParams()
    _param = _param.append('deletebody', JSON.stringify(data))

    return this.http
      .delete(this.servicesUrl + '/positivePayCheck/deleteChecks', {
        params: _param,
      })
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return observableThrowError(exception)
          } else {
            const output = body
            return output
          }
        }),
        catchError(this.handleError),
      )
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
}
