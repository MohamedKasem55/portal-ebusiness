import { DatePipe } from '@angular/common'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../../core/config/config.resource.local'
import { Exception } from '../../../../../Model/exception'

@Injectable()
export class NewPaymentService {
  servicesUrl: string

  constructor(
    private http: HttpClient,
    private config: ConfigResourceService,
    private datePipe: DatePipe,
    private router: Router,
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

  public initPayment(): Observable<any> {
    return this.http
      .get(this.servicesUrl + '/aramcoPaymets/initNewPayment')
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

  public validate(dataPayment, accounts): Observable<any> {
    const data = {
      listPayments: [],
    }
    for (let i = 0; i < dataPayment.length; ++i) {
      data.listPayments.push({
        accountNumber:
          accounts[dataPayment[i].controls.account.value].value
            .fullAccountNumber,
        amount: dataPayment[i].controls.amount.value,
        aramcoBeneficiary: {
          customerId: dataPayment[i].controls.customerId.value,
          customerName: dataPayment[i].controls.customerName.value,
        },
      })
    }

    return this.http
      .post(this.servicesUrl + '/aramcoPaymets/validate', data)
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

  public confirm(dataPayment, requestValidate): Observable<any> {
    const data = {
      requestValidate,
      aramcoBatchList: dataPayment,
    }

    return this.http
      .post(this.servicesUrl + '/aramcoPaymets/confirm', data)
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
}
