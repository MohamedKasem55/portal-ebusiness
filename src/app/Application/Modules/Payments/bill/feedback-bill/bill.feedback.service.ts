/**
 * Service to obtain the balance certificate
 */
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { Exception } from '../../../../Model/exception'
import { Page } from '../../../../Model/page'
import { PagedData } from '../../../../Model/paged-data'
import { ModelFeedbacktBill } from '../../Model/bill.feedback.model'

@Injectable()
export class FeedbackBillService {
  token: string
  servicesUrl: string
  currentUser

  constructor(private http: HttpClient, public config: ConfigResourceService) {
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
  ): Observable<PagedData<ModelFeedbacktBill>> {
    const data = {
      order,
      orderType,
      page,
      rows,
    }

    return this.http.post(this.servicesUrl + '/balanceCertificate', data).pipe(
      map((response: any) => {
        const body = response

        if (response.errorCode !== '0') {
          return null
        } else {
          // output is the father node of the content response
          const output = body.cetificates
          const pagedData = new PagedData<ModelFeedbacktBill>()
          const pageObject = new Page()

          pageObject.pageNumber = page
          pageObject.pageSize = rows
          pageObject.size = body.size
          pageObject.totalElements = body.total
          pageObject.totalPages = pageObject.totalElements / pageObject.pageSize

          for (let i = 0; i < pageObject.size; i++) {
            const jsonObj = output[i]
            const list = new ModelFeedbacktBill(
              jsonObj.accountFrom,
              jsonObj.billerName,
              jsonObj.billRef,
              jsonObj.enteredAmount,
              jsonObj.billProcess,
              jsonObj.status,
            )
            pagedData.data.push(list)
          }

          pagedData.page = pageObject

          return pagedData
        }
      }),
      catchError(this.handleError),
    )
  }
}
