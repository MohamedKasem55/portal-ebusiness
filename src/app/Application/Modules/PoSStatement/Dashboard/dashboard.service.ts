import { DatePipe } from '@angular/common'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from '../../../Model/exception'
import { Page } from '../../../Model/page'
import { PagedData } from '../../../Model/paged-data'

@Injectable()
export class DashboardService {
  servicesUrl: string

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

  //Mirar la salida, de momento adaptado para que siga como antes.
  public viewFinancialTransactions(
    searchOptions,
    pageNumber,
    rows,
    order,
    orderType,
  ): Observable<any> {
    const data = {
      dateFrom: searchOptions.dateFrom,
      dateTo: searchOptions.dateTo,
      page: pageNumber, //0,
      rows, //0,
    }

    // const pagedData = new PagedData<any>();
    // const page = new Page();
    // page.pageNumber = pageNumber;
    // page.pageSize = rows
    // page.size = 2;
    // page.totalElements = 2;
    // page.totalPages = page.totalElements / page.size;
    // const size = 2;
    // pagedData.page = page;
    // pagedData.data = [{
    //   date:"12-10-1978",
    //   typeOfTransaction:"req",
    //   status:"Y"
    // },{
    //   date:"12-10-1978",
    //   typeOfTransaction:"req",
    //   status:"N"
    // }
    // ];
    // return Observable.of(pagedData);
    return this.http
      .post(this.servicesUrl + '/posManagement/dashboard/transList', data)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode != 0) {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return observableThrowError(exception)
          } else {
            const output = body
            const pagedData = new PagedData<any>()
            const page = new Page()
            page.pageNumber = pageNumber
            page.pageSize = rows
            page.size = output.financialTransList.size
            page.totalElements = output.financialTransList.total
            page.totalPages = page.totalElements / page.size
            pagedData.page = page
            pagedData.data = output.financialTransList.items
            // output.financialTransList.items.forEach(item => {
            //   item['numberTerminal'] = (item.terminalNumber ? item.terminalNumber.length : 0);
            // });
            return pagedData
          }
        }),
        catchError(this.handleError),
      )
  }

  public viewTerminalStatistic(
    searchOptions,
    pageNumber,
    rows,
    order,
    orderType,
  ): Observable<any> {
    const data = {
      dateFrom: searchOptions.dateFrom,
      dateTo: searchOptions.dateTo,
      page: pageNumber, //0,
      rows, //0,
    }
    return this.http
      .post(
        this.servicesUrl + '/posManagement/dashboard/terminalStatistics',
        data,
      )
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode != 0) {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return observableThrowError(exception)
          } else {
            const output = body
            const pagedData = new PagedData<any>()
            const page = new Page()
            page.pageNumber = pageNumber
            page.pageSize = rows
            page.size = output.terminalStatisticList.size
            page.totalElements = output.terminalStatisticList.total
            page.totalPages = page.totalElements / page.size
            pagedData.page = page
            pagedData.data = output.terminalStatisticList.items
            // output.terminalStatisticList.items.forEach(item => {
            //   item['numberTerminal'] = (item.terminalNumber ? item.terminalNumber.length : 0);
            // });
            return pagedData
          }
        }),
        catchError(this.handleError),
      )
  }

  public viewInactiveTerminals(
    searchOptions,
    pageNumber,
    rows,
    order,
    orderType,
  ): Observable<any> {
    const data = {
      dateFrom: searchOptions.dateFrom,
      dateTo: searchOptions.dateTo,
      page: pageNumber, //0,
      rows, //0,
    }
    return this.http
      .post(
        this.servicesUrl + '/posManagement/dashboard/inactiveTerminals',
        data,
      )
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode != 0) {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return observableThrowError(exception)
          } else {
            const output = body
            const pagedData = new PagedData<any>()
            const page = new Page()
            page.pageNumber = pageNumber
            page.pageSize = rows
            page.size = output.inactiveTerminalList.size
            page.totalElements = output.inactiveTerminalList.total
            page.totalPages = page.totalElements / page.size
            pagedData.page = page
            pagedData.data = output.inactiveTerminalList.items
            // output.inactiveTerminalList.items.forEach(item => {
            //   item['numberTerminal'] = (item.terminalNumber ? item.terminalNumber.length : 0);
            // });
            return pagedData
          }
        }),
        catchError(this.handleError),
      )
  }
}
