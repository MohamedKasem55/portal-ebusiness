import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { Exception } from '../../../../Model/exception'

@Injectable()
export class CompanyAdminPositivePayChequeAccountsService {
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

  public getAccounts(): Observable<any> {
    return this.http
      .get(this.servicesUrl + '/positivePayCheck/admin/accounts')
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
            const output: any = {}
            output.accountList = body.accountList
            output.permissionList = body.permissionList
            output.totalPage = body.accountList.length
            output.sizePage = body.accountList.length
            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  public validateAccounts(accounts) {
    const accountNumber: any[] = []
    for (const account of accounts) {
      accountNumber.push(account.fullAccountNumber)
    }

    const data = {
      listAccountPositivePay: accountNumber,
    }
    return this.http
      .post(`${this.servicesUrl}/positivePayCheck/admin/validate`, data)
      .pipe(
        map((res: any) => {
          const body = res
          if (res.errorCode !== '0' || res.positivePayCheckOutput == null) {
            return res
          } else {
            const output: any = {}
            output.positivePayCheckOutput =
              body.positivePayCheckOutput.positivePayCheckAccountsOutDTO
            output.positivePayCheckOutout = body.positivePayCheckOutout
            output.positivePayCheckOutput.totalElements =
              output.positivePayCheckOutput.length
            output.positivePayCheckOutput.sizePage =
              output.positivePayCheckOutput.length
            output.positivePayCheckOutput.totalPage =
              output.positivePayCheckOutput.totalElements /
              output.positivePayCheckOutput.sizePage
            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  public confirm(data): Observable<any> {
    return this.http
      .post(this.servicesUrl + '/positivePayCheck/admin/confirm', data)
      .pipe(
        map((response: any, index: number) => {
          let result: any = {}

          const output = response

          if (output.errorCode !== '0') {
            result.error = true
            result.errorCode = output.errorCode
            result.errorDescription = output.errorDescription
            if (output.errorCode === '-3') {
              result.generateChallengeAndOTP = output.generateChallengeAndOTP
            }
          } else {
            result = output
            result.error = false
          }
          return result
        }),
      )
  }
}
