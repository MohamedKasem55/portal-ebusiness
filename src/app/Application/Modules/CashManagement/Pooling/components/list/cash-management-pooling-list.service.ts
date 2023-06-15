import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ConfigResourceService } from '../../../../../../core/config/config.resource.local'
import { AbstractListService } from '../../../../Common/Services/Abstract/abstract-list.service'

@Injectable()
export class CashManagementPoolingListService extends AbstractListService {
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
    const data = {
      page: page ? page : 1,
      rows: rows ? rows : 100,
    }

    return this.http.post(this.servicesUrl + '/pooling/list', data)
  }

  protected getOutputFromRequestedData(_body) {
    const structures = _body.poolingListOutputDTO.poolingDTOList
    return {
      items: structures ? structures : [], // _body.cardsList,
      total: structures ? structures.length : 0,
      size: structures ? structures.length : 0,
    }
  }
}
