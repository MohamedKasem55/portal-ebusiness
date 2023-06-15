import { FormGroup } from '@angular/forms';
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Exception } from 'app/Application/Model/exception'
import { ConfigResourceService } from 'app/core/config/config.resource.local'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { RequestValidate } from 'app/Application/Model/requestvalidateType';
import { BatchDSO } from './new-soft-token.models';


@Injectable()
export class NewSoftTokenService {

  /**
   * URL prefix to the services
   */
  servicesUrl: string

  constructor(private http: HttpClient, public config: ConfigResourceService) {
    this.servicesUrl = config.getServicesUrl()
  }

  /**
   * Throws an error with the input error info
   *
   * @param error input error info
   * @returns Observable<never> with the error
   */
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
   * Request Soft Token service
   *
   * @returns Observable<any> with the response of the service
   */
  public initSoftToken(): Observable<any> {
    return this.http.get(this.servicesUrl + '/managementToken/assign/request') // Cuando este BE desarrollado
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return exception
          } else {
            const output = body
            output['accountListDTO'] = body.accounts
            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  /**
   * Soft Token validation service
   *
   * @param accountNumber selected to the soft token request
   * @param numSoftToken number of tokens
   * @returns Observable<any> with the response of the service
   */
  public validSoftToken(formModel: FormGroup, accountSelected: any): Observable<any> {

    const data = {
      tokenNumber: formModel['numToken'],
      account: accountSelected
    }
    return this.http
      .post(this.servicesUrl + '/managementToken/assign/validate', data)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return exception
          } else {
            const output = body
            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  /**
   * Confimation service for Soft Token
   * @param tokenData object with token request info
   * @returns Observable<any> with the response of the service
   */
  public confirmSoftToken(tokenBatchDto: BatchDSO, requestValidate: RequestValidate): Observable<any> {
    const tokenData = {
      batch: tokenBatchDto,
      requestValidate: requestValidate
    }
    return this.http
      .post(this.servicesUrl + '/managementToken/assign/confirm', tokenData)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
              body.generateChallengeAndOTP,
            )
            return exception
          } else {
            const output = body

            return output
          }
        }),
        catchError(this.handleError),
      )
  }

}
