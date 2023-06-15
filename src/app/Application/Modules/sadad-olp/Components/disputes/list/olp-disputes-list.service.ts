import { Observable } from 'rxjs'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { AbstractListService } from '../../../../Common/Services/Abstract/abstract-list.service'
import { ConfigResourceService } from '../../../../../../core/config/config.resource.local'

@Injectable()
export class OLPDisputesListService extends AbstractListService {
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
      category: criteria.disputeReason ? criteria.disputeReason : null,
      dateFrom: criteria.dateFrom ? criteria.dateFrom : null,
      dateTo: criteria.dateTo ? criteria.dateTo : null,
      disputeId: criteria.disputeId ? criteria.disputeId : null,
      order: order,
      orderType: orderType,
      page: page,
      rows: rows,
      sort: '',
      status: criteria.status ? criteria.status : null,
      transactionId: criteria.transactionId ? criteria.transactionId : null,
    }

    return this.http.post(this.servicesUrl + '/sadadolp/disputes/list', params)
  }

  public init(): Observable<any> {
    return this.http.get(this.servicesUrl + '/sadadolp/disputes/init')
  }

  protected getOutputFromRequestedData(_body) {
    return _body.disputesList
  }
}
