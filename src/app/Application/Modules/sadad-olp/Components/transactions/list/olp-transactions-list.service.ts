import { Observable } from 'rxjs'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { AbstractListService } from '../../../../Common/Services/Abstract/abstract-list.service'
import { ConfigResourceService } from '../../../../../../core/config/config.resource.local'

@Injectable()
export class OLPTransactionsListService extends AbstractListService {
  selectedFilter: string = ''

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
      transactionId: criteria.transactionID ? criteria.transactionID : null,
      dateFrom: criteria.dateFrom ? criteria.dateFrom : null,
      dateTo: criteria.dateTo ? criteria.dateTo : null,
      status: criteria.transactionStatus ? criteria.transactionStatus : null,
      page: page,
      order: order,
      orderType: orderType,
      rows: rows,
      sort: '',
    }

    return this.http.post(
      this.servicesUrl + '/sadadolp/transactions/list',
      params,
    )
  }

  protected getOutputFromRequestedData(_body) {
    return _body.transactionsList
  }
}
