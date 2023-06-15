import { Injectable } from '@angular/core'
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { catchError } from 'rxjs/internal/operators/catchError'
import { Exception } from '../../../Model/exception'
import {
  BusinessCardsDetails,
  RequestValidate,
  BusinessCardsListItems,
  BusinessDetailAndList,
} from '../commercial-cards-models'
import { FormGroup } from '@angular/forms'
import {
  RequestConfirmActivate,
  RequestValidateActivate,
  ResponseConfirmActivate,
  ResponseValidateActivate,
} from './activateCards.models'
import { AccountDigits } from './activateCards.models'
import { map } from 'rxjs/operators'

@Injectable()
export class ActivateCardsService {
  digits: AccountDigits = {
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
  servicesUrl: string
  pinIndexCode = 5
  accountIndex = 17
  constructor(private http: HttpClient, public config: ConfigResourceService) {
    this.servicesUrl = config.getServicesUrl()
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
    return Observable.throw(errorService)
  }

  validateActivate(
    businessDetailAndList: BusinessDetailAndList,
  ): Observable<ResponseValidateActivate> {
    const businessCardsDetailsList: BusinessCardsListItems =
      businessDetailAndList.list
    const businessCardsDetails: BusinessCardsDetails =
      businessDetailAndList.details.businessCardsDetails
    const endPoint = '/businessCards/activation/validate'
    const request: RequestValidateActivate = {
      cardNumber: businessCardsDetailsList.cardNumber,
      cardSeqNumber: businessCardsDetailsList.cardSeqNumber,
    }

    return this.http.post(this.servicesUrl + endPoint, request).pipe(
      map((response: any) => {
        if (response.errorCode !== '0') {
          const exception: Exception = new Exception(
            response.errorCode,
            response.errorDescription,
          )
          return observableThrowError(exception)
        } else {
          return response
        }
      }),
      catchError(this.handleError),
    )
  }

  confirmActivate(
    businessDetailAndList: BusinessDetailAndList,
    requestValidate: RequestValidate,
  ): Observable<ResponseConfirmActivate> {
    const businessCardsDetailsList: BusinessCardsListItems =
      businessDetailAndList.list
    const businessCardsDetails: BusinessCardsDetails =
      businessDetailAndList.details.businessCardsDetails
    const endPoint = '/businessCards/activation/confirm'
    const request: RequestConfirmActivate = {
      cardNumber: businessCardsDetailsList.cardNumber,
      cardSeqNumber: businessCardsDetailsList.cardSeqNumber,
      requestValidate: requestValidate,
    }
    return this.http.post(this.servicesUrl + endPoint, request).pipe(
      map((response: any) => {
        if (response.errorCode !== '0') {
          const exception: Exception = new Exception(
            response.errorCode,
            response.errorDescription,
          )
          return observableThrowError(exception)
        } else {
          return response
        }
      }),
      catchError(this.handleError),
    )
  }

  public buildCreditCardNumber(
    accountDigit: AccountDigits,
    accountSix: string,
  ): string {
    let creditCardNumber: string
    creditCardNumber =
      accountDigit.digit1.toString() +
      accountDigit.digit2.toString() +
      accountDigit.digit3.toString() +
      accountDigit.digit4.toString() +
      accountDigit.digit5.toString()
    creditCardNumber = creditCardNumber + +accountSix
    creditCardNumber =
      creditCardNumber +
      accountDigit.digit13.toString() +
      accountDigit.digit14.toString() +
      accountDigit.digit15.toString() +
      accountDigit.digit16.toString()
    return creditCardNumber
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

  getDigits() {
    return this.digits
  }

  // activate cards functionality temporarily disabled
  // public validateNumberCard(form: FormGroup): Observable<any> {
  //     const accountvisible = this.getDigits();
  //     const accountSix = this.obtainCodePinAccount(form, this.accountIndexMax, 'digit', this.accountIndexMin);
  //     const accountComplete = this.buildCreditCardNumber(accountvisible, accountSix);
  //     const data: DataList = {
  //         "creditCardNumber": accountComplete,
  //         "accountSix": accountSix
  //     }
  //     let result: any = {};

  //     return this.http.post(this.servicesUrl + '/businessCards/validateNumberCard', data).pipe(map((response: any) => {
  //         if (response.errorCode !== "0") {
  //             result.error = true;
  //             result.errorCode = response.errorCode;
  //             result.errorDescription = response.errorDescription;
  //         } else {
  //             result = response;
  //         }
  //         return result;
  //     }), catchError(this.handleError));
  // }

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
    return dataCode
  }
}
