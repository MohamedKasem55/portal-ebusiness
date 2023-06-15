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
      dateFrom: this.datePipe.transform(searchData.dateFrom, 'yyyy-MM-dd'), //"string",
      dateTo: this.datePipe.transform(searchData.dateTo, 'yyyy-MM-dd'), //"string",
      status: searchData.status,
      page,
      rows,
    }

    const body = JSON.stringify(data)

    return this.http
      .post(
        this.servicesUrl + '/posManagement/requestStatus/management/list',
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
            result.posManagementBatchList.items.forEach((a) => {
              a['posManagementRequestType'] = a['typeRequest']
            })
            result.error = false
          }
          return result
        }),
      )
  }

  setElement(element) {
    this.element = element
  }

  getElement() {
    const ele = this.element
    return ele
  }
}
