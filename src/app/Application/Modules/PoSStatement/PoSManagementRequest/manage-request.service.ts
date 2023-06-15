import { DatePipe } from '@angular/common'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { Exception } from '../../../../Application/Model/exception'
import { Page } from '../../../../Application/Model/page'
import { PagedData } from '../../../../Application/Model/paged-data'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'

@Injectable()
export class ManageRequestService {
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

  public getRequest(
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

    return this.http
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
            pagedData.data = output.batchList.items
            output.batchList.items.forEach((a) => {
              a['posManagementRequestType'] = a['typeRequest']
            })
            return pagedData
          }
        }),
        catchError(this.handleError),
      )
  }

  public details(element): Observable<any> {
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

  public validate(datos, accounts, branch): Observable<any> {
    const data = {
      branch,
      city: datos.city,
      contactName: datos.contactName,
      mobile: datos.mobileNumber,
      type: datos.requestType,
      terminals: [],
      accountNumber:
        datos.accountNumber != null && typeof datos.accountNumber != 'undefined'
          ? accounts[datos.accountNumber].value.fullAccountNumber
          : null,
      typeCreditCard: datos.typeCreditCard,
    }
    if (datos.terminalNumber) {
      datos.terminalNumber.forEach((a) => {
        data['terminals'].push({ terminal: a['terminalNumber'] })
      })
    }

    return this.http
      .post(this.servicesUrl + '/posManagement/management/validate', data)
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

            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  public confirm(datos, requestValidate): Observable<any> {
    const data = {
      batchList: datos.batchList,
      requestValidate,
    }

    return this.http
      .post(this.servicesUrl + '/posManagement/management/confirm', data)
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

            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  getTerminals(): Observable<any> {
    const data: any = {}
    const url = this.config.getServicesUrl() + '/posManagement/searchTerminals'
    return this.http.get(url, { params: data }).pipe(
      map((response: any) => {
        const body = response
        if (response.errorCode != 0) {
          const errorService: Exception = new Exception(
            body.errorCode,
            body.errorDescription,
          )
          return observableThrowError(errorService)
        } else {
          const output = response
          const result = output

          return result
        }
      }),
      catchError(this.handleError),
    )
  }

  getAccounts(): Observable<any> {
    const url =
      this.config.getServicesUrl() + '/posStatementCU/account/accountMain'
    return this.http.get(url).pipe(
      map((response: any) => {
        const body = response
        if (response.errorCode != 0) {
          const errorService: Exception = new Exception(
            body.errorCode,
            body.errorDescription,
          )
          return observableThrowError(errorService)
        } else {
          const output = response
          const result = output
          result['accountListDTO'] = response.accountListPos
          return result
        }
      }),
      catchError(this.handleError),
    )
  }
}
