import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { DateFormatPipe } from '../../../Components/common/Pipes/date-format-pipe'
import { Account } from '../../../Model/account'
import { Page } from '../../../Model/page'
import { PagedData } from '../../../Model/paged-data'

@Injectable()
export class AccountsCaAccountService {
  servicesUrl: string

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    private router: Router,
    private dateFormatPipe: DateFormatPipe,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  public getAllAccounts(
    order: string,
    orderType: string,
    page: number,
    rows: number,
    txType: string,
  ): Observable<PagedData<Account>> {
    const data = { order, orderType, page, rows, txType }

    //const body = JSON.stringify(data);
    //
    return this.http
      .post(this.servicesUrl + '/companyAdmin/accounts', data)
      .pipe(
        map((response: any) => {
          //
          const pagedData = new PagedData<Account>()

          const pageObject = new Page()
          pageObject.pageNumber = page
          pageObject.pageSize = rows
          pageObject.size = response.size
          pageObject.totalElements = response.total
          pageObject.totalPages = pageObject.totalElements / pageObject.pageSize

          const size = response.size

          for (let _i = 0; _i < size; _i++) {
            const jsonObj = response.listAccount[_i]

            pagedData.data.push(jsonObj as Account)
          }
          pagedData.page = pageObject
          pagedData['totalBalance'] = response.totalBalance
          pagedData['currencyBalance'] = response.currencyBalance
          pagedData['customerName'] =
            typeof response.customerName !== 'undefined'
              ? response.customerName
              : ''

          return pagedData
        }),
      )
  }
}
