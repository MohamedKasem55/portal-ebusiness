import {
  DataList,
  AccountDigits,
  ListWithSelect,
  TargetsData,
  BusinessCardsDetails,
  RequestType,
  BusinessCardSelected,
} from './prePaidCardModels'
import { Injectable } from '@angular/core'
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { ConfigResourceService } from '../../../core/config/config.resource.local'
import { CryptoService } from '../../../core/crypto/crypto.service'
import { TranslateService } from '@ngx-translate/core'
import { catchError } from 'rxjs/internal/operators/catchError'
import { Exception } from '../../Model/exception'
import { FormGroup } from '@angular/forms'
import { throwError as observableThrowError } from 'rxjs'
import { BehaviorSubject, observable, ReplaySubject } from 'rxjs'
import { PrepaidCardItem } from './PrePaidCardList/prePaidCardListModel'
import {
  PrepaidCardDetails,
  PrepaidCardStatementsResponse,
} from './PrePaidCardViewQuery/prePaidCardDetailModel'
import { map } from 'rxjs/operators'
@Injectable({providedIn: 'root'})
export class PrePaidCardService {
  public digits: AccountDigits = {
    digit1: 0,
    digit2: 0,
    digit3: 0,
    digit4: 0,
    digit5: 0,
    digit13: 0,
    digit14: 0,
    digit15: 0,
    digit16: 0,
  }
  public servicesUrl: string
  public pinIndexCode = 5
  public accountIndexMax = 13
  public accountIndexMin = 6
  public accountNumber = 0
  public targetsSubject = new BehaviorSubject(new ListWithSelect())
  public targetData: TargetsData
  public targetDataList: TargetsData[]
  private prepaidCardList: PrepaidCardItem[]
  private prepaidCardSelected: PrepaidCardItem
  private detailStatements: PrepaidCardStatementsResponse
  public paymentOperationType: string
  private prepaidCardDetail: PrepaidCardDetails

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
      errMsg = `${error.status} - ${error.statusText || ''}${err}`
    } else {
      errMsg = error.message ? error.message : error.toString()
    }

    const errorService: Exception = new Exception('handle', errMsg)
    return observableThrowError(errorService)
  }

  getDigits() {
    // console.log('digits', this.digits);
    return this.digits
  }

  setDigits(account: string) {
    this.digits.digit1 = +account.substr(0, 1)
    this.digits.digit2 = +account.substr(1, 1)
    this.digits.digit3 = +account.substr(2, 1)
    this.digits.digit4 = +account.substr(3, 1)
    this.digits.digit5 = +account.substr(4, 1)
    this.digits.digit13 = +account.substr(12, 1)
    this.digits.digit14 = +account.substr(13, 1)
    this.digits.digit15 = +account.substr(14, 1)
    this.digits.digit16 = +account.substr(15, 1)
  }

  getAccountNumber(): number {
    return this.accountNumber
  }
  setAccountNumber(account: number) {
    this.accountNumber = account
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

  public validateNumberCard(form: FormGroup): Observable<any> {
    const accountvisible = this.getDigits()
    const accountSix = this.obtainCodePinAccount(
      form,
      this.accountIndexMax,
      'digit',
      this.accountIndexMin,
    )
    const accountComplete = this.buildCreditCardNumber(
      accountvisible,
      accountSix,
    )
    const data: DataList = {
      creditCardNumber: accountComplete,
      accountSix: accountSix,
    }

    let result: any = {}

    return this.http
      .post(this.servicesUrl + '/businessCards/validateNumberCard', data)
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            console.log('Error')
            result.error = true
            result.errorCode = response.errorCode
            result.errorDescription = response.errorDescription
          } else {
            console.log('Ok')
            result = response
          }
          return result
        }),
        catchError(this.handleError),
      )
  }

  public registerPin(form: FormGroup, endPoint) {
    //  :Observable<CardCredit> {
    console.log('registerPin')
    const pinNumber = this.obtainCodePinAccount(
      form,
      this.pinIndexCode,
      'repeatNewPin',
    )
    const data: DataList = {
      creditCardNumber: '',
      accountSix: '',
      pinNumber: pinNumber,
    }
    let result: any = {}
    console.log('data', data)
    // return this.http.post(this.servicesUrl + '/businessCards/activation/validate', data).pipe(map((response: any) => {
    return this.http.post(this.servicesUrl + endPoint, data).pipe(
      map((response: any) => {
        const body = response
        console.log('response', response)
        if (response.errorCode !== '0') {
          result.error = true
          result.errorCode = response.errorCode
          result.errorDescription = response.errorDescription
        } else {
          result = response
        }
        return result
      }),
      catchError(this.handleError),
    )
  }

  obtainCodePinAccount(
    form: any,
    index: number,
    field: string,
    indexMin?: number,
  ): string {
    let dataCode = ''
    let init = 0
    if (indexMin) {
      init = 6
    } else {
      init = 1
    }
    for (let i = init; i < index; i++) {
      if (form['controls'][field]['controls'][field + i].value) {
        dataCode =
          dataCode + form['controls'][field]['controls'][field + i].value
      }
    }
    console.log('datacode', dataCode)
    return dataCode
  }

  public buildCreditCardNumber(
    number: AccountDigits,
    accountSix: string,
  ): string {
    let creditCardNumber: string
    creditCardNumber =
      number.digit1.toString() +
      number.digit2.toString() +
      number.digit3.toString() +
      number.digit4.toString() +
      number.digit5.toString()
    creditCardNumber = creditCardNumber + +accountSix
    creditCardNumber =
      creditCardNumber +
      number.digit13.toString() +
      number.digit14.toString() +
      number.digit15.toString() +
      number.digit16.toString()
    return creditCardNumber
  }

  public setPrepaidCardList(prepaidCardList: PrepaidCardItem[]) {
    this.prepaidCardList = prepaidCardList
  }

  public getPrepaidCardList() {
    return this.prepaidCardList
  }
  public setDetailStatements(statements: PrepaidCardStatementsResponse) {
    this.detailStatements = statements
  }

  public getDetailStatements(): PrepaidCardStatementsResponse {
    return this.detailStatements
  }

  public resetDetailStatements() {
    this.detailStatements = null
  }

  public setPrepaidCardSelected(prepaidCardSelected: PrepaidCardItem) {
    this.prepaidCardSelected = prepaidCardSelected
  }

  public getPrepaidCardSelected() {
    return this.prepaidCardSelected
  }

  public setPrepaidCardDetail(detail: PrepaidCardDetails) {
    this.prepaidCardDetail = detail
  }

  public getPreaidCardDetail() {
    return this.prepaidCardDetail
  }

  setPaymentTypeFunds(type: string) {
    this.paymentOperationType = type
  }

  getPaymentTypeFunds() {
    return this.paymentOperationType
  }
}
