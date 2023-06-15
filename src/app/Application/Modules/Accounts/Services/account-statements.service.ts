import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Page } from '../../../Model/page'
import { PagedData } from '../../../Model/paged-data'

@Injectable({
  providedIn: 'root',
})
export class AccountStatementsService {
  servicesUrl: string
  page: number
  rows: number

  constructor(private http: HttpClient, public config: ConfigResourceService) {
    this.servicesUrl = config.getServicesUrl()
  }

  public list(): Observable<any> {
    this.page = 1
    this.rows = 20

    const body = { parameter: '' } // Body value is neededless
    return this.http
      .post(this.servicesUrl + '/accountsStatements/requested/list', body)
      .pipe(
        map((response: any) => {
          const result: any = {}
          const _body = response

          if (response.errorCode !== '0') {
            return null
          } else {
            const output = _body.listStatement
            const pagedData = new PagedData<any>()
            const pageObject = new Page()

            result.listStatement = []

            pageObject.pageNumber = this.page
            pageObject.pageSize = 5
            pageObject.size = _body.listStatement.length
            pageObject.totalElements = _body.listStatement.length
            pageObject.totalPages =
              pageObject.totalElements / pageObject.pageSize

            _body.listStatement.forEach((element) => {
              result.listStatement.push({ element })
              pagedData.data.push({ element })
            })
            //body.listStatement.forEach(element => {pagedData.data.push({element});});
            result.page = pageObject
            result.pagedData = pagedData
            return result
          }
        }),
      )
  }

  public download(body: { parameter: string }): Observable<any> {
    return this.http
      .post(this.servicesUrl + '/accountsStatements/requested/download', body, {
        responseType: 'blob',
      })
      .pipe(map((response: any) => response))
  }

  public delete(filenames: string[]): Observable<any> {
    const data = { filenames }

    let params: HttpParams = new HttpParams()
    params = params.append('deletebody', JSON.stringify(data))

    return this.http
      .delete(this.servicesUrl + '/accountsStatements/requested/delete', {
        params,
      })
      .pipe(map((response: any) => response))
  }

  public requestedNew(body: AccountStatementRequest): Observable<any> {
    return this.http
      .post(this.servicesUrl + '/accountsStatements/requested/new', body)
      .pipe(map((response: any) => response))
  }
}

export interface AccountStatementRequest {
  accountNumber: string
  amountFrom: string
  amountTo: string
  dateFrom: string
  dateTo: string
  filterBySelected?: string[]
  language: string
  type: string
  typeTransaction: number
}
