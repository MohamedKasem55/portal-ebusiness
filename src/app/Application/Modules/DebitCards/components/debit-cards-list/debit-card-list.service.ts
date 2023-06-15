import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

import { Observable } from 'rxjs'
import { AbstractListService } from '../../../Common/Services/Abstract/abstract-list.service'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'

@Injectable()
export class DebitCardListService extends AbstractListService {
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
  ): Observable<any> {
    const params = {
      recPgCtrlIn: {
        maxRecs: 20,
        offset: 1,
      },
    }

    return this.http.post(this.servicesUrl + '/debitcard/list', params)
  }

  protected getOutputFromRequestedData(_body) {
    const cards = _body.cardDtlsLst
    return {
      items: cards, // _body.cardsList,
      total: cards.length,
      size: cards.length,
    }
  }
}
