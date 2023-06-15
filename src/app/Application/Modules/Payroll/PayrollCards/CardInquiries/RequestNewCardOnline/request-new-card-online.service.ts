import { Injectable } from '@angular/core'
import { map } from 'rxjs/operators'

import { HttpClient } from '@angular/common/http'
import { ConfigResourceService } from '../../../../../../core/config/config.resource.local'
import { AuthenticationService } from '../../../../../../core/security/authentication.service'

@Injectable()
export class RequestNewCardOnlineService {
  servicesUrl: string

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    public authenticationService: AuthenticationService,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  initiate(batchName, listNewPayrollcardsDetailSelected) {
    const data: any = {}
    data.batchName = batchName
    data.listNewPayrollcardsDetailSelected = listNewPayrollcardsDetailSelected

    const body = JSON.stringify(data)

    return this.http
      .post(this.servicesUrl + '/payrollCards/newCards/initiate', body)
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

  initiateConfirm(payrollCardBatchDTO, requestValidate) {
    const data: any = {}
    data.payrollCardBatch = payrollCardBatchDTO
    data.requestValidate = requestValidate

    const body = JSON.stringify(data)

    return this.http
      .post(this.servicesUrl + '/payrollCards/newCards/initiateConfirm', body)
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
