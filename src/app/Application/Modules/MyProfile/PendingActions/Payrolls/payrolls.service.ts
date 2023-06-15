import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import { HttpClient } from '@angular/common/http'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { AuthenticationService } from '../../../../../core/security/authentication.service'

@Injectable()
export class PayrollsService {
  salarySelectedObs: BehaviorSubject<any> = new BehaviorSubject([])
  payrollSelectedObs: BehaviorSubject<any> = new BehaviorSubject([])

  public salaryDisplaySize = 20
  public payrollDisplaySize = 20

  private servicesUrl: string
  currentItem: BehaviorSubject<any> = new BehaviorSubject<any>(null)
  result_model_status: any

  resultReferenceFile: string[] = []

  getReferenceFile() {
    return this.resultReferenceFile.toString()
  }

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    public authenticationService: AuthenticationService,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  getListPayroll(page, rows) {
    const data: any = {}
    data.page = page
    data.rows = rows

    return this.http
      .post(
        this.servicesUrl +
          '/payrollStandard/pendingActions/importsPayrolls/getList',
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
      .post(
        this.servicesUrl +
          '/payrollStandard/pendingActions/salaryPayments/getList',
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

  salaryPaymentsValidate(payrollSalaryPaymentsBatchList) {
    const data = {
      payrollSalaryPaymentBatchList: payrollSalaryPaymentsBatchList,
    }

    return this.http
      .post(
        this.servicesUrl +
          '/payrollStandard/pendingActions/salaryPayments/validate',
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
    const data: any = {}
    data.batchListsContainer = payrollSalaryPaymentBatchDTO
    data.requestValidate = requestValidate

    return this.http
      .post(
        this.servicesUrl +
          '/payrollStandard/pendingActions/salaryPayments/confirm',
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

  salaryPaymentsRefuse(payrollSalaryPaymentBatchDTO, rejectionReason) {
    const data: any = {}
    data.batchList = payrollSalaryPaymentBatchDTO
    data.rejectionReason = rejectionReason

    return this.http
      .post(
        this.servicesUrl +
          '/payrollStandard/pendingActions/salaryPayments/refuse',
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

  importsPayrollsValidate(payrollUploadBatchList) {
    const data = {
      batchList: payrollUploadBatchList,
    }

    return this.http
      .post(
        this.servicesUrl +
          '/payrollStandard/pendingActions/importsPayrolls/validate',
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

  importsPayrollsConfirm(batchDetailsDTO, requestValidate) {
    const data: any = {}
    data.batchListsContainer = batchDetailsDTO
    data.requestValidate = requestValidate

    return this.http
      .post(
        this.servicesUrl +
          '/payrollStandard/pendingActions/importsPayrolls/confirm',
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

  importsPayrollsRefuse(batchDetailsDTO, rejectionReason) {
    const data: any = {}
    data.batchList = batchDetailsDTO
    data.rejectionReason = rejectionReason

    return this.http
      .post(
        this.servicesUrl +
          '/payrollStandard/pendingActions/importsPayrolls/refuse',
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

  public getSalaryPaymentsDetail(payrollSalaryPaymentBatch): Observable<any> {
    const data = {
      payrollSalaryPaymentBatchList: [payrollSalaryPaymentBatch],
    }

    return this.http
      .post(
        this.servicesUrl +
          '/payrollStandard/pendingActions/salaryPayments/validate',
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

  public getPayrollsDetail(payrollUploadBatch): Observable<any> {
    const data = {
      batchList: [payrollUploadBatch],
    }

    return this.http
      .post(
        this.servicesUrl +
          '/payrollStandard/pendingActions/importsPayrolls/validate',
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
