import { ErrorGenerate } from '../../../Model/errorGenerate'
import {
  BusinessCardSelected,
  BatchListsContainer,
  RequestValidate,
} from '../commercial-cards-models'
import { Account } from 'app/Application/Model/account'

// tslint:disable-next-line: max-classes-per-file
export class RequestValidatePayment {
  businessCardSelected: BusinessCardSelected[]
  cardId: string
}
// tslint:disable-next-line: max-classes-per-file
export class RequestConfirmPayment {
  batchListsContainer: BatchListsContainer
  requestValidate: RequestValidate
}
// tslint:disable-next-line: max-classes-per-file
export interface ResponseValidatePayment extends ErrorGenerate {
  batchListsContainer: any
}

// tslint:disable-next-line: max-classes-per-file
export class ResponseConfirmPayment extends ErrorGenerate {
  businessCardPaymentResult: any
}
// tslint:disable-next-line: max-classes-per-file
export class Combo {
  key: number
  value: Account
}
