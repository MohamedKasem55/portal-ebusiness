import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { AuthenticationService } from '../../../../../core/security/authentication.service'

@Injectable()
export class BeneficiariesService {
  servicesUrl: string

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    public authenticationService: AuthenticationService,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  getWithinList(page, rows) {
    const data: any = {}
    data.page = page
    data.rows = rows

    return this.http
      .post(
        this.servicesUrl + '/beneficiaries/pendingActions/within/getList',
        data,
      )
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

  getLocalList(page, rows) {
    const data: any = {}
    data.page = page
    data.rows = rows

    return this.http
      .post(
        this.servicesUrl + '/beneficiaries/pendingActions/local/getList',
        data,
      )
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

  getInternationalList(page, rows) {
    const data: any = {}
    data.page = page
    data.rows = rows

    return this.http
      .post(
        this.servicesUrl +
          '/beneficiaries/pendingActions/international/getList',
        data,
      )
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

  authorizeValidateMultiple(withinList, localList, internationalList) {
    const data: any = {}
    data.batchSetAuthA = withinList
    data.batchSetAuthI = internationalList
    data.batchSetAuthL = localList

    return this.http
      .post(
        this.servicesUrl +
          '/beneficiaries/pendingActions/authorizeValidateMultiple',
        data,
      )
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

  authorizeConfirmMultiple(
    withinList,
    localList,
    internationalList,
    requestValidate,
  ) {
    const data: any = {}
    data.batchListAlrajhi = withinList
    data.batchListInternational = internationalList
    data.batchListLocal = localList
    data.requestValidate = requestValidate

    return this.http
      .post(
        this.servicesUrl +
          '/beneficiaries/pendingActions/authorizeConfirmMultiple',
        data,
      )
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

  refuseConfirmMultiple(withinList, localList, internationalList) {
    const data: any = {}
    data.batchSetAuthA = withinList
    data.batchSetAuthI = internationalList
    data.batchSetAuthL = localList

    return this.http
      .post(
        this.servicesUrl +
          '/beneficiaries/pendingActions/refuseConfirmMultiple',
        data,
      )
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
}
