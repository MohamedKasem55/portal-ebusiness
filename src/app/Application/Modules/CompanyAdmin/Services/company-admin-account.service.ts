import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from 'app/Application/Model/exception'

@Injectable()
export class CompanyAdminAccountsService {
  constructor(private http: HttpClient, public config: ConfigResourceService) {}

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

  getAccounts(): Observable<any> {
    const data: any = {}
    const url = this.config.getServicesUrl() + '/posStatement/getAccountsAdmin'
    return this.http.get(url, { params: data }).pipe(
      map((response: any) => {
        const body = response
        if (response.errorCode !== '0') {
          const errorService: Exception = new Exception(
            body.errorCode,
            body.errorDescription,
          )
          return errorService
        } else {
          const output = response
          const result = output

          return result
        }
      }),
      catchError(this.handleError),
    )
  }

  saveAccount(account: any): Observable<any> {
    const data = {
      accountListDTO: account.accountListDTO,
      permissionList: account.permissionList,
      posAccountsOutDTO: account.posAccountsOutDTO,
      page: 1,
      rows: account.accountListDTO.length,
    }

    const url =
      this.config.getServicesUrl() + '/posStatement/selectAccountsAdminConfirm '

    return this.http.post(url, data).pipe(
      map((response: any) => {
        const body = response
        if (
          response.errorCode !== '0' ||
          (response.listPosAccountsAdded == null &&
            response.listPosAccountsRemoved == null)
        ) {
          return response
        } else {
          const output = response
          const result = output

          return result
        }
      }),
      catchError(this.handleError),
    )
  }

  getAllAccounts() {
    const data = { page: 1, rows: 100, txType: 'ECIA' }

    return this.http
      .post(this.config.getServicesUrl() + '/companyAdmin/accounts', data)
      .pipe(
        map((result) => {
          let accounts = []

          if (typeof result['listAccount'] !== 'undefined') {
            accounts = result['listAccount']
          }
          return accounts
        }),
      )
  }
}
