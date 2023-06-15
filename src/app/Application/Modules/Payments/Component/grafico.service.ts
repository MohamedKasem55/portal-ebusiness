import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import {
  Observable,
  Subscription,
  throwError as observableThrowError,
} from 'rxjs'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { AuthenticationService } from '../../../../core/security/authentication.service'
import { Exception } from 'app/Application/Model/exception'

@Injectable()
export class GraficoService {
  subscription: Subscription

  servicesUrl: string

  constructor(
    private _http: HttpClient,
    public config: ConfigResourceService,
    public authenticationService: AuthenticationService,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  getMonthsDate(): Observable<any> {
    return this._http.get(
      this.servicesUrl + '/billPaymentService/monthlyStatisticBill/',
    )
  }

  //obtener la unformacion para la grafica
  getInformBill(dato): Observable<any> {
    const bodyString = JSON.stringify({ strbody: dato })
    return this._http.post(
      this.servicesUrl + '/billPaymentService/monthlyStatisticBill/' + dato,
      bodyString,
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
