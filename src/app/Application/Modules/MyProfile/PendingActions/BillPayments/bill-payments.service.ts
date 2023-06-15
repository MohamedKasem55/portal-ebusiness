import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { AuthenticationService } from '../../../../../core/security/authentication.service'

@Injectable()
export class BillPaymentsService {
  private servicesUrl: string

  tableSelected: BehaviorSubject<any> = new BehaviorSubject([])
  tableBillerSelected: BehaviorSubject<any> = new BehaviorSubject([])

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    public authenticationService: AuthenticationService,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  public getPendingBillBatches(page, rows): Observable<any> {
    const data: any = {}
    data.page = page
    data.rows = rows

    return this.http
      .post(
        this.servicesUrl + '/billPayment/pendingActions/billPayment/list',
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

  public getPendingBillerBatches(page, rows): Observable<any> {
    const data: any = {}
    data.page = page
    data.rows = rows

    return this.http
      .post(this.servicesUrl + '/billPayment/pendingActions/billAdd/list', data)
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
      .post(
        this.servicesUrl + '/billPayment/pendingActions/billPayment/validate',
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

  public authorizeBillerValidate(batchList): Observable<any> {
    const data: any = {}
    data.batchList = batchList

    return this.http
      .post(
        this.servicesUrl + '/billPayment/pendingActions/billAdd/validate',
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
      .put(
        this.servicesUrl + '/billPayment/pendingActions/billPayment/confirm',
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

  public authorizeBillerConfirm(batchList, requestValidate): Observable<any> {
    const data: any = {}
    data.batchList = batchList
    data.requestValidate = requestValidate

    return this.http
      .put(
        this.servicesUrl + '/billPayment/pendingActions/billAdd/confirm',
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
      .put(
        this.servicesUrl + '/billPayment/pendingActions/billPayment/refuse',
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

  public refuseBillerConfirm(batchList, rejectReason): Observable<any> {
    const data: any = {}
    data.batchList = batchList
    data.rejectionReason = rejectReason

    return this.http
      .put(
        this.servicesUrl + '/billPayment/pendingActions/billAdd/refuse',
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

  getBillCodes(): Observable<any> {
    return this.http
      .get(this.servicesUrl + '/billPaymentService/management/getBillCodes')
      .pipe(
        map((response: any) => {
          const result: any = {}
          const output = response

          if (output.errorCode !== '0') {
            result.error = true
            result.errorDescription = output.errorDescription
            result.errorCode = output.errorCode
          } else {
            result.billCodes = output.billCodesList.billsList
          }
          return result
        }),
      )
  }

  setBillPaymentsSelected(billPaymentSelected) {
    // console.log('set bill paymenst', billPaymentSelected);
    this.tableSelected.next(billPaymentSelected)
  }

  setBillSelected(billSelected) {
    // console.log('set bill', billSelected);
    this.tableBillerSelected.next(billSelected)
  }
  get billPaymentsSelected() {
    return this.tableSelected.asObservable()
  }
  get billsSelected() {
    return this.tableBillerSelected.asObservable()
  }
}
