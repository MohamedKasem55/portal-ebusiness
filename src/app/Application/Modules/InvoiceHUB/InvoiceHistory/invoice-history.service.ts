import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable, Injector } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from '../../../Model/exception'
import { ModelPipe } from '../../../Components/common/Pipes/model-pipe'
import { StaticService } from '../../Common/Services/static.service'

@Injectable()
export class InvoiceHistoryService {
  servicesUrl: string
  combosData: any = {}

  constructor(
    private http: HttpClient,
    private config: ConfigResourceService,
    private injector: Injector,
    private staticService: StaticService,
  ) {
    this.servicesUrl = config.getServicesUrl()

    const combosKeys = ['errors']
    this.combosData['errors'] = []

    this.staticService.getAllCombos(combosKeys).subscribe((comboData) => {
      const data = comboData

      const errorsCodes = data[combosKeys.indexOf('errors')]['values']
      Object.keys(errorsCodes).map((key, index) => {
        this.combosData['errors'][key] = errorsCodes[key]
      })
    })
  }

  getHistory(searchOptions): Observable<any> {
    return this.http
      .post(this.servicesUrl + '/sadadInvoice/history/list', searchOptions)
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
            for (const item of result.sadadInvoicePagedResults.items) {
              const maxLevel = item.securityLevelsDTOList.length - 1
              if (item.securityLevelsDTOList[maxLevel].status === 'A') {
                item.payDate = item.securityLevelsDTOList[0].updateDate
              }
              // item.returnCodeS = item.returnCode ? new ModelPipe(this.injector).transform(
              //     'errors',
              //     'errorTable.' + this.getStatusTranslateCode(item.returnCode))
              //     :
              //     '';
            }
            this.addTransformValues(result.sadadInvoicePagedResults.items)
            result.error = false
          }
          return result
        }),
        catchError(this.handleError),
      )
  }

  private addTransformValues(items): Array<any> {
    if (items == null) {
      return items
    }
    for (const item of items) {
      const status =
        'errorTable.' + this.getStatusTranslateCode(item.returnCode)
      const statusTrans = this.combosData['errors'][status]
        ? this.combosData['errors'][status]
        : item.status
      item.statusTrans = statusTrans
    }

    return items
  }

  public getStatusTranslateCode(value): any {
    if (value == '000') {
      return 'P000'
    }
    return value
  }

  public handleError(error: HttpResponse<any> | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string
    if (error instanceof HttpResponse) {
      const err = error['error'] || JSON.stringify(error)
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`
    } else {
      errMsg = error.message ? error.message : error.toString()
    }
    console.error(errMsg)
    const errorService: Exception = new Exception('handle', errMsg)
    return observableThrowError(errorService)
  }
}
