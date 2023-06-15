import { Observable, throwError as observableThrowError } from 'rxjs'
/**
 * Service to obtain the balance certificate
 */

import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from '../../../Model/exception'
@Injectable()
export class BeneficiariesGlobalService {
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

  // DELETE BENEFICIARY
  public deleteBeneficiary(
    idBeneficiary: string,
    ernumber: string,
  ): Observable<string> {
    const data = {
      beneficiaryId: idBeneficiary,
      ernumber,
    }

    // Input params

    let _param: HttpParams = new HttpParams()
    _param = _param.append('deletebody', JSON.stringify(data))
    return this.http
      .delete(this.servicesUrl + '/beneficiaries/delete', { params: _param })
      .pipe(
        map((response: any) => {
          const body = response
          return body || {}
        }),
        catchError(this.handleError),
      )
  }

  // MODIFY BENEFICIARY
  public modifyBeneficiary(params): Observable<any> {
    // Input params

    //console.log("************************");
    //console.log(body);

    return this.http
      .put(this.servicesUrl + '/beneficiaries/modify', params)
      .pipe(
        map((response: any) => {
          const body = response
          return body || {}
        }),
        catchError(this.handleError),
      )
  }

  // ADD AL RAJHI BENEFICIARY
  public addAlRajhiBeneficiary(
    params: any,
    account: string,
  ): Observable<string> {
    // Input params

    return this.http
      .post(
        this.servicesUrl + '/beneficiaries/within/' + account + '/add',
        params,
      )
      .pipe(
        map((response: any) => {
          const body = response
          return body || {}
        }),
        catchError(this.handleError),
      )
  }

  // ADD LOCAL BENEFICIARY
  public addLocalBeneficiary(
    ibanAccount: string,
    bankCode: string,
    beneficiaryName: string,
    phoneNumber: string,
    email: string,
    phone: string,
    bankIbanCode,
    sharedData: any,
  ): Observable<string> {
    const data = {
      bankCode: bankIbanCode,
      beneficiaryAccountNumber: ibanAccount,
      beneficiaryName,
      email,
      phoneNumber: phone,
      requestValidate: {
        challengeNumber:
          sharedData.generateChallengeAndOTP &&
          'CHALLENGE' == sharedData.generateChallengeAndOTP.typeAuthentication
            ? sharedData.requestValidate.challengeNumber
            : '',
        challengeResponse:
          sharedData.generateChallengeAndOTP &&
          'CHALLENGE' == sharedData.generateChallengeAndOTP.typeAuthentication
            ? sharedData.requestValidate.challengeResponse
            : '',
        otp:
          sharedData.generateChallengeAndOTP &&
          'OTP' == sharedData.generateChallengeAndOTP.typeAuthentication
            ? sharedData.requestValidate.otp
            : '',
        ivr:
          sharedData.generateChallengeAndOTP &&
          'IVR' == sharedData.generateChallengeAndOTP.typeAuthentication
            ? sharedData.requestValidate.ivr
            : '',
        password:
          sharedData.generateChallengeAndOTP &&
          'STATIC' == sharedData.generateChallengeAndOTP.typeAuthentication
            ? sharedData.requestValidate.password
            : '',
      },
    }

    return this.http
      .post(this.servicesUrl + '/beneficiaries/local/add', data)
      .pipe(
        map((response: any) => {
          const body = response
          return body || {}
        }),
        catchError(this.handleError),
      )
  }

  // ADD INTERNATIONAL BENEFICIARY
  public addInternationalBeneficiary(params: any): Observable<any> {
    return this.http
      .post(this.servicesUrl + '/beneficiaries/international/add/v2', params)
      .pipe(
        map((response: any) => {
          const body = response
          return body || {}
        }),
        catchError(this.handleError),
      )
  }

  public validateInternationalBeneficiary(): Observable<any> {
    return this.http
      .get(this.servicesUrl + '/beneficiaries/international/validate')
      .pipe(
        map((response: any) => {
          const body = response
          return body || {}
        }),
        catchError(this.handleError),
      )
  }

  public validateAddInternationalBeneficiary(params: any): Observable<any> {
    return this.http
      .post(
        this.servicesUrl + '/beneficiaries/international/validateAdd/v2',
        params,
      )
      .pipe(
        map((response: any) => {
          const body = response
          return body || {}
        }),
        catchError(this.handleError),
      )
  }
  public validateOrAddLocalBeneficiary(
    ibanAccount: string,
    bankCode: string,
    beneficiaryName: string,
    phoneNumber: string,
    email: string,
    phone: string,
    bankIbanCode,
    sharedData: any,
  ): Observable<any> {
    const data = {
      bankCode: bankIbanCode,
      beneficiaryAccountNumber: ibanAccount,
      beneficiaryName,
      email,
      phoneNumber: phone,
      requestValidate: {
        challengeNumber:
          sharedData.generateChallengeAndOTP &&
          'CHALLENGE' == sharedData.generateChallengeAndOTP.typeAuthentication
            ? sharedData.requestValidate.challengeNumber
            : '',
        challengeResponse:
          sharedData.generateChallengeAndOTP &&
          'CHALLENGE' == sharedData.generateChallengeAndOTP.typeAuthentication
            ? sharedData.requestValidate.challengeResponse
            : '',
        otp:
          sharedData.generateChallengeAndOTP &&
          'OTP' == sharedData.generateChallengeAndOTP.typeAuthentication
            ? sharedData.requestValidate.otp
            : '',
        ivr:
          sharedData.generateChallengeAndOTP &&
          'IVR' == sharedData.generateChallengeAndOTP.typeAuthentication
            ? sharedData.requestValidate.ivr
            : '',
        password:
          sharedData.generateChallengeAndOTP &&
          'STATIC' == sharedData.generateChallengeAndOTP.typeAuthentication
            ? sharedData.requestValidate.password
            : '',
      },
    }
    return this.http
      .post(this.servicesUrl + '/beneficiaries/local/validateAdd', data)
      .pipe(
        map((response: any) => {
          const body = response
          return body || {}
        }),
        catchError(this.handleError),
      )
  }
  public validateLocalBeneficiary(): Observable<any> {
    return this.http
      .get(this.servicesUrl + '/beneficiaries/local/validate')
      .pipe(
        map((response: any) => {
          const body = response
          return body || {}
        }),
        catchError(this.handleError),
      )
  }
}
