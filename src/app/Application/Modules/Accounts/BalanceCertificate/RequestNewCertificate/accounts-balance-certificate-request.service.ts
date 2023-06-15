import { Observable, throwError as observableThrowError } from 'rxjs'
/**
 * Service to obtain the balance certificate
 */

import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { StorageService } from '../../../../../core/storage/storage.service'
import { Exception } from '../../../../Model/exception'

@Injectable()
export class AccountsRequestService {
  token: string
  servicesUrl: string
  currentUser

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    public storageService: StorageService,
  ) {
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

  public confirm(values: any, requestValidate: any): Observable<any> {
    const data = {
      batch: values,
      requestValidate,
    }

    return this.http
      .post(this.servicesUrl + '/balanceCertificate/confirm', data)
      .pipe(
        map((response: any) => response),
        catchError(this.handleError),
      )
  }

  public init(): Observable<any> {
    return this.http.get(this.servicesUrl + '/balanceCertificate/init')
  }

  public validate(values): Observable<any> {
    const data = {
      accountNumber: values.account,
      city: values.city,
      company: values.company,
      postalCode: values.postalCode,
    }

    return this.http
      .post(this.servicesUrl + '/balanceCertificate/validate', data)
      .pipe(map((response: any) => response))
  }
}
