import { Injectable } from '@angular/core'
import { map } from 'rxjs/operators'

import { HttpClient } from '@angular/common/http'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { AuthenticationService } from '../../../../../core/security/authentication.service'

@Injectable()
export class POSStatementService {
  private servicesUrl: string

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    public authenticationService: AuthenticationService,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  newRequestGetList(page, rows) {
    return this.requestList(page, rows, 'REQUEST')
  }

  posManagementGetList(page, rows) {
    return this.requestList(page, rows, 'MANAGEMENT')
  }

  posMaintenanceGetList(page, rows) {
    return this.requestList(page, rows, 'MAINTENANCE')
  }

  claimGetList(page, rows) {
    return this.requestList(page, rows, 'CLAIM')
  }

  requestList(page, rows, type) {
    const data: any = {}
    data.page = page
    data.rows = rows
    data.typeSearch = type
    const body = JSON.stringify(data)

    return this.http
      .post(this.servicesUrl + '/posManagement/pendingActions/list', body)
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

  validate(batch) {
    const data: any = {
      posMaintenanceBatchList: batch.posMaintenanceSelected,
      posManagementBatchList: batch.posManagementSelected,
      posRequestBatchList: batch.newRequestSelected,
      posClaimBatchList: batch.claimSelected,
    }

    const body = JSON.stringify(data)

    return this.http
      .post(this.servicesUrl + '/posManagement/pendingActions/validate', body)
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

  aproveConfirm(batch, requestValidate) {
    const data: any = {}
    data.batchPosMaintenanceList = batch.batchPosMaintenanceList
    data.batchPosManagementList = batch.batchPosManagementList
    data.batchPosRequestList = batch.batchPosRequestList
    data.batchPosClaimList = batch.batchPosClaimList
    data.requestValidate = requestValidate

    const body = JSON.stringify(data)

    return this.http
      .post(this.servicesUrl + '/posManagement/pendingActions/confirm', body)
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

  rejectConfirm(batch, rejectReason) {
    const data: any = {}
    data.posMaintenanceBatchList = batch.posMaintenanceSelected
    data.posManagementBatchList = batch.posManagementSelected
    data.posRequestBatchList = batch.newRequestSelected
    data.posClaimBatchList = batch.claimSelected
    data.rejectedReason = rejectReason

    const body = JSON.stringify(data)

    return this.http
      .put(this.servicesUrl + '/posManagement/pendingActions/refuse', body)
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
}
