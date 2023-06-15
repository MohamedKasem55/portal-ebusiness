import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError } from 'rxjs/internal/operators/catchError'
import { map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { DateFormatPipe } from '../../../Components/common/Pipes/date-format-pipe'
import { Exception } from '../../../Model/exception'
import {
  BusinessCardsDetailsRequest,
  BusinessCardsDetailsResponse,
} from '../commercial-cards-models'

@Injectable()
export class ViewQueryCardsService {
  public static trxnCode = 'businessCardsTrxnCode'
  public static trxnType = 'businessCardsTrxnType'

  servicesUrl: string
  dateFormat = 'yyyy-MM-dd'

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    private dateFormatPipe: DateFormatPipe,
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
    return Observable.throw(errorService)
  }

  // obtains Data Table Details

  getCategories(): Observable<any> {
    const url =
      this.config.getServicesUrl() + '/posStatementCU/account/accountMain'
    return this.http.get(url).pipe(
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
          const result = output
          // result['accountListDTO'] = response.accountListPos;
          return result
        }
      }),
      catchError(this.handleError),
    )
  }

  public getCardDetails(
    request: BusinessCardsDetailsRequest,
  ): Observable<BusinessCardsDetailsResponse> {
    return this.http
      .post(this.servicesUrl + '/businessCards/details', request)
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
}
