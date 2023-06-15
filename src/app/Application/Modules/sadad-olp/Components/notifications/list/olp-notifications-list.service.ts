import { Observable } from 'rxjs'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { AbstractListService } from '../../../../Common/Services/Abstract/abstract-list.service'
import { ConfigResourceService } from '../../../../../../core/config/config.resource.local'

@Injectable()
export class OLPNotificationsListService extends AbstractListService {
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
      actionType: criteria.actionType ? criteria.actionType : null,
      dateFrom: criteria.dateFrom ? criteria.dateFrom : null,
      dateTo: criteria.dateTo ? criteria.dateTo : null,
      page: page,
      referenceType: criteria.referenceType ? criteria.referenceType : null,
      rows: rows,
    }

    return this.http.post(
      this.servicesUrl + '/sadadolp/notifications/list',
      params,
    )
  }

  protected getOutputFromRequestedData(_body) {
    return _body.notificationsList
  }
}
