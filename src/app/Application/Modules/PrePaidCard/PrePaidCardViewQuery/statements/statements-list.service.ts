import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ConfigResourceService } from 'app/core/config/config.resource.local'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { AbstractListService } from '../../../Common/Services/Abstract/abstract-list.service'

@Injectable()
export class StatementsListService extends AbstractListService {
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
      stmtDate: criteria.month,
      cardSeqNumber: criteria.card,
    }
    return this.http.post(this.servicesUrl + '/prepaidCards/statements', params)
  }

  protected getOutputFromRequestedData(_body) {
    // TODO totalAmount
    const items =
      _body.alrajhiCreditCardsStatement.alrajhiCreditCardStmtList.items
    if (items && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        items[i].totalAmount =
          _body.alrajhiCreditCardsStatement.alrajhiCreditCardsStatementsDetails.statementAmount
      }
    }
    return {
      size: _body.alrajhiCreditCardsStatement.alrajhiCreditCardStmtList.size,
      items: _body.alrajhiCreditCardsStatement.alrajhiCreditCardStmtList.items,
      total: _body.alrajhiCreditCardsStatement.alrajhiCreditCardStmtList.total,
    }
  }

  public statementsListKeysValues(values: any): Observable<any> {
    return this.createStatementsListKeysValuesRequest(values).pipe(
      map((response: any) => {
        return response
      }),
      catchError(this.handleError),
    )
  }

  protected createStatementsListKeysValuesRequest(
    values: any,
  ): Observable<any> {
    const params = {
      cardSeqNumber: values,
    }
    return this.http.post(
      this.servicesUrl + '/prepaidCards/statement/list',
      params,
    )
  }
}
