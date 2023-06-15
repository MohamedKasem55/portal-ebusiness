import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'

@Injectable()
export class RequestStatusService {
  servicesUrl: string
  payment: any
  paymentFile: any
  accounts: any

  constructor(private http: HttpClient, private config: ConfigResourceService) {
    this.servicesUrl = config.getServicesUrl()
  }

  getData(page, rows): Observable<any> {
    const data: any = {}
    data.page = page
    data.rows = rows

    const body = JSON.stringify(data)

    return this.http
      .post(this.servicesUrl + '/sadadInvoice/requestStatus/list', body)
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

  setPayment(payment) {
    this.payment = payment
  }

  getPayment() {
    const pay = this.payment
    return pay
  }

  setAccounts(accounts) {
    this.accounts = accounts
  }

  getAccounts() {
    const pay = this.accounts
    return pay
  }
}
