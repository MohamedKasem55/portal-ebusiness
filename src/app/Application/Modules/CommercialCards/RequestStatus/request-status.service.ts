import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from 'app/Application/Model/exception'

@Injectable()
export class RequestStatusService {
  route = '/businessCards/requestStatus/'
  servicesUrl: string
  cardDetails: any
  constructor(private http: HttpClient, private config: ConfigResourceService) {
    this.servicesUrl = config.getServicesUrl()
  }

  getList(page, rows): Observable<any> {
    const data: any = {}
    data.page = page
    data.rows = rows

    const body = JSON.stringify(data)

    return this.http.post(this.servicesUrl + this.route + 'list', body).pipe(
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

  setCardDetails(details) {
    this.cardDetails = details
  }

  getCardDetails() {
    return this.cardDetails
  }
}
