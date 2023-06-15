import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import { DatePipe } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { AuthenticationService } from '../../../../../core/security/authentication.service'

@Injectable()
export class DirectDebitsService {
  private servicesUrl: string
  currentItem: BehaviorSubject<any> = new BehaviorSubject<any>(null)
  result_model_status: any
  singleSelected: BehaviorSubject<any> = new BehaviorSubject([])

  constructor(
    public datePipe: DatePipe,
    private http: HttpClient,
    public config: ConfigResourceService,
    public authenticationService: AuthenticationService,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  getListImport(page, rows) {
    const data: any = {}
    data.page = page
    data.rows = rows

    return this.http
      .post(
        this.servicesUrl + '/directDebits/pendingActions/uploadBatch/list',
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

  getListSingle(page, rows) {
    const data: any = {}
    data.page = page
    data.rows = rows

    return this.http
      .post(this.servicesUrl + '/directDebits/pendingActions/batch/list', data)
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

  singleValidate(batch) {
    const data: any = {}
    data.batchList = batch
    data.claimDate = this.datePipe.transform(batch[0].claimDate, 'yyyy-MM-dd') //TODO patch to go foward, check endppoint with a BE

    return this.http
      .post(
        this.servicesUrl + '/directDebits/pendingActions/batch/validate',
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

  singleDetails(batch) {
    const data: any = {}
    data.batchList = [batch]
    data.claimDate = this.datePipe.transform(batch.claimDate, 'yyyy-MM-dd')

    return this.http
      .post(
        this.servicesUrl + '/directDebits/pendingActions/batch/details',
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

  singleConfirm(directDebit, requestValidate) {
    directDebit.claimDate = this.datePipe.transform(
      directDebit.claimDate,
      'yyyy-MM-dd',
    )
    const data: any = {}
    data.batchList = directDebit.batchList
    data.requestValidate = requestValidate

    return this.http
      .post(
        this.servicesUrl + '/directDebits/pendingActions/batch/confirm',
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

  singleRefuse(batch, rejectReason) {
    const data: any = {}
    data.batchList = batch
    data.rejectionReason = rejectReason

    return this.http
      .post(
        this.servicesUrl + '/directDebits/pendingActions/batch/refuse',
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

  importsValidate(batch) {
    const data: any = {}
    data.batch = batch

    return this.http
      .post(
        this.servicesUrl + '/directDebits/pendingActions/uploadBatch/validate',
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

  importsRefuseDetails(batch) {
    const data: any = {}
    data.batch = batch

    return this.http
      .post(
        this.servicesUrl + '/directDebits/pendingActions/uploadBatch/details',
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
  importsConfirm(batchDetailsDTO, requestValidate) {
    const data: any = {}
    data.directDebitBatch = batchDetailsDTO
    data.requestValidate = requestValidate

    return this.http
      .post(
        this.servicesUrl + '/directDebits/pendingActions/uploadBatch/confirm',
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

  importsRefuse(batchDetailsDTO, rejectReason) {
    const data: any = {}
    data.batch = batchDetailsDTO[0]
    data.rejectionReason = rejectReason

    return this.http
      .post(
        this.servicesUrl + '/directDebits/pendingActions/uploadBatch/refuse',
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

  setCurrentItem(value) {
    this.currentItem.next(value)
  }

  getCurrentItemData() {
    return this.currentItem.asObservable()
  }

  getDirectDebitPADetail(row): Observable<any> {
    // return this.singleValidate(row);
    return this.singleDetails(row)
  }

  getDirectDebitUploadFileDetail(row): Observable<any> {
    // return this.importsValidate(row)
    return this.importsRefuseDetails(row)
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

  setSingleSelected(selected) {
    this.singleSelected.next(selected)
  }

  get getSingleSelected() {
    return this.singleSelected.asObservable()
  }
}
