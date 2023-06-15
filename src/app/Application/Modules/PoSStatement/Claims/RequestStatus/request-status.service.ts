import { DatePipe } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'

@Injectable()
export class RequestStatusService {
  servicesUrl: string
  element: any

  constructor(
    public datePipe: DatePipe,
    private http: HttpClient,
    private config: ConfigResourceService,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  getData(searchData, page, rows): Observable<any> {
    const data: any = {
      dateFrom: this.datePipe.transform(searchData.dateFrom, 'dd-MM-yyyy'), //"string",
      dateTo: this.datePipe.transform(searchData.dateTo, 'dd-MM-yyyy'), //"string",
      status: searchData.status,
      page,
      rows,
    }

    const body = JSON.stringify(data)

    return this.http
      .post(this.servicesUrl + '/posManagement/requestStatus/claim/list', body)
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

  setDataElement(element) {
    this.element = element
  }

  getDataElement() {
    const pay = this.element
    return pay
  }
}
