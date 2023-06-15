import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from 'app/Application/Model/exception'

@Injectable()
export class RequestStatusService {
  servicesUrl: string
  payment: any
  accounts: any
  cardDetails: any

  constructor(private http: HttpClient, private config: ConfigResourceService) {
    this.servicesUrl = config.getServicesUrl()
  }

  getList(page, rows): Observable<any> {
    const data: any = {}
    data.page = page
    data.rows = rows

    const body = JSON.stringify(data)

    return this.http
      .post(this.servicesUrl + '/prepaidCards/requestStatus/list', body)
      .pipe(
        map((response: any) => {
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

  public getListReplace(page, rows): Observable<any> {
    const data: any = {}
    data.page = page
    data.rows = rows

    const body = JSON.stringify(data)

    return this.http
      .post(this.servicesUrl + '/prepaidCards/replace/requestStatus/list', body)
      .pipe(
        map((response: any) => {
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

  public initPayment(aramcoBatch): Observable<any> {
    const data = {
      aramcoBatch,
    }
    return this.http
      .post(this.servicesUrl + '/aramcoPaymets/requestStatus/details', data)
      .pipe(
        map((response: any) => {
          // return this.http.post(this.servicesUrl + "/commercialCards/requestStatus/details", data).pipe(map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return exception
          } else {
            const output = body
            return output
          }
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
    const accounts = this.accounts
    return accounts
  }

  public setCardDetails(cardDetails): void {
    this.cardDetails = cardDetails
  }

  public getCardDetails(): any {
    return this.cardDetails
  }
}
