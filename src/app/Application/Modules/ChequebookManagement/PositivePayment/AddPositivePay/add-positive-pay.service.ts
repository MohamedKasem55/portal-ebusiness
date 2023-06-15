import { DecimalPipe } from '@angular/common'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Inject, Injectable, LOCALE_ID } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { DateFormatPipe } from '../../../../Components/common/Pipes/date-format-pipe'
import { Exception } from '../../../../Model/exception'

@Injectable()
export class AddPositivePayService {
  servicesUrl: string
  dateFormat = 'yyyy-MM-dd'

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    private dateFormatPipe: DateFormatPipe,
    @Inject(LOCALE_ID) private locale: string,
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

  public addPositivePay(data: any): Observable<any> {
    const output: any = {}
    return this.http
      .post(this.servicesUrl + '/positivePayCheck/add', data)
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
            output.items = body.positivePayCheck
            // output.totalElements = body.positivePayCheck.total;
            // output.pageSize = body.positivePayCheck.size;
            // output.pageNumber = body.positivePayCheck.total / body.positivePayCheck.size;

            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  public validatePositivePay(element: any): Observable<any> {
    const decimalPipe = new DecimalPipe(this.locale)
    const data = {
      accountNumber: element.account,
      amount: decimalPipe.transform(element.amount, '1.2-2').replace(/,/g, ''),
      checkNumber: element.chequeNumber,
    }
    return this.http
      .post(this.servicesUrl + '/positivePayCheck/add/validate', data)
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
            return body
          }
        }),
        catchError(this.handleError),
      )
  }

  public confirmPositivePay(batch: any, requestValidate: any): Observable<any> {
    const data = {
      batch,
      requestValidate,
    }
    return this.http
      .post(this.servicesUrl + '/positivePayCheck/add/confirm', data)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
              body.generateChallengeAndOTP,
            )
            return exception
          } else {
            return body
          }
        }),
        catchError(this.handleError),
      )
  }
}
