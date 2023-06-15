import { Observable } from 'rxjs'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { AbstractListService } from '../../../../../Common/Services/Abstract/abstract-list.service'
import { ConfigResourceService } from '../../../../../../../core/config/config.resource.local'

@Injectable()
export class ViewSadadTestingListService extends AbstractListService {
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
      endDate: criteria.endDate ? criteria.endDate : null,
      page: page,
      rows: rows,
      sort: '',
      startDate: criteria.startDate ? criteria.startDate : null,
      status: criteria.status ? criteria.status : null,
      testRqId: criteria.testRqId ? criteria.testRqId : null,
    }

    return this.http.post(
      this.servicesUrl + '/sadadolp/testing/view/list',
      params,
    )
  }

  protected getOutputFromRequestedData(_body) {
    return _body.testingViewList
  }
}
