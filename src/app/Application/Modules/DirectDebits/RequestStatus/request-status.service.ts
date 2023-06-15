import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'

@Injectable()
export class RequestStatusService {
  servicesUrl: string
  payment: any
  type: any

  constructor(private http: HttpClient, private config: ConfigResourceService) {
    this.servicesUrl = config.getServicesUrl()
  }

  getData(page, rows): Observable<any> {
    const data: any = {}
    data.page = page
    data.rows = rows

    const body = JSON.stringify(data)

    return this.http
      .post(this.servicesUrl + '/directDebits/requestStatus/batch/list', body)
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

  getUploadBatchData(page, rows): Observable<any> {
    const data: any = {}
    data.page = page
    data.rows = rows

    const body = JSON.stringify(data)

    return this.http
      .post(
        this.servicesUrl + '/directDebits/requestStatus/uploadBatch/list',
        body,
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

  public getBatch(batch): Observable<any> {
    const data = {
      batch,
    }
    return this.http
      .post(
        this.servicesUrl + '/directDebits/requestStatus/batch/details',
        data,
      )
      .pipe(
        map((response: any) => {
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

  public getUploadBatch(batch): Observable<any> {
    const data = {
      batch,
    }
    return this.http
      .post(
        this.servicesUrl + '/directDebits/requestStatus/uploadBatch/details',
        data,
      )
      .pipe(
        map((response: any) => {
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

  setDataElement(payment) {
    this.payment = payment
  }

  getDataElement() {
    const pay = this.payment
    return pay
  }

  setTypeData(payment) {
    this.type = payment
  }

  getTypeData() {
    const pay = this.type
    return pay
  }
}
