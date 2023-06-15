import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from 'app/Application/Model/exception'
import { Page } from '../../../Model/page'
import { PagedData } from '../../../Model/paged-data'
import { TokenStatus } from '../Model/token-status.model'
import { tokenList } from '../Model/tokenList'

@Injectable()
export class CompanyAdminTokenManagmentService {
  private hostUrl: string

  constructor(private http: HttpClient, public config: ConfigResourceService) {
    this.hostUrl = this.config.getServicesUrl()
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

  public getTokenList(
    pageNumber: number,
    rows4page: number,
    order: string,
    orderType: string,
  ): Observable<any> {
    const data = {
      page: pageNumber,
      rows: rows4page,
      order,
      orderType,
    }
    const url = this.config.getServicesUrl() + '/tokenManagment'

    return this.http.post(url, data).pipe(
      map((response: any) => {
        const body = response
        if (response.errorCode !== '0') {
          const errorService: Exception = new Exception(
            body.errorCode,
            body.errorDescription,
          )
          return observableThrowError(errorService)
        } else {
          const output = response
          return this.responseToPagedData(output, pageNumber, rows4page)
        }
      }),
      catchError(this.handleError),
    )
  }

  public getSummary(): Observable<any> {
    const body = {
      page: 1,
      rows: 10,
    }

    return this.http
      .post(`${this.hostUrl}/tokenManagment/summary`, body)
      .pipe(map((r) => r))
  }

  responseToPagedData(output, pageNumber, rows4page): PagedData<tokenList> {
    const pagedData = new PagedData<tokenList>()
    const page = new Page()
    page.pageNumber = pageNumber
    page.pageSize = rows4page
    page.size = output.size
    page.totalElements = output.total
    page.totalPages = page.totalElements / page.size
    const size = output.size
    for (let i = 0; i < size; i++) {
      const jsonObj = output.pagedResults[i]
      const list = new tokenList(
        jsonObj.active,
        jsonObj.blocked,
        jsonObj.companyProfileNumber,
        jsonObj.icoNumber,
        jsonObj.lost,
        jsonObj.nonOperative,
        jsonObj.tokenSerialNumber,
        jsonObj.tokenStatus,
        jsonObj.tokenType,
        jsonObj.unassigned,
        jsonObj.userId,
        jsonObj.userName,
      )
      pagedData.data.push(list)
    }
    pagedData.page = page
    return pagedData
  }

  getTokenStatus(tokenSerial: string): Observable<any> {
    const url = this.config.getServicesUrl() + '/tokenManagment'
    return this.http.get(url + '/' + tokenSerial).pipe(
      map((response: any) => {
        const body = response
        if (response.errorCode !== '0') {
          const errorService: Exception = new Exception(
            body.errorCode,
            body.errorDescription,
          )
          return observableThrowError(errorService)
        } else {
          const output = response
          //let output = ModelTokenSatusMock;
          const jsonObject = output.assignmentStatus
          return new TokenStatus(
            jsonObject.active,
            jsonObject.blocked,
            jsonObject.companyProfileNumber,
            jsonObject.icoNumber,
            jsonObject.lost,
            jsonObject.nonOperative,
            jsonObject.tokenSerialNumber,
            jsonObject.tokenStatus,
            jsonObject.tokenType,
            jsonObject.unassigned,
            jsonObject.userId,
            jsonObject.userName,
          )
        }
      }),
      catchError(this.handleError),
    )
  }

  editTokenStatus(serial: string, state: string): Observable<any> {
    const url = this.config.getServicesUrl() + '/tokenManagment'
    return this.http.put(url + '/' + serial + '/' + encodeURI(state), {}).pipe(
      map((response: any) => {
        const body = response
        if (response.errorCode !== '0') {
          const errorService: Exception = new Exception(
            body.errorCode,
            body.errorDescription,
          )
          return observableThrowError(errorService)
        } else {
          return body
        }
      }),
    )
  }
}
