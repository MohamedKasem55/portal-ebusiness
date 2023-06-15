import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { Exception } from '../../../../Model/exception'
import { PagedData } from '../../../../Model/paged-data'
import { Page } from '../../../../Model/page'

@Injectable({
  providedIn: 'root',
})
export class ReqStstusService {
  servicesUrl: string
  payment: any
  accounts: any
  router: any

  constructor(private http: HttpClient, private config: ConfigResourceService) {
    this.servicesUrl = config.getServicesUrl()
  }

  getData(page, rows): Observable<any> {
    const data: any = {}
    data.page = page
    data.rows = rows

    const body = JSON.stringify(data)

    return this.http
      .post(this.servicesUrl + '/bulkPayments/requestStatus', body)
      .pipe(
        map((response: any) => {
          const _body = response

          if (response.errorCode != 0) {
            return null
          } else {
            const output = this.postProcessOutputFromRequestedData(
              this.getOutputFromRequestedData(_body),
            )
            const pagedData = new PagedData<any>()
            const pageObject = new Page()

            pageObject.pageNumber = page
            pageObject.pageSize = rows
            pageObject.size = output.size
            pageObject.totalElements = output.total
            pageObject.totalPages =
              pageObject.totalElements / pageObject.pageSize

            pagedData.data = output['data'] ? output['data'] : output['items']
            pagedData.page = pageObject

            return pagedData
          }
        }),
        catchError(this.handleError),
      )
  }

  protected getOutputFromRequestedData(_body) {
    return {
      data: {
        items: _body.bulkPaymentsList,
        size: _body.size,
        total: _body.total,
      },
      size: _body.size,
      total: _body.total,
    }
  }

  protected postProcessOutputFromRequestedData(output): any {
    return output
  }

  public initPayment(bulkPaymentsData): Observable<any> {
    const data = {
      bulkPaymentsBatchDTO: bulkPaymentsData,
    }
    return this.http.post(
      this.servicesUrl + '/bulkPayments/requestStatusDetails',
      data,
    )
  }

  setPayment(payment) {
    this.payment = payment
  }

  getPayment() {
    const pay = this.payment
    return pay
  }

  setAccounts(accounts) {
    this.accounts = accounts
  }

  getAccounts() {
    const accounts = this.accounts
    return accounts
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
    //console.error(errMsg);
    const errorService: Exception = new Exception('handle', errMsg)
    return observableThrowError(errorService)
  }
}
