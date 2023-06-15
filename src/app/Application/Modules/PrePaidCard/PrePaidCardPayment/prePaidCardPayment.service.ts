import { Injectable } from '@angular/core'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from '../../../Model/exception'
import { DateFormatPipe } from '../../../Components/common/Pipes/date-format-pipe'
import { catchError } from 'rxjs/internal/operators/catchError'
import { FormGroup } from '@angular/forms'
import {
  ResponseValidatePaymentRefund,
  RequestConfirmPaymentRefund,
  ResponseConfirmPaymentRefund,
  ResponseValidatePaymentLoad,
  RequestConfirmPaymentLoad,
  ResponseConfirmPaymentLoad,
  RequestValidatePayment,
} from './prePaidCardPayment.models'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { BatchListsContainer } from '../prePaidCardModels'
import { PrepaidCardItem } from '../PrePaidCardList/prePaidCardListModel'
import { map } from 'rxjs/operators'

@Injectable()
export class PrePaidCardPaymentService {
  public static REFUND_FUNDS_TYPE = 'PR'
  public static LOAD_FUNDS_TYPE = 'LD'
  public servicesUrl: string
  public paymentOperationType: string

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
    console.error(errMsg)
    const errorService: Exception = new Exception('handle', errMsg)
    return Observable.throw(errorService)
  }

  validatePaymentRefund(
    dataForm: FormGroup,
    prepaidCardItem: PrepaidCardItem,
    prepaidCardDetails: any,
    operationType,
  ): Observable<ResponseValidatePaymentRefund> {
    const request: RequestValidatePayment = {
      cardAccountNumber: prepaidCardItem.cardAccount,
      cardAccountSeqNumber:
        prepaidCardDetails?.accountsItemList[0]?.cardAccountSeqNumber,
      accountNumber: dataForm.controls.accountFrom.value,
      cardSeqNumber: prepaidCardItem.cardSeqNumber,
      cardNumber: prepaidCardItem.cardNumber,
      amount: dataForm.get('amount').value,
      equivalentAmount: 0,
      feesAmount: 0,
      typeOperation: operationType,
    }

    const endPoint = '/prepaidCards/refundFunds/validate'

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

  confirmPaymentRefund(
    requestValidate: RequestValidate,
    batchListsContainer: BatchListsContainer,
  ): Observable<ResponseConfirmPaymentRefund> {
    const request: RequestConfirmPaymentRefund = {
      requestValidate,
      prepaidCardsBatchList: batchListsContainer,
    }
    const endPoint = '/prepaidCards/refundFunds/confirm'

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

  validatePaymentLoad(
    dataForm: FormGroup,
    prepaidCardItem: PrepaidCardItem,
    prepaidCardDetails: any,
    operationType,
  ): Observable<ResponseValidatePaymentLoad> {
    const request: RequestValidatePayment = {
      accountNumber: dataForm.controls.accountFrom.value,
      amount: dataForm.controls.amount.value,
      cardAccountNumber: prepaidCardItem.cardAccount,
      cardAccountSeqNumber:
        prepaidCardDetails?.accountsItemList[0]?.cardAccountSeqNumber,
      cardNumber: prepaidCardItem.cardNumber,
      cardSeqNumber: prepaidCardItem.cardSeqNumber,
      equivalentAmount: 0,
      feesAmount: 0,
      typeOperation: operationType,
    }
    const endPoint = '/prepaidCards/loadFunds/validate'

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

  confirmPaymentLoad(
    requestValidate: RequestValidate,
    batchListsContainer: BatchListsContainer,
  ): Observable<ResponseConfirmPaymentLoad> {
    const request: RequestConfirmPaymentLoad = {
      prepaidCardsBatchList: batchListsContainer,
      requestValidate,
    }
    const endPoint = '/prepaidCards/loadFunds/confirm'

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

  // setPaymentTypeFunds(type: string) {
  //     this.paymentOperationType = type;
  // }

  // getPaymentTypeFunds() {
  //     return this.paymentOperationType;
  // }
}
