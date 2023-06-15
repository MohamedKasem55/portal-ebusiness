import { Injectable } from '@angular/core'
import { map } from 'rxjs/operators'

import { HttpClient } from '@angular/common/http'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { AuthenticationService } from '../../../../../core/security/authentication.service'

@Injectable()
export class BeneficiariesService {
  servicesUrl: string
  tableSelectedRows = []

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    public authenticationService: AuthenticationService,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  getList(page, rows) {
    const data: any = {}
    data.page = page
    data.rows = rows
    data.pending = true

    return this.http
      .post(this.servicesUrl + '/beneficiaries/batch/list', data)
      .pipe(
        map((response: any, index: number) => {
          let result: any = {}

          const output = response

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
      )
  }

  authorizeValidate(beneficiariesList) {
    const data: any = {}
    data.beneficiaries = beneficiariesList

    return this.http
      .post(this.servicesUrl + '/beneficiaries/pendingActions/validate', data)
      .pipe(
        map((response: any, index: number) => {
          let result: any = {}

          const output = response

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
      )
  }

  authorizeConfirm(beneficiariesList, requestValidate) {
    const data: any = {}
    data.batchListAlrajhi = beneficiariesList.batchListAlrajhi
    data.batchListLocal = beneficiariesList.batchListLocal
    data.batchListInternational = beneficiariesList.batchListInternational
    data.requestValidate = requestValidate

    return this.http
      .post(this.servicesUrl + '/beneficiaries/pendingActions/confirm', data)
      .pipe(
        map((response: any, index: number) => {
          let result: any = {}

          const output = response

          if (output.errorCode !== '0') {
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

  refuseConfirm(beneficiaries, reason) {
    const data: any = {}
    data.beneficiaries = beneficiaries
    data.reason = reason

    return this.http
      .post(this.servicesUrl + '/beneficiaries/pendingActions/refuse', data)
      .pipe(
        map((response: any, index: number) => {
          let result: any = {}

          const output = response

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
      )
  }

  EmptyIfNull(value) {
    if (typeof value === 'undefined' || value === null) {
      return ''
    }
    return value
  }
}
