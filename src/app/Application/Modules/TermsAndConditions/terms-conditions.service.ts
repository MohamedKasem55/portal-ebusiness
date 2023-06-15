import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../core/config/config.resource.local'
import { StorageService } from '../../../core/storage/storage.service'
import { Exception } from '../../Model/exception'

@Injectable()
export class TermsConditionsService {
  servicesUrl: string

  constructor(
    private http: HttpClient,
    public storageService: StorageService,
    public config: ConfigResourceService,
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

  sign(privilege): Observable<any> {
    const data = {
      privilegeId: privilege,
    }

    return this.http
      .post(this.servicesUrl + '/termsConditions/sign', data)
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              response.errorCode,
              response.errorDescription,
            )
            return observableThrowError(exception)
          } else {
            const termsConditions = this.storageService.retrieve(
              'termConditionPending',
            )
            delete termsConditions.items[privilege]
            termsConditions._count = termsConditions._count - 1
            this.storageService.store('termConditionPending', termsConditions)
            const output = response
            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  init(privilege): Observable<Blob> {
    const data = {
      privilegeId: privilege,
    }

    return this.http.post(this.servicesUrl + '/termsConditions/getTxt', data, {
      responseType: 'blob',
    })
  }
}
