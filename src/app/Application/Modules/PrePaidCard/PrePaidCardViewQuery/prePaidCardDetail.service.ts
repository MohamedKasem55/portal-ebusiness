import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Exception } from 'app/Application/Model/exception'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { ConfigResourceService } from 'app/core/config/config.resource.local'
import { map, catchError } from 'rxjs/operators'
import { throwError as observableThrowError } from 'rxjs'
import {
  PrepaidCardDetailResponse,
  PrepaidCardDetailRequest,
  PrepaidCardStatementsResponse,
} from './prePaidCardDetailModel'

export enum Prepaid_Status_card {
  default,
  closed = '1',
  active = '2',
  inActive = '3',
  closedByBank = '4',
  closedByCustomer = '5',
}
@Injectable({
  providedIn: 'root',
})
export class PrePaidCardDetailService {
  private servicesUrl = this.config.getServicesUrl()

  constructor(private http: HttpClient, public config: ConfigResourceService) {}
  public getCardDetails(request: any): Observable<PrepaidCardDetailResponse> {
    return this.http
      .post(this.servicesUrl + '/prepaidCards/details', request)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return exception
          } else {
            return body
          }
        }),
        catchError(this.handleError),
      )
  }

  public getCardDetailStatements(
    request: PrepaidCardDetailRequest,
  ): Observable<PrepaidCardStatementsResponse> {
    return this.http
      .post(this.servicesUrl + '/prepaidCards/statements', request)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
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

  public handleError(error: HttpResponse<any> | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string
    if (error instanceof HttpResponse) {
      const err = error['error'] || JSON.stringify(error)
      errMsg = `${error.status} - ${error.statusText || ''}${err}`
    } else {
      errMsg = error.message ? error.message : error.toString()
    }

    const errorService: Exception = new Exception('handle', errMsg)
    return observableThrowError(errorService)
  }
}
