/**
 * Service to obtain the balance certificate
 */
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { Exception } from '../../../../Model/exception'
import { Page } from '../../../../Model/page'
import { PagedData } from '../../../../Model/paged-data'

@Injectable()
export class RequestBillService {
  token: string
  servicesUrl: string
  currentUser

  element: any

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    public translate: TranslateService,
  ) {
    this.servicesUrl = config.getServicesUrl()
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
    console.error(errMsg)
    const errorService: Exception = new Exception('handle', errMsg)
    return observableThrowError(errorService)
  }

  public getResults(
    order: string,
    orderType: string,
    page: number,
    rows: number,
  ): any {
    const data = {
      order,
      orderType,
      page,
      rows,
    }

    return this.http
      .post(
        this.servicesUrl + '/billPaymentService/requestStatus/billPayment/list',
        data,
      )
      .pipe(
        map((response: any) => {
          const output = response
          let result: any
          result = {}

          if (output.errorCode !== '0') {
            result.error = true
            result.errorCode = output.errorCode
            result.errorDescription = output.errorDescription
          } else {
            result.pagedData = new PagedData<any>()
            const body = output.billsPagedResults
            const pageObject = new Page()

            pageObject.pageNumber = page
            pageObject.pageSize = rows
            pageObject.size = body.size
            pageObject.totalElements = body.total
            pageObject.totalPages =
              pageObject.totalElements / pageObject.pageSize

            result.pagedData.page = pageObject
            result.pagedData.data = output.billsPagedResults.items
            result.error = false
          }
          return result
        }),
        catchError(this.handleError),
      )
  }

  public getResultsBill(
    order: string,
    orderType: string,
    page: number,
    rows: number,
  ): any {
    const data = {
      order,
      orderType,
      page,
      rows,
    }

    return this.http
      .post(
        this.servicesUrl + '/billPaymentService/requestStatus/billAdd/list',
        data,
      )
      .pipe(
        map((response: any) => {
          const output = response
          let result: any
          result = {}

          if (output.errorCode !== '0') {
            result.error = true
            result.errorCode = output.errorCode
            result.errorDescription = output.errorDescription
          } else {
            result.pagedData = new PagedData<any>()
            const body = output.billsPagedResults
            const pageObject = new Page()

            pageObject.pageNumber = page
            pageObject.pageSize = rows
            pageObject.size = body.size
            pageObject.totalElements = body.total
            pageObject.totalPages =
              pageObject.totalElements / pageObject.pageSize

            result.pagedData.page = pageObject
            result.pagedData.data = output.billsPagedResults.items
            result.error = false
          }
          return result
        }),
        catchError(this.handleError),
      )
  }

  setBillerName(data) {
    for (let i = data.data.length - 1; i >= 0; i--) {
      if (this.translate.currentLang === 'en') {
        data.data[i].billerName = data.data[i].billerNameEn
      } else {
        data.data[i].billerName = data.data[i].billerNameAr
      }
    }
  }

  getLevel(status: string, levels): string {
    let response = ''
    if (status != 'R') {
      for (let i = 0; i < levels.length; i++) {
        if (levels[i]['status'] == 'A' || levels[i]['status'] == 'I') {
          response += 'L' + levels[i]['level'] + ' '
        }
      }
    }
    return response
  }

  getNextLevel(status: string, levels): string {
    let response = ''
    for (let i = 0; i < levels.length; i++) {
      if (status == 'R' || levels[i]['status'] == 'P') {
        response += 'L' + levels[i]['level'] + ' '
      }
    }
    return response
  }

  getElement() {
    return this.element
  }

  setElement(element) {
    this.element = element
  }
}
