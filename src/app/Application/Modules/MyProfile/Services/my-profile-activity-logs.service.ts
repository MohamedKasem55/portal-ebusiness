import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from '../../../Model/exception'
import { Page } from '../../../Model/page'
import { PagedData } from '../../../Model/paged-data'
import { ModelServiceActivityLog } from '../Model/my-profile-activity-logs-service.model'

@Injectable()
export class MyProfileActivityLogsService {
  token: string
  servicesUrl: string

  constructor(private http: HttpClient, public config: ConfigResourceService) {
    this.servicesUrl = config.getServicesUrl()
  }

  public getResults(
    authorities: string,
    operation: string,
    dateFrom: Date,
    dateTo: Date,
    order: string,
    orderType: string,
    page: number,
    rows: number,
    user: string,
  ): Observable<PagedData<ModelServiceActivityLog>> {
    let orderMap
    switch (order) {
      case 'operationLog':
        orderMap = 'operation'
        break
      case 'timeStamp':
        orderMap = 'time'
        break
      default:
        orderMap = order
    }
    const data = {
      authorities,
      dateFrom,
      dateTo,
      operation,
      order: orderMap,
      orderType,
      page,
      rows,
      userId: user,
    }
    return this.http.post(this.servicesUrl + '/audit', data).pipe(
      map((response: any) => {
        const body = response
        if (response.errorCode !== '0') {
          return null
        } else {
          return this.responseToPagedData(body, page, rows)
        }
      }),
      catchError(this.handleError),
    )
  }

  public requestReport(
    authorities: string,
    operation: string,
    dateFrom: Date,
    dateTo: Date,
    order: string,
    orderType: string,
    page: number,
    rows: number,
    user: string,
  ): Observable<PagedData<ModelServiceActivityLog>> {
    const data = {
      authorities,
      dateFrom,
      dateTo,
      operation,
      order,
      orderType,
      page: page + 1,
      rows,
      userId: user,
    }
    //console.log('request report data: ', data);
    return this.http.post(this.servicesUrl + '/audit/report', data).pipe(
      map((response: any) => {
        const body = response

        if (response.errorCode !== '0') {
          //console.log("errorCode !== "0""+response.errorCode);
          //return this.responseToPagedData(MockAuditData,page,rows);
          return null
        } else {
          return response
        }
      }),
      catchError(this.handleError),
    )
  }

  private responseToPagedData(
    body: any,
    page: number,
    rows: number,
  ): PagedData<ModelServiceActivityLog> {
    const output = body.auditReporLines.items
    const pagedData = new PagedData<ModelServiceActivityLog>()
    const pageObject = new Page()

    pageObject.pageNumber = page
    pageObject.pageSize = rows
    pageObject.size = body.size
    pageObject.totalElements = body.total
    pageObject.totalPages = pageObject.totalElements / pageObject.pageSize

    for (let i = 0; i < pageObject.size; i++) {
      const jsonObj = output[i]
      const list = new ModelServiceActivityLog(
        jsonObj.auditLinePk,
        jsonObj.operation,
        jsonObj.userName,
        jsonObj.userId,
        jsonObj.timeStamp.substring(0, 10),
        jsonObj.timeStamp.substring(11, 19),
        jsonObj.status,
        jsonObj.companyId,
        jsonObj.userType,
      )
      pagedData.data.push(list)
    }
    pagedData.page = pageObject
    //console.log('pagedData: '+JSON.stringify(pagedData));
    return pagedData
  }

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
    //console.error(errMsg);
    const errorService: Exception = new Exception('handle', errMsg)
    return observableThrowError(errorService)
  }
}
