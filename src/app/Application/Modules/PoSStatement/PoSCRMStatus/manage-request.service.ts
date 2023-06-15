import { DatePipe } from '@angular/common'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { forkJoin, Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from '../../../Model/exception'
import { Page } from '../../../Model/page'
import { PagedData } from '../../../Model/paged-data'

@Injectable()
export class ManageRequestService {
  servicesUrl: string

  civili = null
  employeeNumber = null
  employeeName = null
  dataB: any

  public typeRequest = 'R'
  public typeManagement = 'G'
  public typeMaintenance = 'M'

  constructor(
    public datePipe: DatePipe,
    private http: HttpClient,
    public config: ConfigResourceService,
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

  public getRequest(
    datos,
    pageNumber,
    rows,
    order,
    orderType,
  ): Observable<any> {
    const data = {
      ticketNumber: datos.requestId, //"string",
      type: datos.type, //"string",
      dateFrom: this.datePipe.transform(datos.dateFrom, 'yyyy-MM-dd'), //"string",
      dateTo: this.datePipe.transform(datos.dateTo, 'yyyy-MM-dd'), //"string",
      order,
      orderType,
      page: pageNumber, //0,
      rows, //0,
    }

    return this.http
      .post(this.servicesUrl + '/posManagement/crm/list', data)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode != 0) {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return exception
          } else {
            const output = body
            const pagedData = new PagedData<any>()
            const page = new Page()
            page.pageNumber = pageNumber
            page.pageSize = rows
            page.size = output.batchList.size
            page.totalElements = output.batchList.total
            page.totalPages = page.totalElements / page.size
            const size = output.size
            pagedData.page = page
            output.batchList.items.forEach((a) => {
              a['posCRMStatusType'] = a['typeRequest']
            })
            pagedData.data = output.batchList.items
            return pagedData
          }
        }),
        catchError(this.handleError),
      )
  }

  public getRequestBAD(
    datos,
    pageNumber,
    rows,
    order,
    orderType,
  ): Observable<any> {
    const data = {
      ticketNumber: datos.ticketNumber, //"string",
      type: datos.type, //"string",
      dateFrom: this.datePipe.transform(datos.dateFrom, 'yyyy-MM-dd'), //"string",
      dateTo: this.datePipe.transform(datos.dateTo, 'yyyy-MM-dd'), //"string",
      order,
      orderType,
      page: pageNumber, //0,
      rows, //0,
    }

    return forkJoin(
      this.http
        .post(this.servicesUrl + '/posManagement/maintenance/list', data)
        .pipe(
          map((response: any) => {
            const body = response
            if (response.errorCode != 0) {
              const exception: Exception = new Exception(
                body.errorCode,
                body.errorDescription,
              )
              return exception
            } else {
              const output = body
              const pagedData = new PagedData<any>()
              const page = new Page()
              page.pageNumber = pageNumber
              page.pageSize = rows
              page.size = output.batchList.size
              page.totalElements = output.batchList.total
              page.totalPages = page.totalElements / page.size
              const size = output.size
              pagedData.page = page
              output.batchList.items.forEach((a) => {
                a['posCRMStatusType'] = 'M' + a['typeRequest']
              })
              pagedData.data = output.batchList.items
              return pagedData
            }
          }),
          catchError(this.handleError),
        ),
      this.http
        .post(this.servicesUrl + '/posManagement/management/list', data)
        .pipe(
          map((response: any) => {
            const body = response
            if (response.errorCode != 0) {
              const exception: Exception = new Exception(
                body.errorCode,
                body.errorDescription,
              )
              return exception
            } else {
              const output = body
              const pagedData = new PagedData<any>()
              const page = new Page()
              page.pageNumber = pageNumber
              page.pageSize = rows
              page.size = output.batchList.size
              page.totalElements = output.batchList.total
              page.totalPages = page.totalElements / page.size
              const size = output.size
              pagedData.page = page
              output.batchList.items.forEach((a) => {
                a['posCRMStatusType'] = 'G' + a['typeRequest']
              })
              pagedData.data = output.batchList.items
              return pagedData
            }
          }),
          catchError(this.handleError),
        ),
      this.http
        .post(this.servicesUrl + '/posManagement/request/list', data)
        .pipe(
          map((response: any) => {
            const body = response
            if (response.errorCode != 0) {
              const exception: Exception = new Exception(
                body.errorCode,
                body.errorDescription,
              )
              return exception
            } else {
              const output = body
              const pagedData = new PagedData<any>()
              const page = new Page()
              page.pageNumber = pageNumber
              page.pageSize = rows
              page.size = output.batchList.size
              page.totalElements = output.batchList.total
              page.totalPages = page.totalElements / page.size
              const size = output.size
              pagedData.page = page
              output.batchList.items.forEach((a) => {
                a['posCRMStatusType'] = 'R' + a['typeRequest']
              })
              pagedData.data = output.batchList.items
              return pagedData
            }
          }),
          catchError(this.handleError),
        ),
    ).pipe(
      map((res) => {
        const output = res
        const pagedData = new PagedData<any>()
        const page = new Page()
        page.pageNumber = pageNumber
        page.pageSize = rows
        pagedData.data = []

        if (output[0]['page']) {
          page.size = output[0]['page']['size']
          page.totalElements = output[0]['page']['totalElements']
          pagedData.data.push(...output[0]['data'])
        }

        if (output[1]['page']) {
          page.size = +output[1]['page']['size']
          page.totalElements = +output[1]['page']['totalElements']
          pagedData.data.push(...output[1]['data'])
        }

        if (output[2]['page']) {
          page.size = +output[2]['page']['size']
          page.totalElements = +output[2]['page']['totalElements']
          pagedData.data.push(...output[2]['data'])
        }
        page.totalPages = page.totalElements / page.size
        pagedData.page = page
        return pagedData
      }),
    )
  }

  public detailsMaintenance(element): Observable<any> {
    const data = {
      batch: element,
    }

    return this.http
      .post(this.servicesUrl + '/posManagement/maintenance/details', data)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode != 0) {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return exception
          } else {
            const output = body.batch

            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  public detailsManagement(element): Observable<any> {
    const data = {
      batch: element,
    }

    return this.http
      .post(this.servicesUrl + '/posManagement/management/details', data)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode != 0) {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return exception
          } else {
            const output = body.batch

            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  public detailsRequest(element): Observable<any> {
    const data = {
      batch: element,
    }

    return this.http
      .post(this.servicesUrl + '/posManagement/request/details', data)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode != 0) {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return exception
          } else {
            const output = body.batch

            return output
          }
        }),
        catchError(this.handleError),
      )
  }
}
