import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { Exception } from '../../../../../Application/Model/exception'
import { Page } from '../../../../../Application/Model/page'
import { PagedData } from '../../../../../Application/Model/paged-data'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'

@Injectable()
export class RequestStatusRefunds {
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

  public getResults(page: number, rows: number): Observable<any> {
    const data = {
      page,
      rows,
    }

    const req = JSON.stringify(data)

    return this.http
      .post(this.servicesUrl + '/moiPayment/requestStatus/refund/list', req)
      .pipe(
        map((response: any) => {
          const body = response

          if (response.errorCode !== '0') {
            return null
          } else {
            // output is the father node of the content response
            const output = body.requestStatusEgovSRList.items
            const pagedData = new PagedData<any>()
            const pageObject = new Page()

            pageObject.pageNumber = page - 1
            pageObject.pageSize = rows
            pageObject.size = body.requestStatusEgovSRList.size
            pageObject.totalElements = body.requestStatusEgovSRList.total
            pageObject.totalPages =
              pageObject.totalElements / pageObject.pageSize

            pagedData.data = body.requestStatusEgovSRList.items
            pagedData.page = pageObject

            return pagedData
          }
        }),
        catchError(this.handleError),
      )
  }
}
