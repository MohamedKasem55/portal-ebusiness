import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { DateFormatPipe } from '../../../Components/common/Pipes/date-format-pipe'
import { Exception } from '../../../Model/exception'
import {
  AccountItem,
  BatchListsContainer,
  BusinessCardsDetails,
  BusinessCardSelected,
  BusinessCardsListItems,
  BusinessDetailAndList,
  RequestValidate,
} from '../commercial-cards-models'
import {
  RequestConfirmPayment,
  RequestValidatePayment,
  ResponseConfirmPayment,
  ResponseValidatePayment,
} from './cardPayment.models'

@Injectable()
export class CardPaymentService {
  public static MIN_PAYMENT_AMOUNT = 0.01
  public static MAX_PAYMENT_AMOUNT = 999000000
  servicesUrl: string

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    private dateFormatPipe: DateFormatPipe,
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
    const errorService: Exception = new Exception('handle', errMsg)
    return Observable.throw(errorService)
  }

  public payValueTransform(value: number): number {
    let changedValue: number
    if (Math.sign(value) === -1) {
      changedValue = value * -1
    } else {
      changedValue = value
    }
    return changedValue
  }

  validatePayment(
    dataForm: FormGroup,
    businessDetailAndList: BusinessDetailAndList,
  ): Observable<ResponseValidatePayment> {
    const businessCardsDetailsList: BusinessCardsListItems =
      businessDetailAndList.list
    const businessCardsDetails: BusinessCardsDetails =
      businessDetailAndList.details.businessCardsDetails
    const request: RequestValidatePayment = {
      businessCardSelected: [],
      cardId: 'string',
    }
    const BusinessCardSelectedList: BusinessCardSelected[] = []
    const endPoint = '/businessCards/cardPayment/validate'

    const accountItemSelected: AccountItem =
      businessCardsDetails.accountsItemList[0]
    const businessCardSelected: BusinessCardSelected =
      new BusinessCardSelected()
    businessCardSelected.accountItem = {
      authStatus: 'string',
      availableBalance: businessCardsDetails.availableBal,
      availableCash: businessCardsDetailsList.availableCash,
      cardAccountNumber: businessCardsDetailsList.cardNumber,
      cardAccountSeqNumber: accountItemSelected.cardAccountSeqNumber,
      currency: 'SAR',
      limit: businessCardsDetailsList.crLimit,
    }

    businessCardSelected.accountNumber = dataForm.controls.accountFrom.value
    businessCardSelected.paymentOption = dataForm.controls.paymentType.value
    if (dataForm.controls.amount.value) {
      businessCardSelected.amount = dataForm.controls.amount.value
    } else {
      if (dataForm.controls.paymentType.value === 0) {
        businessCardSelected.amount = this.payValueTransform(
          businessCardsDetails.playableAmt,
        )
      } else {
        businessCardSelected.amount = this.payValueTransform(
          businessCardsDetails.totalAmt,
        )
      }
    }
    BusinessCardSelectedList.push(businessCardSelected)
    request.businessCardSelected = BusinessCardSelectedList
    request.cardId = businessCardsDetailsList.cardSeqNumber

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

  confirmPayment(
    requestValidate: RequestValidate,
    batchListsContainer: BatchListsContainer,
  ): Observable<ResponseConfirmPayment> {
    const request: RequestConfirmPayment = {
      requestValidate,
      batchListsContainer,
    }
    const endPoint = '/businessCards/cardPayment/confirm'

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
}
