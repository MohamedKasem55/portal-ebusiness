import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { DateFormatPipe } from '../../../Components/common/Pipes/date-format-pipe'
import { Exception } from 'app/Application/Model/exception'

@Injectable()
export class CardallReqService {
  servicesUrl: string
  dateFormat = 'yyyy-MM-dd'

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    private dateFormatPipe: DateFormatPipe,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  public cardallocValidate(data: any): Observable<any> {
    return this.http.post(
      this.servicesUrl + '/hajjumra/validateCardAllocated',
      data,
    )
  }

  public cardAllocConfirm(params: any, requestValidate): Observable<any> {
    const data = {
      batchDTO: params.batchDTO,
      requestValidate,
    }
    return this.http.post(
      this.servicesUrl + '/hajjumra/confirmCardAllocated',
      data,
    )
  }

  public initiateCard(data): Observable<any> {
    return this.http.post(
      this.servicesUrl + '/hajjumra/initiateCardAllocated',
      data,
    )
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
