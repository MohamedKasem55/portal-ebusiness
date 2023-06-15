import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'

@Injectable()
export class RequestStatusService {
  servicesUrl: string
  data: any
  //payment:any;
  paymentFile: any

  constructor(private http: HttpClient, private config: ConfigResourceService) {
    this.servicesUrl = config.getServicesUrl()
  }

  getData(page, rows): Observable<any> {
    const data: any = {}
    data.page = page
    data.rows = rows

    const body = JSON.stringify(data)

    return this.http
      .post(this.servicesUrl + '/chequeBook/requestStatus/create/list', body)
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

  getDataStop(page, rows): Observable<any> {
    const data: any = {}
    data.page = page
    data.rows = rows

    const body = JSON.stringify(data)

    return this.http
      .post(this.servicesUrl + '/chequeBook/requestStatus/stop/list', body)
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

  setrecoverData(rowData) {
    this.data = rowData
  }

  getrecoverData() {
    return this.data
  }
}
