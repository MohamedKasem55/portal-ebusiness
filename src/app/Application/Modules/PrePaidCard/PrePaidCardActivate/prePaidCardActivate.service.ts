import { Injectable } from '@angular/core'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { catchError } from 'rxjs/internal/operators/catchError'
import { Exception } from '../../../Model/exception'
import {
  RequestConfirmActivate,
  RequestValidateActivate,
  ResponseConfirmActivate,
  ResponseValidateActivate,
} from './prePaidCardActivate.models'
import { AccountDigits } from './prePaidCardActivate.models'
import { PrepaidCardItem } from '../PrePaidCardList/prePaidCardListModel'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { map } from 'rxjs/operators'
@Injectable()
export class PrePaidCardActivateService {
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
  public accountIndex = 17
  public prepaidCardSelected: PrepaidCardItem
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
    prepaidCardItem: PrepaidCardItem,
  ): Observable<ResponseValidateActivate> {
    const endPoint = '/prepaidCards/activate/validate'
    const request: RequestValidateActivate = {
      cardNumber: prepaidCardItem.cardNumber,
      cardSeqNumber: prepaidCardItem.cardSeqNumber,
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
    prepaidCardItem: PrepaidCardItem,
    requestValidate: RequestValidate,
  ): Observable<ResponseConfirmActivate> {
    const endPoint = '/prepaidCards/activate/confirm'
    const request: RequestConfirmActivate = {
      cardNumber: prepaidCardItem.cardNumber,
      cardSeqNumber: prepaidCardItem.cardSeqNumber,
      requestValidate,
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
}
