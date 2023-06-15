import { Injectable } from '@angular/core'
import { map } from 'rxjs/operators'

import { HttpClient } from '@angular/common/http'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { AuthenticationService } from '../../../../../core/security/authentication.service'
import { BehaviorSubject, of } from 'rxjs'

@Injectable()
export class MoiPaymentsService {
  private servicesUrl: string
  paymentsSelectedSubject: BehaviorSubject<any> = new BehaviorSubject([])
  refundsSelectedSubject: BehaviorSubject<any> = new BehaviorSubject([])

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    public authenticationService: AuthenticationService,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  getListRS(page, rows) {
    const data: any = {}
    data.page = page
    data.rows = rows

    return this.http
      .post(this.servicesUrl + '/moiPayment/pendingActions/refund/list', data)
      .pipe(
        map((response: any, index: number) => {
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

  getListSP(page, rows) {
    const data: any = {}
    data.page = page
    data.rows = rows

    return this.http
      .post(this.servicesUrl + '/moiPayment/pendingActions/payment/list', data)
      .pipe(
        map((response: any, index: number) => {
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

  showBatchList(actionType, listSP, listSR) {
    const data: any = {}
    data.actionType = actionType
    data.listSelectedBatchSP = listSP
    data.listSelectedBatchSR = listSR

    return this.http
      .post(this.servicesUrl + '/moiPayment/pendingActions/validate', data)
      .pipe(
        map((response: any, index: number) => {
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

  confirmAuthorizeBatch(
    BatchListsContainerSP,
    BatchListsContainerSR,
    requestValidate,
  ) {
    const data: any = {}
    data.checkAndSeparateAuthorizationPermissionSP = BatchListsContainerSP
    data.checkAndSeparateAuthorizationPermissionSR = BatchListsContainerSR
    data.requestValidate = requestValidate

    /*if (false) { // to avoid confirm action and test final screen
            return of({
                "error": false,
                "errorCode": "0",
                "errorDescription": "",
                "errorResponse": {
                    "reference": "c891661b-c800-4c43-b59c-a76f2bd2655d",
                    "englishMessage": "",
                    "arabicMessage": "",
                    "code": "",
                    "description": ""
                },
                "generateChallengeAndOTP": null,
                "fileReferenceSP": "Gov_usermoh_1586869134102",
                //"fileReferenceSP": null,
                "fileReferenceSR": null
            });
        }*/
    return this.http
      .post(this.servicesUrl + '/moiPayment/pendingActions/confirm', data)
      .pipe(
        map((response: any, index: number) => {
          const output = response
          let result: any

          if (output.errorCode !== '0') {
            result = {}
            result.error = true
            result.errorCode = output.errorCode
            result.errorDescription = output.errorDescription
            if (output.errorCode === '-3') {
              result.generateChallengeAndOTP = output.generateChallengeAndOTP
            }
          } else {
            result = output
            result.error = false
          }
          return result
        }),
      )
  }

  confirmRejectBatch(listSP, listSR, reason) {
    const data: any = {}
    data.lBatchSP = listSP
    data.lBatchSR = listSR
    data.reason = reason

    const body = JSON.stringify(data)

    return this.http
      .post(this.servicesUrl + '/moiPayment/pendingActions/refuse', body)
      .pipe(
        map((response: any, index: number) => {
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

  setPaymentsSelected(selected) {
    // console.log('set bill', billSelected);
    this.paymentsSelectedSubject.next(selected)
  }

  get paymentsSelected() {
    return this.paymentsSelectedSubject.asObservable()
  }

  setRefundsSelected(selected) {
    this.refundsSelectedSubject.next(selected)
  }

  get refundsSelected() {
    return this.refundsSelectedSubject.asObservable()
  }

  public getCitizenIdFromDetails(details: any[]) {
    return details && details[0] ? details[0].value : null
  }
}
