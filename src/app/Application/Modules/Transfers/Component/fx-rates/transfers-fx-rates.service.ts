import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { Observable } from 'rxjs'
import { AbstractListService } from '../../../Common/Services/Abstract/abstract-list.service'

@Injectable()
export class TransfersFxRatesService extends AbstractListService {
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
      fromCurrencyCode: criteria.fromCurrencyCode
        ? criteria.fromCurrencyCode
        : null,
      toCurrencyCode: criteria.toCurrencyCode ? criteria.toCurrencyCode : null,
      baseAmount: criteria.baseAmount ? criteria.baseAmount : 0,
    }
    return this.http.post(
      this.servicesUrl + '/transfers/international/fxrates',
      params,
    )
  }

  protected getOutputFromRequestedData(_body) {
    const fxRatesList = _body.fxRatesList
    fxRatesList.forEach((item) => {
      item['targetAmount'] = _body.targetAmount
      item['exchangeValue'] = _body.exchangeValue
    })
    return {
      items: fxRatesList,
      size: fxRatesList.length,
      total: fxRatesList.length,
      targetAmount: _body.targetAmount,
      exchangeValue: _body.exchangeValue,
    }
  }
}
