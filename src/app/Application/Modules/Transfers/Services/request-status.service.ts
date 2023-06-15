import { HttpClient, HttpResponse } from '@angular/common/http'
import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from 'app/Application/Model/exception'
import { ModelPipe } from '../../../Components/common/Pipes/model-pipe'
import { AmountCurrencyPipe } from '../../../Components/common/Pipes/amount-currency.pipe'
import { LevelFormatPipe } from '../../../Components/common/Pipes/getLevels-pipe'
import { StatusPipe } from '../../../Components/common/Pipes/status-pipe'
import { TranslateService } from '@ngx-translate/core'
import { Router } from '@angular/router'
import { AuthenticationService } from '../../../../core/security/authentication.service'

@Injectable()
export class RequestStatusTransferService {
  servicesUrl: string
  currentUser

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    public translate: TranslateService,
    protected injector: Injector,
    @Inject(LOCALE_ID) private _locale: string,
  ) {
    this.servicesUrl = config.getServicesUrl()

    new ModelPipe(this.injector).transform('batchTypes', null)
    new ModelPipe(this.injector).transform('backEndCountryCode', null)
    new AmountCurrencyPipe(this.injector, this._locale).transform(0, '608')
    new ModelPipe(this.injector).transform('currencyIso', '608')
    new LevelFormatPipe(this.injector).transform([], 'status')
    new LevelFormatPipe(this.injector).transform([], 'nextStatus')
  }

  public handleError(error: HttpResponse<any> | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string
    if (error instanceof HttpResponse) {
      const err = error['error'] || JSON.stringify(error)
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`
    } else {
      errMsg = error.message ? error.message : error.toString()
    }
    console.error(errMsg)
    const errorService: Exception = new Exception('handle', errMsg)
    return observableThrowError(errorService)
  }

  getList(pageList: number, rowsList: number): Observable<any> {
    const data = {
      page: pageList,
      pending: false,
      rows: rowsList,
    }

    return this.http
      .post(this.servicesUrl + '/transfers/batch/list', data)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return observableThrowError(exception)
          } else {
            const output = response
            if (
              Array.isArray(output.transfers.items) &&
              output.transfers.items.length > 0
            ) {
              output.transfers.items.forEach((item) => {
                item['batchTypeExport'] = new ModelPipe(
                  this.injector,
                ).transform('batchTypes', item.batchType)
                item['fullAccountNumber'] = item.accountFrom.fullAccountNumber
                item['countryExport'] = new ModelPipe(this.injector).transform(
                  'backEndCountryCode',
                  item.country,
                )
                item['purposeDescriptionExport'] =
                  this.translate.currentLang == 'en'
                    ? item.purposeDescriptionEN
                    : item.purposeDescriptionAR
                item['alias'] = item.accountFrom.alias
                item['amcurExport'] =
                  new AmountCurrencyPipe(this.injector, this._locale).transform(
                    item.amount ? item.amount : 0,
                    item.currency,
                  ) +
                  ' ' +
                  new ModelPipe(this.injector).transform(
                    'currencyIso',
                    item.currency,
                  )
                item['curStatusExport'] = new LevelFormatPipe(
                  this.injector,
                ).transform(item.securityDetails, 'status')
                item['nextStatusExport'] = new LevelFormatPipe(
                  this.injector,
                ).transform(item.securityDetails, 'nextStatus')
                item['statusExport'] = new StatusPipe(this.injector).transform(
                  item.status,
                )
              })
            }
            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  getWithinList(): Observable<any> {
    const data = {}
    const req = JSON.stringify(data)
    return this.http
      .post(this.servicesUrl + '/transfers/requestStatus/within/list', req)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return observableThrowError(exception)
          } else {
            const output = response
            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  getLocalList(): Observable<any> {
    const data = {}
    const req = JSON.stringify(data)
    return this.http
      .post(this.servicesUrl + '/transfers/requestStatus/local/list', req)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return observableThrowError(exception)
          } else {
            const output = response
            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  getInternationalList(): Observable<any> {
    const data = {}
    const req = JSON.stringify(data)
    return this.http
      .post(
        this.servicesUrl + '/transfers/requestStatus/international/list',
        req,
      )
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return observableThrowError(exception)
          } else {
            const output = response
            return output
          }
        }),
        catchError(this.handleError),
      )
  }
}
