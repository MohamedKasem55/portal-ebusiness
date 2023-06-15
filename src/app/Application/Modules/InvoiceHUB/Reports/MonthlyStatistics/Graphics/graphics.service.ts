import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Subscription, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../../core/config/config.resource.local'
import { AuthenticationService } from '../../../../../../core/security/authentication.service'
import { Exception } from '../../../../../Model/exception'

@Injectable()
export class GraphicsService {
  subscription: Subscription

  servicesUrl: string

  constructor(
    private _http: HttpClient,
    public config: ConfigResourceService,
    public authenticationService: AuthenticationService,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  getMonthsDate() {
    return this._http
      .get(this.servicesUrl + '/sadadInvoice/monthlyStatistic/list')
      .pipe(
        map((res: any) => {
          const result: any = {}
          if (res.errorCode !== '0') {
            result.error = true
            result.errorCode = res.errorCode
            result.errorDescription = res.errorDescription
            return result
          }
          {
            const output = res.sadadInvoiceYearMonthDTOlist
            return output
          }
        }),
        // .do(data => ////console.log('Allmeses: ' + JSON.stringify(data)))
        catchError(this.handleError),
      )
  }

  //obtener la informacion para la grafica
  getInformBill(dato) {
    const date = dato.split('-')

    return this._http
      .get(
        `${this.servicesUrl}/sadadInvoice/monthlyStatistic/details/${date[1]}/${date[0]}`,
      )
      .pipe(
        map((res: any) => {
          const result: any = {}
          if (res.errorCode !== '0') {
            result.error = true
            result.errorCode = res.errorCode
            result.errorDescription = res.errorDescription
            return result
          }
          {
            const output =
              res.invoiceStatistics.sadadInvoiceStatisticsDetailsList
            return output
          }
        }),
        // .do(data => ////console.log('All: ' + JSON.stringify(data)))
        catchError(this.handleError),
      )
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
}
