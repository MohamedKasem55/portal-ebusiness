import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { AuthenticationService } from '../../../../../core/security/authentication.service'

@Injectable()
export class InvoiceHUBService {
  private servicesUrl: string
  tableSelected: BehaviorSubject<any> = new BehaviorSubject([])

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
      .post(this.servicesUrl + '/sadadInvoice/pendingActions/list', data)
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
    data.batch = null
    data.pending = true

    return this.http
      .post(this.servicesUrl + '/sadadInvoice/validate', data)
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
    data.pending = true
    data.sendMails = false

    return this.http
      .post(this.servicesUrl + '/sadadInvoice/confirm', data)
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

  public refuseConfirm(batchList, rejectReason): Observable<any> {
    const data: any = {}
    data.batchLists = batchList
    data.rejectionReason = rejectReason

    return this.http.post(this.servicesUrl + '/sadadInvoice/refuse', data).pipe(
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

  setSelected(selected) {
    // console.log('set bill', billSelected);
    this.tableSelected.next(selected)
  }

  get getSelected() {
    return this.tableSelected.asObservable()
  }
}
