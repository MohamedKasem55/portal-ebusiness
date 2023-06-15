import { ErrorGenerate } from './../../../Model/errorGenerate'
import { BatchListsContainer } from '../prePaidCardModels'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { Account } from 'app/Application/Model/account'

// tslint:disable-next-line: max-classes-per-file
export interface ResponseValidatePaymentRefund extends ErrorGenerate {
  batchListsContainer: BatchListsContainer
}
// tslint:disable-next-line: max-classes-per-file
export class RequestConfirmPaymentRefund {
  prepaidCardsBatchList: BatchListsContainer
  requestValidate: RequestValidate
}

// tslint:disable-next-line: max-classes-per-file
export class ResponseConfirmPaymentRefund extends ErrorGenerate {}
// tslint:disable-next-line: max-classes-per-file
export class Combo {
  key: number
  value: Account
}
// tslint:disable-next-line: max-classes-per-file
export class RequestValidatePayment {
  accountNumber: string
  amount: number
  cardAccountNumber: string
  cardAccountSeqNumber: string
  cardNumber: string
  cardSeqNumber: string
  equivalentAmount: number
  feesAmount: number
  typeOperation: string
}
// tslint:disable-next-line: max-classes-per-file
export interface ResponseValidatePaymentLoad extends ErrorGenerate {
  batchListsContainer: BatchListsContainer
}
// tslint:disable-next-line: max-classes-per-file
export class RequestConfirmPaymentLoad {
  prepaidCardsBatchList: BatchListsContainer
  requestValidate: RequestValidate
}
// tslint:disable-next-line: max-classes-per-file
export class ResponseConfirmPaymentLoad extends ErrorGenerate {
  businessCardPaymentResult: any
}
