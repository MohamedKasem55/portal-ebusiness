import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { AuthenticationService } from '../../../../../core/security/authentication.service'

@Injectable()
export class ChequebookService {
  private servicesUrl: string
  tableSelectedRows = []
  tableStopSelectedRows = []
  tablePositivePaySelectedRows = []

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    public authenticationService: AuthenticationService,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  public getPendingCreateCheque(page, rows): Observable<any> {
    const data: any = {}
    data.page = page
    data.rows = rows

    return this.http
      .post(this.servicesUrl + '/chequeBook/pendingActions/create/list', data)
      .pipe(
        map((response: any, index: number) => {
          let result: any = {}

          const output = response

          if (output.errorCode !== '0') {
            result.error = true
            result.errorCode = output.errorCode
            result.errorDescription = output.errorDescription
          } else {
            result = output.batchList
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
      .post(
        this.servicesUrl + '/chequeBook/pendingActions/create/validate',
        data,
      )
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
      .put(this.servicesUrl + '/chequeBook/pendingActions/create/confirm', data)
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
    data.batchList = batchList
    data.rejectionReason = rejectReason

    return this.http
      .put(this.servicesUrl + '/chequeBook/pendingActions/create/refuse', data)
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

  public getPendingStopCheque(page, rows): Observable<any> {
    const data: any = {}
    data.page = page
    data.rows = rows

    return this.http
      .post(this.servicesUrl + '/chequeBook/pendingActions/stop/list', data)
      .pipe(
        map((response: any, index: number) => {
          let result: any = {}

          const output = response

          if (output.errorCode !== '0') {
            result.error = true
            result.errorCode = output.errorCode
            result.errorDescription = output.errorDescription
          } else {
            result = output.batchList
            result.error = false
          }
          return result
        }),
      )
  }

  public authorizeValidateStopCheque(batchList): Observable<any> {
    const data: any = {}
    data.batchList = batchList

    return this.http
      .post(this.servicesUrl + '/chequeBook/pendingActions/stop/validate', data)
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

  public authorizeConfirmStopCheque(
    batchList,
    requestValidate,
  ): Observable<any> {
    const data: any = {}
    data.batchList = batchList
    data.requestValidate = requestValidate

    return this.http
      .put(this.servicesUrl + '/chequeBook/pendingActions/stop/confirm', data)
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

  public refuseConfirmStopCheque(batchList, rejectReason): Observable<any> {
    const data: any = {}
    data.batchList = batchList
    data.rejectionReason = rejectReason

    return this.http
      .put(this.servicesUrl + '/chequeBook/pendingActions/stop/refuse', data)
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

  public getPendingPositivePay(page, rows): Observable<any> {
    const data: any = {}
    data.page = page
    data.rows = rows

    return this.http
      .post(this.servicesUrl + '/positivePayCheck/pendingActions/list', data)
      .pipe(
        map((response: any, index: number) => {
          let result: any = {}

          const output = response

          if (output.errorCode !== '0') {
            result.error = true
            result.errorCode = output.errorCode
            result.errorDescription = output.errorDescription
          } else {
            result = output.batchList
            result.error = false
          }
          return result
        }),
      )
  }

  public authorizeValidatePositivePay(batchList): Observable<any> {
    const data: any = {}
    data.batchList = batchList

    return this.http
      .post(
        this.servicesUrl + '/positivePayCheck/pendingActions/validate',
        data,
      )
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

  public authorizeConfirmPositivePay(
    batchList,
    requestValidate,
  ): Observable<any> {
    const data: any = {}
    data.batchList = batchList
    data.requestValidate = requestValidate

    return this.http
      .put(this.servicesUrl + '/positivePayCheck/pendingActions/confirm', data)
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

  public refuseConfirmPositivePay(batchList, rejectReason): Observable<any> {
    const data: any = {}
    data.batchList = batchList
    data.rejectionReason = rejectReason

    return this.http
      .put(this.servicesUrl + '/positivePayCheck/pendingActions/refuse', data)
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
