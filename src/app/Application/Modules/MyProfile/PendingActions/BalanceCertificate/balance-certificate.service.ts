import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { AuthenticationService } from '../../../../../core/security/authentication.service'

@Injectable()
export class BalanceCertificateService {
  private servicesUrl: string
  baseRoute = '/balanceCertificate/pendingActions/'
  tableSelectedRows = []

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
      .post(this.servicesUrl + this.baseRoute + 'list', data)
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
    data.batchList = batchList

    return this.http
      .post(this.servicesUrl + this.baseRoute + 'validate', data)
      .pipe(
        map((response: any, index: number) => {
          let result: any = {}

          const output = response

          //console.log("STEP 2");
          //

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
    data.batchList = batchList
    data.requestValidate = requestValidate

    return this.http
      .put(this.servicesUrl + this.baseRoute + 'confirm', data)
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

  public refuseConfirm(batchList, rejectReason): Observable<any> {
    const data: any = {}
    data.batchList = batchList
    data.rejectionReason = rejectReason

    return this.http
      .put(this.servicesUrl + this.baseRoute + 'refuse', data)
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
