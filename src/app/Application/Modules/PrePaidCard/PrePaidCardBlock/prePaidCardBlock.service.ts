import {Injectable} from '@angular/core'
import {HttpClient, HttpResponse} from '@angular/common/http'
import {Observable, throwError as observableThrowError} from 'rxjs'
import {ConfigResourceService} from '../../../../core/config/config.resource.local'
import {Exception} from '../../../Model/exception'
import {DateFormatPipe} from '../../../Components/common/Pipes/date-format-pipe'
import {map} from 'rxjs/internal/operators/map'
import {catchError} from 'rxjs/internal/operators/catchError'
import {RequestValidate} from 'app/Application/Model/requestvalidateType'
import {
  RequestConfirmClosure,
  RequestConfirmReplace,
  RequestConfirmStolen,
  RequestValidateClosure,
  RequestValidateReplace,
  RequestValidateStolen,
  ResponseConfirmClosure,
  ResponseConfirmReplace,
  ResponseConfirmStolen,
  ResponseValidateClosure,
  ResponseValidateReplace,
  ResponseValidateStolen,
} from './prePaidCardBlock.models'
import {PrepaidCardItem} from '../PrePaidCardList/prePaidCardListModel'

@Injectable({providedIn:"root"})
export class PrePaidCardBlockService {
  public static STOLEN_OP_TYPE = 'SL'
  public static REPLACE_OP_TYPE = 'SC'
  public static CLOSURE_OP_TYPE = 'CL'
  public servicesUrl: string
  public blockOperationType: string
  public pinIndexCode = 5
  public accountIndex = 17

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

  validateStolenCard(
    prepaidCardItem: PrepaidCardItem,
    blockReason: string,
    operationType: string,
  ): Observable<ResponseValidateStolen> {
    const endPoint = '/prepaidCards/lostStolen/validate'
    const request: RequestValidateStolen = {
      cardNumber: prepaidCardItem.cardNumber,
      cardSeqNumber: prepaidCardItem.cardSeqNumber,
      deactivationReason: blockReason,
      operation: operationType,
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
  confirmStolenCard(
    prepaidCardItem: PrepaidCardItem,
    blockReason: string,
    requestValidate: RequestValidate,
    operationType: string,
  ): Observable<ResponseConfirmStolen> {
    const endPoint = '/prepaidCards/lostStolen/confirm'
    const request: RequestConfirmStolen = {
      cardNumber: prepaidCardItem.cardNumber,
      cardSeqNumber: prepaidCardItem.cardSeqNumber,
      deactivationReason: blockReason,
      // deactivationReason: blockReason.toUpperCase(),
      operation: operationType,
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

  validateClosureCard(
    prepaidCardItem: PrepaidCardItem,
  ): Observable<ResponseValidateClosure> {
    const endPoint = '/prepaidCards/cancelCard/validate'
    const request: RequestValidateClosure = {
      cardNumber: prepaidCardItem.cardNumber,
      cardSeqNumber: prepaidCardItem.cardSeqNumber,
      operation: PrePaidCardBlockService.CLOSURE_OP_TYPE,
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
  confirmClosureCard(
    prepaidCardItem: PrepaidCardItem,
    requestValidate: RequestValidate,
  ): Observable<ResponseConfirmClosure> {
    const endPoint = '/prepaidCards/cancelCard/confirm'
    const request: RequestConfirmClosure = {
      cardNumber: prepaidCardItem.cardNumber,
      cardSeqNumber: prepaidCardItem.cardSeqNumber,
      operation: PrePaidCardBlockService.CLOSURE_OP_TYPE,
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

  validateReplaceCard(
    prepaidCardItem: PrepaidCardItem,
    blockReason: string,
    account: string,
  ): Observable<ResponseValidateReplace> {
    const endPoint = '/prepaidCards/replace/validate'
    const request: RequestValidateReplace = {
      cardNumber: prepaidCardItem.cardNumber,
      cardSeqNumber: prepaidCardItem.cardSeqNumber,
      typeOperation: PrePaidCardBlockService.REPLACE_OP_TYPE,
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
  confirmReplaceCard(
    prepaidCardItem: PrepaidCardItem,
    requestValidate: RequestValidate,
  ): Observable<ResponseConfirmReplace> {
    const endPoint = '/prepaidCards/replace/confirm'
    const request: RequestConfirmReplace = {
      cardNumber: prepaidCardItem.cardNumber,
      cardSeqNumber: prepaidCardItem.cardSeqNumber,
      typeOperation: PrePaidCardBlockService.REPLACE_OP_TYPE,
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
  setBlockOperationType(type: string) {
    this.blockOperationType = type
  }

  getBlockOperationType() {
    return this.blockOperationType
  }
}
