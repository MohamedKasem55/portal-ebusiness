import { Observable } from 'rxjs'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { AbstractListService } from '../../../../../Common/Services/Abstract/abstract-list.service'
import { ConfigResourceService } from '../../../../../../../core/config/config.resource.local'

@Injectable()
export class InitiateSadadTestingListService extends AbstractListService {
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
    return this.http.get(this.servicesUrl + '/sadadolp/testing/initiate/list')
  }

  protected getOutputFromRequestedData(_body) {
    return _body.listBop
  }
}
