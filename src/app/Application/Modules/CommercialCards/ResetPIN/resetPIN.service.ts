import { Injectable } from '@angular/core'
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from '../../../Model/exception'
import { DateFormatPipe } from '../../../Components/common/Pipes/date-format-pipe'
import { catchError } from 'rxjs/internal/operators/catchError'
import {
  BusinessCardsDetails,
  BusinessCardsListItems,
  RequestValidate,
} from '../commercial-cards-models'
import {
  RequestConfirmReset,
  RequestValidateReset,
  ResponseConfirmReset,
  ResponseValidateReset,
} from './resetPIN.models'
import { FormGroup } from '@angular/forms'
import { CryptoService } from 'app/core/crypto/crypto.service'
import { map } from 'rxjs/operators'

@Injectable()
export class ResetPINService {
  public static SET_OP_TYPE = '3'
  public static RESET_OP_TYPE = '1'
  public resetOperationType: string
  public servicesUrl: string
  public pinIndexCode = 5
  public accountIndex = 17
  public numberPinValues = 6

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    private dateFormatPipe: DateFormatPipe,
    private cryptoService: CryptoService,
  ) {
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

  public validateResetCard(): Observable<ResponseValidateReset> {
    return this.http.get(this.servicesUrl + '/businessCards/pin/validate').pipe(
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

  confirmResetCard(
    form: FormGroup,
    businessCardsList: BusinessCardsListItems,
    operationType: number,
    requestVal: RequestValidate,
  ): Observable<ResponseConfirmReset> {
    const pinCode = this.getPinCode(form, this.pinIndexCode, 'newPin')
    // const oldPinCode = "1231";
    const request: RequestConfirmReset = {
      cardSeqNumber: businessCardsList.cardSeqNumber,
      newPinNumber: this.cryptoService.encryptRSA(pinCode),
      // oldPinNumber: this.cryptoService.encryptRSA(oldPinCode),
      requestValidate: requestVal,
      typeOperation: operationType,
      cardNumber: businessCardsList.cardNumber,
    }
    return this.http
      .post(this.servicesUrl + '/businessCards/pin/confirm', request)
      .pipe(
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

  setResetOperationType(type: string) {
    this.resetOperationType = type
  }

  getResetOperationType() {
    return this.resetOperationType
  }

  getPinCode(
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
