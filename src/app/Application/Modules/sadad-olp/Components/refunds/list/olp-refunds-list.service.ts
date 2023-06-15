import { Observable } from 'rxjs'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { AbstractListService } from '../../../../Common/Services/Abstract/abstract-list.service'
import { ConfigResourceService } from '../../../../../../core/config/config.resource.local'

@Injectable()
export class OLPRefundListService extends AbstractListService {
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
      dateFrom: criteria.dateFrom ? criteria.dateFrom : null,
      dateTo: criteria.dateTo ? criteria.dateTo : null,
      initiator: criteria.initiatorType ? criteria.initiatorType : null,
      order: order,
      orderType: orderType,
      page: page,
      refundId: criteria.refundId ? criteria.refundId : null,
      refundStatus: criteria.refundStatus ? criteria.refundStatus : null,
      rows: rows,
      transactionId: criteria.transactionId ? criteria.transactionId : null,
    }
    //console.log("Petición --> ", JSON.stringify(params));
    return this.http.post(this.servicesUrl + '/sadadolp/refunds/list', params)
  }

  protected getOutputFromRequestedData(_body) {
    return _body.refundsList
  }
}
