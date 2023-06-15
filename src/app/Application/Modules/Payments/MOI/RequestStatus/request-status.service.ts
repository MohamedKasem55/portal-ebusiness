import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { map } from 'rxjs/operators'

import { Exception } from '../../../../../Application/Model/exception'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
@Injectable()
export class RequestStatusService {
  token: string
  servicesUrl: string
  currentUser

  type: any
  element: any
  activating: boolean

  constructor(private http: HttpClient, public config: ConfigResourceService) {
    this.servicesUrl = config.getServicesUrl()
    this.activating = false
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

  public details(batch): Observable<any> {
    const data = {
      batch,
    }
    return this.http
      .post(this.servicesUrl + '/moiPayment/requestStatus/details', data)
      .pipe(
        map((response: any) => {
          const output = response
          let result: any

          if (output.errorCode !== '0') {
            result = {}
            result.error = true
            result.errorCode = output.errorCode
            result.errorDescription = output.errorDescription
          } else {
            result = output
            result.error = false
          }
          return result
        }),
      )
  }

  getType() {
    return this.type
  }

  setType(type) {
    this.type = type
  }

  getElement() {
    return this.element
  }

  setElement(element) {
    this.element = element
  }

  setActivating(activating: boolean) {
    this.activating = activating
  }
  isActivating() {
    return this.activating
  }
}
