import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ConfigResourceService } from 'app/core/config/config.resource.local'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { AbstractListService } from '../../../Common/Services/Abstract/abstract-list.service'

@Injectable()
export class CreditCardsDetailsStatementsService extends AbstractListService {
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
      month: criteria.month,
    }
    return this.http.post(
      this.servicesUrl + '/creditCards/statement/list',
      params,
    )
  }

  protected getOutputFromRequestedData(_body) {
    // TODO totalAmount
    const items = _body.creditCardStatementList.statementList
    if (items && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        items[i].totalAmount = _body.creditCardStatementList.totalAmount
      }
    }
    return {
      size: _body.creditCardStatementList.size,
      items: _body.creditCardStatementList.statementList,
      total: _body.creditCardStatementList.total,
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
      page: 1,
      rows: 20,
      card: values.card,
      month: null,
    }
    return this.http.post(
      this.servicesUrl + '/creditCards/statement/list',
      params,
    )
  }
}
