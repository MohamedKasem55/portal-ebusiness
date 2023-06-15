import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { throwError as observableThrowError } from 'rxjs'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { AuthenticationService } from '../../../../../core/security/authentication.service'
import { Exception } from '../../../../Model/exception'

@Injectable()
export class MonthlyStatisticsService {
  servicesUrl: string

  constructor(
    private _http: HttpClient,
    public config: ConfigResourceService,
    public authenticationService: AuthenticationService,
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

  getMonthsDate() {
    return this._http.get(this.servicesUrl + '/billPaymentService/management/getBillCodes')
  }

  getXls(data) {
    const bodyString = JSON.stringify({ strbody: data })
    return this._http.post(
      `${this.servicesUrl}/billPaymentService/monthlyStatisticBill/excel/${data}`,
      bodyString,
      { responseType: 'blob' },
    )
  }
}
