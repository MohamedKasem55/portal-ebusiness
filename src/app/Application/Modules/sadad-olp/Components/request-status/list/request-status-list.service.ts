import { throwError as observableThrowError, Observable } from 'rxjs'
import { Injectable } from '@angular/core'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { ConfigResourceService } from '../../../../../../core/config/config.resource.local'
import { Exception } from '../../../../../Model/exception'

@Injectable()
export class OLPRequestStatusListService {
  servicesUrl: string

  constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  public listRerfunds(page: number, rows: number): Observable<any> {
    const params = {
      page: page,
      rows: rows,
    }

    return this.http.post(
      this.servicesUrl + '/sadadolp/requestStatus/refunds/list',
      params,
    )
  }

  public listDisputes(page: number, rows: number): Observable<any> {
    const params = {
      page: page,
      rows: rows,
    }

    return this.http.post(
      this.servicesUrl + '/sadadolp/requestStatus/disputes/list',
      params,
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
