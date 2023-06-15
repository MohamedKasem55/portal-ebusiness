import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError } from 'rxjs/internal/operators/catchError'
import { map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { DateFormatPipe } from '../../../Components/common/Pipes/date-format-pipe'
import { Exception } from '../../../Model/exception'
import { BusinessCardsDetails } from '../commercial-cards-models'
import {
  RequestConfirmBlock,
  RequestValidateBlock,
  ResponseConfirmBlock,
  ResponseValidateBlock,
} from './blockCards.models'
@Injectable()
export class BlockCardsService {
  public static BLOCK_OP_TYPE = 'BL'
  public static BLOCK_REPL_OP_TYPE = 'SC'
  public static UNBLOCK_OP_TYPE = 'UB'
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

  validateBlockCard(
    cardDetails: BusinessCardsDetails,
    blockReason: string,
    operationType: string,
  ): Observable<ResponseValidateBlock> {
    const request: RequestValidateBlock = {
      businessCardsDetails: cardDetails,
      blockReason,
      typeOperation: operationType,
    }
    console.log('Request-Validate', request)
    return this.http
      .post(this.servicesUrl + '/businessCards/blockCard/validate', request)
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
  confirmBlockCard(
    cardDetails: BusinessCardsDetails,
    requestVal: RequestValidate,
    operationType: string,
  ): Observable<ResponseConfirmBlock> {
    console.log('requestValidate', requestVal)
    console.log('operationType', operationType)
    console.log('cardDetails', cardDetails)

    const request: RequestConfirmBlock = {
      businessCardsDetails: cardDetails,
      requestValidate: requestVal,
      typeOperation: operationType,
    }
    return this.http
      .post(this.servicesUrl + '/businessCards/blockCard/confirm', request)
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

  setBlockOperationType(type: string) {
    this.blockOperationType = type
  }

  getBlockOperationType() {
    return this.blockOperationType
  }
}
