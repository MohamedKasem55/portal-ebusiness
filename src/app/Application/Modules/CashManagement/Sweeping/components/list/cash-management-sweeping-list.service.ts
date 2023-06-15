import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ConfigResourceService } from '../../../../../../core/config/config.resource.local'
import { AbstractListService } from '../../../../Common/Services/Abstract/abstract-list.service'

@Injectable()
export class CashManagementSweepingListService extends AbstractListService {
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

    return this.http.post(this.servicesUrl + '/sweeping/list', data)
  }

  protected getOutputFromRequestedData(_body) {
    const structures = _body.sweepingListOutputDTO.cashManagmentDTOList
    structures.forEach((item, i) => {
      item['structureId'] = item['structureId']
        ? item['structureId']
        : item['selected']
    })
    return {
      items: structures, // _body.cardsList,
      total: structures.length,
      size: structures.length,
    }
  }
}
