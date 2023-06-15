import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { DateFormatPipe } from '../../../../Components/common/Pipes/date-format-pipe'
import { Exception } from '../../../../Model/exception'

@Injectable()
export class RequestReactivateService {
  servicesUrl: string
  dateFormat = 'yyyy-MM-dd'

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    private dateFormatPipe: DateFormatPipe,
  ) {
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

  public validate(batch, form, accounts): Observable<any> {
    //console.log('acounts',accounts,form.account);
    const data = {
      accountNumber: accounts[form.account].value.fullAccountNumber,
      amount: form.amount,
      aramcoBatch: batch,
    }
    return this.http
      .post(this.servicesUrl + '/aramcoPaymets/requestStatus/validate', data)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
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

  public save(batch, requestValidate): Observable<any> {
    const data = {
      aramcoBatch: batch,
      requestValidate,
    }

    return this.http
      .post(this.servicesUrl + '/aramcoPaymets/requestStatus/confirm', data)
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

  public delete(batch): Observable<any> {
    const data = {
      aramcoBatch: batch,
    }
    // const  _param: HttpParams = new  HttpParams ().append("deletebody", JSON.stringify(data));

    return this.http
      .post(this.servicesUrl + '/aramcoPaymets/requestStatus/delete', data)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
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
