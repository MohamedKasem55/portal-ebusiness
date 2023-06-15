import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { AuthenticationService } from '../../../../core/security/authentication.service'
import { Page } from '../../../Model/page'
import { Account } from 'app/Application/Model/account'

@Injectable()
export class AccountBalanceService {
  servicesUrl: string

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    public authenticationService: AuthenticationService,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  public getResults(
    order: string,
    orderType: string,
    page: number,
    rows: number,
    txType: string,
  ): Observable<any> {
    const data = {
      order,
      orderType,
      page: page + 1,
      rows,
      txType,
    }

    return this.http.post(this.servicesUrl + '/accounts', data).pipe(
      map((response: any) => {
        const output = response
        const pagedData: any = {}
        pagedData.data = []

        const pageObject = new Page()

        pageObject.pageNumber = page
        pageObject.pageSize = rows
        pageObject.size = output.size
        pageObject.totalElements = output.total
        pageObject.totalPages = pageObject.totalElements / pageObject.pageSize

        const size = output.size

        for (let _i = 0; _i < size; _i++) {
          const jsonObj = output.listAccount[_i]

          pagedData.data.push(jsonObj as Account)
        }
        pagedData.page = pageObject

        pagedData.totalBalance = output.totalBalance
        pagedData.currencyBalance = output.currencyBalance
        return pagedData
      }),
    )
  }

  public getUserAccounts(
    order: string,
    orderType: string,
    page: number,
    rows: number,
    txType: string,
  ): Observable<any> {
    const data = {
      order,
      orderType,
      page: page + 1,
      rows,
      txType,
    }

    return this.http.post(this.servicesUrl + '/accounts/dashboard', data).pipe(
      map((response: any) => {
        const output = response
        const pagedData: any = {}
        pagedData.data = []

        const pageObject = new Page()

        pageObject.pageNumber = page
        pageObject.pageSize = rows
        pageObject.size = output.size
        pageObject.totalElements = output.total
        pageObject.totalPages = pageObject.totalElements / pageObject.pageSize

        const size = output.size

        for (let _i = 0; _i < size; _i++) {
          const jsonObj = output.listAccount[_i]

          pagedData.data.push(jsonObj as Account)
        }
        pagedData.page = pageObject

        pagedData.totalBalance = output.totalBalance
        pagedData.currencyBalance = output.currencyBalance
        return pagedData
      }),
    )
  }

  public saveUserAccounts(selectedAccounts: Account[]) {
    const body = {}
    body['accounts'] = selectedAccounts
    return this.http.put(this.servicesUrl + '/accounts/dashboard', body).pipe(
      map((response: any) => {
        return response
      }),
    )
  }

  public getAccounts(txType: string): Observable<Array<Account>> {
    const data = {
      order: '',
      orderType: '',
      page: 1,
      rows: 100,
      txType,
    }

    return this.http.post(this.servicesUrl + '/accounts', data).pipe(
      map((response: any) => {
        const result = new Array<Account>()

        const output = response

        const size = output.size

        for (let _i = 0; _i < size; _i++) {
          result.push(output.listAccount[_i] as Account)
        }

        return result
      }),
    )
  }
}
