import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../../core/config/config.resource.local'
import { Exception } from '../../../../../Model/exception'

@Injectable()
export class AccountRulesService {
  private serviceUrl: string

  mockAccount = [
    {
      accountNumber: '204000010006080932741',
    },
  ]

  constructor(private http: HttpClient, public config: ConfigResourceService) {
    this.serviceUrl = this.config.getServicesUrl()
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

  getAccounts() {
    const url = this.serviceUrl + '/workflow/accounts/getAccounts'
    return this.http.get(url).pipe(
      map((response: any) => {
        const body = response
        if (response.errorCode !== '0') {
          const errorService: Exception = new Exception(
            body.errorCode,
            body.errorDescription,
          )
          return observableThrowError(errorService)
        } else {
          const result = response.accountList
          return result
        }
      }),
      catchError(this.handleError),
    )
  }

  getAccountRules(account) {
    const data = {
      accountNumber: account,
    }
    return this.http
      .post(this.serviceUrl + '/workflow/accounts/getLevels', data)
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
            body.workflowTypePaymentList.sort((a, b) => {
              if (a.paymentId < b.paymentId) {
                return -1
              }
              if (a.paymentId > b.paymentId) {
                return 1
              }
              return 0
            })
            body.workflowTypePaymentList.forEach((p) => {
              if (p.details) {
                p.details.sort((a, b) => {
                  if (a.amountMin !== b.amountMin) {
                    return a.amountMin - b.amountMin
                  }
                  return a.amountMax - b.amountMax
                })
              }
            })
            return body
          }
        }),
        catchError(this.handleError),
      )
  }

  validateAccountRules(workflowTypePaymentList: any) {
    const data = {
      workflowAccountBatch: workflowTypePaymentList,
    }
    return this.http
      .post(this.serviceUrl + '/workflow/accounts/validate', data)
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

  confirmAccountRules(values: any, _requestValidate: any) {
    const data = {
      batchList: values,
      requestValidate: _requestValidate,
    }
    return this.http
      .post(this.serviceUrl + '/workflow/accounts/confirm', data)
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
