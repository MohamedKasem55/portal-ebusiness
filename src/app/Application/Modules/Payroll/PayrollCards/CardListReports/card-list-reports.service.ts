import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'

import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { Exception } from '../../../../Model/exception'

@Injectable()
export class CardListReportsService {
  servicesUrl: string

  constructor(private http: HttpClient, private config: ConfigResourceService) {
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

  downloadCardList(): Observable<any> {
    const body = null

    return this.http.post(
      this.servicesUrl + '/payrollCards/downloadListsOfCards',
      body,
      { responseType: 'blob' },
    )
  }

  downloadKYCLists(): Observable<any> {
    const body = null
    return this.http.post(
      this.servicesUrl + '/payrollCards/downloadKYCLists',
      body,
      { responseType: 'blob' },
    )
  }

  downloadCardExpiryList(): Observable<any> {
    const body = null
    return this.http.post(
      this.servicesUrl + '/payrollCards/downloadCardExpiryList',
      body,
      { responseType: 'blob' },
    )
  }

  downloadIDExpiryList(): Observable<any> {
    const body = null
    return this.http.post(
      this.servicesUrl + '/payrollCards/downloadIDExpiryList',
      body,
      { responseType: 'blob' },
    )
  }
}
