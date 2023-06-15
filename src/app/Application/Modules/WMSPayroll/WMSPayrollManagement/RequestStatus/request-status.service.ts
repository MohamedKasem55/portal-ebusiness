import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'

@Injectable()
export class RequestStatusService {
  servicesUrl: string
  payment: any
  paymentFile: any

  constructor(private http: HttpClient, private config: ConfigResourceService) {
    this.servicesUrl = config.getServicesUrl()
  }

  setPayment(payment) {
    this.payment = payment
  }

  getPayment() {
    const pay = this.payment
    return pay
  }

  setPaymentFile(payment) {
    this.paymentFile = payment
  }

  getPaymentFile() {
    const pay = this.paymentFile
    return pay
  }

  getData(page, rows): Observable<any> {
    const data: any = {}
    data.page = page
    data.rows = rows

    const body = JSON.stringify(data)

    return this.http
      .post(this.servicesUrl + '/payrollWPS/requestStatus/fileUploadList', body)
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
      payrollBatch: batch,
    }
    return this.http
      .post(this.servicesUrl + '/payrollWPS/requestStatus/getBatch', data)
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

  public getBatchFile(batch): Observable<any> {
    const data = {
      payrollUploadBatch: batch,
    }
    return this.http
      .post(this.servicesUrl + '/payrollWPS/requestStatus/getBatchFile', data)
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
}
