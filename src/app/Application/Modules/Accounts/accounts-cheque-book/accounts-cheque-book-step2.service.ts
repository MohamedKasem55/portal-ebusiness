import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
/**
 * Service to obtain the balance certificate
 */
import { Exception } from '../../../Model/exception'

import { ConfigResourceService } from '../../../../core/config/config.resource.local'

@Injectable()
export class ChequeBookAdd {
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

  /**
   * A method that mocks a paged server response
   * @param page The selected page
   * @returns {any} An observable containing the employee data
   */

  public postResults(params: any, requestValidate): Observable<string> {
    // Input params
    const data = {
      batch: params.batch,
      requestValidate:
        Object.keys(requestValidate).length > 0 ? requestValidate : null,
    }

    return this.http
      .post(this.servicesUrl + '/chequeBook/create/confirm', data)
      .pipe(
        map((response: any) => response),
        catchError(this.handleError),
      )
  }
}
