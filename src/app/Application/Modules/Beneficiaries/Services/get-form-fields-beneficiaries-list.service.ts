import { Observable, throwError as observableThrowError } from 'rxjs'
/**
 * Service to obtain the balance certificate
 */

import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from '../../../Model/exception'
import { ModelBeneficiaryTypes } from '../Model/get-form-fields-beneficiary-types-services.model'
@Injectable()
export class GetFormFieldsBeneficiariesList {
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

  public beneficiaryTypes(name: string, lang: string): Observable<any> {
    const params: URLSearchParams = new URLSearchParams()
    params.set('name', 'beneficiaryType')

    return this.http.post(this.servicesUrl + '/statics/model', { params }).pipe(
      map((response: any) => {
        const body = response

        if (response.errorCode !== '0') {
          return null
        } else {
          // output is the father node of the content response
          const output = body.props
          let list: Object

          for (let i = 0; i < output.size; i++) {
            const jsonObj = output[i]
            list = new ModelBeneficiaryTypes(jsonObj.beneficiaryTypes)
          }

          return list
        }
      }),
      catchError(this.handleError),
    )
  }
}
