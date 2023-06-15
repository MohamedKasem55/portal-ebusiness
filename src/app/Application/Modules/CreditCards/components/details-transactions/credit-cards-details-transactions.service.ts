import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ConfigResourceService } from 'app/core/config/config.resource.local'
import { Observable } from 'rxjs'
import { AbstractListService } from '../../../Common/Services/Abstract/abstract-list.service'

@Injectable()
export class CreditCardsDetailsTransactionsService extends AbstractListService {
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
      order,
      orderType,
      page,
      rows,
      card: criteria.card,
    }
    return this.http.post(this.servicesUrl + '/creditCards/transaction', params)
  }

  protected getOutputFromRequestedData(_body) {
    const transactions = _body.creditCardTransactions.list
    return {
      items: transactions, // _body.cardsList,
      total: transactions.length,
      size: transactions.length,
    }
  }
}
