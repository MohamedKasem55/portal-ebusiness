import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from 'app/Application/Model/exception'

@Injectable()
export class VatInvoiceService {
  servicesUrl: string
  currentUser

  constructor(private http: HttpClient, public config: ConfigResourceService) {
    this.servicesUrl = config.getServicesUrl()
  }
  public getPdf(_month: number, _year: number): Observable<any> {
    let headers = new HttpHeaders()
    headers = headers.set('Accept', 'application/pdf')
    return this.http.get(
      this.servicesUrl + '/vatMonthly/report/' + _year + '/' + _month,
      { responseType: 'blob' },
    )
  }

  public blobResponse(error: HttpResponse<any> | any) {
    return error
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

    const errorService: Exception = new Exception('handle', errMsg)
    return observableThrowError(errorService)
  }
}
