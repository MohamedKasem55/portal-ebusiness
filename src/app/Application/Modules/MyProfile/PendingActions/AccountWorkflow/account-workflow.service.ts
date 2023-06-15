import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { AuthenticationService } from '../../../../../core/security/authentication.service'

@Injectable()
export class AccountWorkflowService {
  private servicesUrl: string
  baseRoute = '/balanceCertificate/pendingActions/'
  // baseRoute = "/workflow/pendingActions/accounts/";

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    public authenticationService: AuthenticationService,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  public getPending(page, rows): Observable<any> {
    const data: any = {}
    data.page = page
    data.rows = rows

    return this.http
      .post(this.servicesUrl + '/workflow/pendingActions/accounts/list', data)
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

  public getPendingnonFinancial(page, rows): Observable<any> {
    const data: any = {}
    data.page = page
    data.rows = rows

    return this.http
      .post(
        this.servicesUrl + '/workflow/pendingActions/nonFinancial/list',
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

  public authorizeValidate(batchList): Observable<any> {
    const data: any = {}
    data.workflowAccountBatchList = batchList

    return this.http
      .post(
        this.servicesUrl + '/workflow/pendingActions/accounts/validate',
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

  public authorizeNonfinanceValidate(batchList): Observable<any> {
    const data: any = {}
    data.workflowNonFinancialBatchList = batchList

    return this.http
      .post(
        this.servicesUrl + '/workflow/pendingActions/nonFinancial/validate',
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

  public authorizeConfirm(batchList, requestValidate): Observable<any> {
    const data: any = {}
    data.workflowAccountBatchList = batchList
    data.requestValidate = requestValidate

    return this.http
      .post(
        this.servicesUrl + '/workflow/pendingActions/accounts/confirm',
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
            result.generateChallengeAndOTP = output.generateChallengeAndOTP
          } else {
            result = output
            result.error = false
          }
          return result
        }),
      )
  }

  public authorizeNonfinanceConfirm(
    batchList,
    requestValidate,
  ): Observable<any> {
    const data: any = {}
    data.workflowNonFinancialBatchList = batchList
    data.requestValidate = requestValidate

    return this.http
      .post(
        this.servicesUrl + '/workflow/pendingActions/nonFinancial/confirm',
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
            result.generateChallengeAndOTP = output.generateChallengeAndOTP
          } else {
            result = output
            result.error = false
          }
          return result
        }),
      )
  }

  public refuseConfirm(batchList, rejectReason): Observable<any> {
    const data: any = {}
    data.workflowAccountBatchList = batchList
    data.rejectReason = rejectReason

    return this.http
      .post(this.servicesUrl + '/workflow/pendingActions/accounts/refuse', data)
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

  public refuseNonfinanceConfirm(batchList, rejectReason): Observable<any> {
    const data: any = {}
    data.workflowNonFinancialBatchList = batchList
    data.rejectReason = rejectReason

    return this.http
      .post(
        this.servicesUrl + '/workflow/pendingActions/nonFinancial/refuse',
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
