import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from '../../../Model/exception'
import { Page } from '../../../Model/page'
import { PagedData } from '../../../Model/paged-data'
import { AccountsPosTerminalList } from '../Model/accounts-pos-terminal-list'

@Injectable()
export class AccountsPosSearchPanelRequest {
  token: string
  servicesUrl: string
  currentUser
  tableSelectedRows: []

  constructor(private http: HttpClient, public config: ConfigResourceService) {
    this.servicesUrl = config.getServicesUrl()
  }

  // Service management error
  // Service management error
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

  public getDataForDataTable(params: any): Observable<any> {
    const pre = JSON.stringify(params)

    return this.http
      .post(this.servicesUrl + '/posStatementCU/searchTerminals', pre)
      .pipe(
        map((response: any) => {
          const result: any = {}
          const body = response

          if (response.errorCode !== '0') {
            return null
          } else {
            const output = body.terminalOutputDto.items
            const pagedData = new PagedData<AccountsPosTerminalList>()
            const pageObject = new Page()

            result.terminalOutputDto = []

            pageObject.pageNumber = params.page
            pageObject.pageSize = params.rows
            pageObject.size = body.terminalOutputDto.size
            pageObject.totalElements = body.terminalOutputDto.total
            pageObject.totalPages =
              pageObject.totalElements / pageObject.pageSize

            for (let i = 0; i < pageObject.size; i++) {
              const jsonObj = output[i]
              jsonObj.cityName = jsonObj.city
              result.terminalOutputDto.push(jsonObj)

              const list = new AccountsPosTerminalList(
                jsonObj.name,
                jsonObj.terminalId,
                jsonObj.account,
                jsonObj.location,
                jsonObj.region,
                jsonObj.city,
                jsonObj.mobile,
              )
              pagedData.data.push(list)
            }
            result.page = pageObject
            result.pagedData = pagedData
            result.accountListPos = body.accountListPos

            return result
          }
        }),
        catchError(this.handleError),
      )
  }
}
