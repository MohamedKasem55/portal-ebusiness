import {
  BusinessCardsList,
  BusinessCardsListItems,
  BusinessDetailAndList,
} from './commercial-cards-models'
import { Injectable } from '@angular/core'
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { ConfigResourceService } from '../../../core/config/config.resource.local'
import { CryptoService } from '../../../core/crypto/crypto.service'
import { TranslateService } from '@ngx-translate/core'
import { catchError } from 'rxjs/internal/operators/catchError'
import { Exception } from '../../Model/exception'
import { map } from 'rxjs/operators'

@Injectable()
export class CommercialCardsService {
  public servicesUrl: string
  public pinIndexCode = 5
  public accountIndexMax = 13
  public accountIndexMin = 6
  public accountNumber = 0
  public static BIN = '490810'
  public businessCardsList: BusinessCardsListItems[]
  public businessCardsItem: BusinessCardsListItems
  public businessDetailAndList: BusinessDetailAndList

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    public translate: TranslateService,
    private cryptoService: CryptoService,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  public handleError(error: HttpResponse<any> | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string
    if (error instanceof HttpResponse) {
      const err = error['error'] || JSON.stringify(error)
      console.log('HAndlerError', err)
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`
    } else {
      errMsg = error.message ? error.message : error.toString()
    }
    // console.error(errMsg);
    console.log('HAndlerError', errMsg)
    const errorService: Exception = new Exception('handle', errMsg)
    return Observable.throw(errorService)
  }

  public getList(): Observable<any> {
    const request = {
      page: 1,
      rows: 20,
    }

    return this.http.post(this.servicesUrl + '/businessCards/list', {}).pipe(
      map((response: any) => {
        const body = response
        if (response.errorCode !== '0') {
          const exception: Exception = new Exception(
            body.errorCode,
            body.errorDescription,
          )
          return exception
        } else {
          const output = body
          return output
        }
      }),
      catchError(this.handleError),
    )
  }

  errorLanguage(error) {
    if (error) {
      if (
        this.translate.currentLang === 'ar' &&
        error.errorResponse &&
        error.errorResponse.arabicMessage
      ) {
        return error.errorResponse.arabicMessage
      }
      return error.errorDescription
    }
  }
  setAccountNumber(account: number) {
    this.accountNumber = account
  }
  getAccountNumber(): number {
    return this.accountNumber
  }
  setBusinessCardsList(businessCardsList: BusinessCardsListItems[]) {
    this.businessCardsList = businessCardsList
  }
  getBusinessCardsList(): BusinessCardsListItems[] {
    return this.businessCardsList
  }

  setBusinessCardsItem(businessCardItemSelected: BusinessCardsListItems) {
    this.businessCardsItem = businessCardItemSelected
  }
  getBusinessCardsItem(): BusinessCardsListItems {
    return this.businessCardsItem
  }
  setBusinessCardsDetailsAndList(businessDetailAndList: BusinessDetailAndList) {
    this.businessDetailAndList = businessDetailAndList
  }
  getBusinessCardsDetailsAndList(): BusinessDetailAndList {
    return this.businessDetailAndList
  }
}
