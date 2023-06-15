import { Observable } from 'rxjs'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { AbstractListService } from '../../../../../Common/Services/Abstract/abstract-list.service'
import { ConfigResourceService } from '../../../../../../../core/config/config.resource.local'

@Injectable()
export class RequestStatusRefundsListService extends AbstractListService {
  constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
  ) {
    super(http, config)
  }

  protected createDataRequest(
    criteria: any,
    order: string,
    orderType: string,
    page: number,
    rows: number,
  ): Observable<any> {
    const params = {
      page: page,
      rows: rows,
    }

    return this.http.post(
      this.servicesUrl + '/sadadolp/requestStatus/refunds/list',
      params,
    )
  }

  protected getOutputFromRequestedData(_body) {
    return _body.batchList
  }
}
