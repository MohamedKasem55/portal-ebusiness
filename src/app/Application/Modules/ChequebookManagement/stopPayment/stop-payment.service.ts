import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { DateFormatPipe } from '../../../Components/common/Pipes/date-format-pipe'
import { Exception } from 'app/Application/Model/exception'

@Injectable()
export class StopPaymentService {
  servicesUrl: string
  dateFormat = 'yyyy-MM-dd'

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    private dateFormatPipe: DateFormatPipe,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  public getchequebookList(data: any): Observable<any> {
    return this.http
      .post(this.servicesUrl + '/chequeBook/stop/validate', data)
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

  public stopChequeConfirm(cheque: any, requestValidate: any): Observable<any> {
    const data = {
      batch: cheque,
      requestValidate,
    }

    return this.http
      .post(this.servicesUrl + '/chequeBook/stop/confirm', data)
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
            const output = body
            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  public getAccounts(): Observable<any> {
    return this.http.get(this.servicesUrl + '/userProfile/getSARAccounts').pipe(
      map((response: any) => {
        const body = response
        if (response.errorCode !== '0') {
          const exception: Exception = new Exception(
            body.errorCode,
            body.errorDescription,
          )
          return observableThrowError(exception)
        } else {
          const output = body.listAlertsPermissionAccount
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
