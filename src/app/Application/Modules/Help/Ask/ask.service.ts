import { HttpClient, HttpResponse } from '@angular/common/http'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'

import { Injectable } from '@angular/core'
import { throwError as observableThrowError, Observable } from 'rxjs'
import { Exception } from '../../../Model/exception'

import { map, catchError } from 'rxjs/operators'

@Injectable()
export class AskService {
  servicesUrl: string

  constructor(public http: HttpClient, public config: ConfigResourceService) {
    this.servicesUrl = config.getServicesUrl()
  }

  public submitData(formData): Observable<any> {
    const data = {
      comments: formData.comments,
      contactName: formData.customerName,
      email: formData.customerEmail,
      mobileNumber: formData.mobileNumber,
      problemValue: formData.problemValue,
      serviceValue: formData.serviceValue,
    }

    return this.http.post(this.servicesUrl + '/ask', data).pipe(
      map((response: any) => {
        const output = response
        let result: any
        result = {}

        if (output.errorCode !== '0') {
          result.error = true
          result.errorCode = output.errorCode
          result.errorDescription = output.errorDescription
        } else {
          result = output
          result.error = false
        }
        return result
      }),
      catchError(this.handleError),
    )
  }

  public getServiceList(combosRequest): Observable<any> {
    const data = {
      names: combosRequest,
    }
    return this.http.post(this.servicesUrl + '/statics/list', data).pipe(
      map((response: any) => {
        const output = response
        let result: any
        result = {}
        if (output.errorCode) {
          result.error = true
          result.errorCode = output.errorCode
          result.errorDescription = output.errorDescription
        } else {
          result = output[0]
        }
        return result
      }),
      catchError(this.handleError),
    )
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
}
