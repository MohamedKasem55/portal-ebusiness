import { Injectable } from '@angular/core'
import { AbstractService } from '../../../Common/Services/Abstract/abstract.service'
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpRequest,
} from '@angular/common/http'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

@Injectable()
export class ProcessedTransactionsService extends AbstractService {
  requestedCombos: any[]
  selectedItem: any;

  constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
  ) {
    super(http, config)
  }

  public getProcessedTransactions(searchTerms): Observable<any> {
    return this.http
      .post(
        this.config.getServicesUrl() + '/transfers/processedTransaction/search',
        searchTerms,
      )
      .pipe(
        map((response: any) => {
          if (response.errorCode && response.errorCode === '0') {
            response['transfers']['items'].forEach((item) => {
              item['_pais'] = this.transformComboValue(
                'backEndCountryCode',
                item['country'],
              )
              item['_currency'] = this.transformComboValue(
                'currency',
                item['currency'],
              )
              item['_transferType'] = ''
              item['_status'] = this.transformComboValue(
                'batchSecurityLevelStatus',
                item['status'],
              )
            })
          }
          return response
        }),
      )
  }

  public getAccountsComboData(): Observable<any> {
    const data = {
      order: '',
      orderType: '',
      page: 1,
      rows: 100,
      txType: 'ECIA',
    }
    return this.http.post(this.servicesUrl + '/accounts/combo', data).pipe(
      map((response: any) => {
        return response
      }),
    )
  }

  public getUsersComboData(): Observable<any> {
    return this.http
      .get(this.servicesUrl + '/transfers/processedTransaction/search/users')
      .pipe(
        map((response: any) => {
          return response
        }),
      )
  }

  transformComboValue(comboName, key): string {
    let value = ''
    if (this.requestedCombos === undefined) {
      return value
    }
    const combo = this.requestedCombos.find((rqCb) => {
      return rqCb['name'] === comboName
    })
    if (combo === undefined || combo === null) {
      return value
    }
    value = combo.comboValues.find((item) => {
      return item.key === key
    })
    if (value) {
      return value['value'] === undefined ? '' : value['value']
    }
    return ''
  }

  // GET ALL BANK NAME FILTER BY COUNTRY
  public getBankNames(idCountry: string): Observable<any> {
    //console.log("Ruta servicio: ", this.servicesUrl + "/beneficiaries/international/search/bankNameList/" + idCountry);
    // const param = {'country':idCountry};

    const param = {
      amountFrom: 0,
      amountTo: 0,
      approvedBy: null,
      beneficiaryBank: null,
      country: idCountry,
      currency: null,
      debitAccount: null,
      initiatedBy: null,
      lastApprovalDateFrom: null,
      lastApprovalDateTo: null,
      page: 0,
      paymentType: null,
      rows: 100,
      status: null,
    }
    return this.http
      .post(
        this.servicesUrl +
          '/transfers/processedTransaction/search/countryBanks/',
        param,
      )
      .pipe(
        map((response: any) => {
          const body = response
          return body || {}
        }),
        catchError(this.handleError),
      )
  }

  public getSelectedItem(): any | null {
    return this.selectedItem ? this.selectedItem : null
  }

  public setSelectedItem(itemDetails: any) {
    this.selectedItem = itemDetails
  }
}
