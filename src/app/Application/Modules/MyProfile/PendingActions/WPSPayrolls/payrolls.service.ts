import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import { DatePipe } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { AuthenticationService } from '../../../../../core/security/authentication.service'
import { StorageService } from '../../../../../core/storage/storage.service'

@Injectable()
export class PayrollsService {
    private servicesUrl: string
    private payrollUrl: string
    currentItem: BehaviorSubject<any> = new BehaviorSubject<any>(null)
  result_model_status: any

  salarySelectedObs: BehaviorSubject<any> = new BehaviorSubject([])
  payrollSelectedObs: BehaviorSubject<any> = new BehaviorSubject([])

    constructor(
        public datePipe: DatePipe,
        private http: HttpClient,
        public config: ConfigResourceService,
        public authenticationService: AuthenticationService,
        public storageService: StorageService,
    ) {
        this.servicesUrl = config.getServicesUrl()
        this.payrollUrl = config.getPayrollUrl()
        this.getPayrollLayout()
    }

  getListPayroll(page, rows) {
    const data: any = {}
    data.page = page
    data.rows = rows

    return this.http
      .post(
        this.servicesUrl + '/payrollWPS/pendingActions/importPayroll/list',
        data,
      )
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

  getListSalary(page, rows) {
    const data: any = {}
    data.page = page
    data.rows = rows

    return this.http
      .post(this.servicesUrl + '/payrollWPS/pendingActions/salary/list', data)
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

  salaryPaymentsPayroll(payrollSalaryPaymentBatch) {
    const data: any = {}
    data.batch = payrollSalaryPaymentBatch
    data.paymentDate = this.datePipe.transform(
      payrollSalaryPaymentBatch.paymentDate,
      'yyyy-MM-dd',
    )
    return this.http
      .post(
        this.servicesUrl + '/payrollWPS/pendingActions/salary/getPayroll',
        data,
      )
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

  salaryPaymentsValidate(payrollSalaryPaymentBatch) {
    const data: any = {}
    data.batch = payrollSalaryPaymentBatch
    data.paymentDate = this.datePipe.transform(
      payrollSalaryPaymentBatch.paymentDate,
      'yyyy-MM-dd',
    )

    return this.http
      .post(
        this.servicesUrl + '/payrollWPS/pendingActions/salary/validate',
        data,
      )
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

  salaryPaymentsConfirm(payrollSalaryPaymentBatchDTO, requestValidate) {
    payrollSalaryPaymentBatchDTO.paymentDate = this.datePipe.transform(
      payrollSalaryPaymentBatchDTO.paymentDate,
      'yyyy-MM-dd',
    )
    const data: any = {}
    data.payrollSalaryPaymentBatch = payrollSalaryPaymentBatchDTO
    data.requestValidate = requestValidate

    return this.http
      .post(
        this.payrollUrl + '/payrollWPS/pendingActions/salary/confirm',
        data,
      )
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

  salaryPaymentsRefuse(payrollSalaryPaymentBatchDTO, rejectReason) {
    const data: any = {}
    data.batchDetails = payrollSalaryPaymentBatchDTO
    data.rejectionReason = rejectReason

    return this.http
      .post(this.servicesUrl + '/payrollWPS/pendingActions/salary/refuse', data)
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

  public importsPayrollsValidate(payrollUploadBatch): Observable<any> {
    const data: any = {
      batchList: payrollUploadBatch,
    }

    return this.http
      .post(
        this.servicesUrl + '/payrollWPS/pendingActions/importPayroll/validate',
        data,
      )
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

  importsPayrollsConfirm(batchList, requestValidate) {
    const data: any = {}
    data.batchList = batchList
    data.requestValidate = requestValidate

    return this.http
      .post(
        this.payrollUrl + '/payrollWPS/pendingActions/importPayroll/confirm',
        data,
      )
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

  importsPayrollsRefuse(batchList, rejectReason) {
    const data: any = {}
    data.batchList = batchList
    data.rejectionReason = rejectReason

    return this.http
      .post(
        this.servicesUrl + '/payrollWPS/pendingActions/importPayroll/refuse',
        data,
      )
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

  setCurrenItem(value) {
    this.currentItem.next(value)
  }

  getCurrentItemData() {
    return this.currentItem.asObservable()
  }

  public getSalaryPaymentsDetail(row): Observable<any> {
    return this.salaryPaymentsValidate(row)
  }

  public getPayrollsDetail(row): Observable<any> {
    return this.importsPayrollsValidate(row)
  }

  public getModel(lang: string, prop: string): Observable<any> {
    const data: any = {}
    data.name = prop

    return this.http.post(this.servicesUrl + '/statics/model', data).pipe(
      map((response: any) => {
        if (response.props) {
          const result = []

          for (const _prop in response.props) {
            if (_prop) {
              result.push({ key: _prop, value: response.props[_prop] })
            }
          }
          return result
        } else {
          return '[]'
        }
      }),
      catchError((error: any, caught: Observable<any>): Observable<any> => {
        return of('[]')
      }),
    )
  }

  retrieveValue(key): string {
    let row: any
    for (row of this.result_model_status) {
      if (row.key == key) {
        return row.value
      }
    }
    return ''
  }

  getPayrollLayout() {
    const user = JSON.parse(this.storageService.retrieve('currentUser'))
    return user.company.payrollLayout // WMS or WPS
  }

  isWMSPayrollLayout() {
    return this.getPayrollLayout() == 'WMS'
  }

  isWPSPayrollLayout() {
    return this.getPayrollLayout() == 'WPS'
  }

  setSalarySelected(selected) {
    // console.log('set bill', billSelected);
    this.salarySelectedObs.next(selected)
  }

  get salarySelected() {
    return this.salarySelectedObs.asObservable()
  }

  setPayrollSelected(selected) {
    // console.log('set bill', billSelected);
    this.payrollSelectedObs.next(selected)
  }

  get payrollSelected() {
    return this.payrollSelectedObs.asObservable()
  }
}
