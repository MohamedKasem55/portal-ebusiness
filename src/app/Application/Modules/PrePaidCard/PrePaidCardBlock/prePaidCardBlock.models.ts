import { ErrorGenerate } from 'app/Application/Model/errorGenerate'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { BatchListsContainer } from '../prePaidCardModels'
// tslint:disable-next-line: max-classes-per-file
export class RequestValidateStolen {
  cardNumber: string
  cardSeqNumber: string
  deactivationReason: string
  operation: string
}
// tslint:disable-next-line: max-classes-per-file
export interface ResponseValidateStolen extends ErrorGenerate {
  cardNumber: string
  cardSeqNumber: string
  deactivationReason: string
  operation: string
}
// tslint:disable-next-line: max-classes-per-file
export class RequestConfirmStolen {
  cardNumber: string
  cardSeqNumber: string
  deactivationReason: string
  operation: string
  requestValidate: RequestValidate
}
// tslint:disable-next-line: max-classes-per-file
export interface ResponseConfirmStolen extends ErrorGenerate {
  responseError?: string
}
// tslint:disable-next-line: max-classes-per-file
export class RequestValidateReplace {
  cardNumber: string
  cardSeqNumber: string
  typeOperation: string
  accountNumber?: string
}
// tslint:disable-next-line: max-classes-per-file
export interface ResponseValidateReplace extends ErrorGenerate {
  batchListsContainer: BatchListsContainer
}
// tslint:disable-next-line: max-classes-per-file
export class RequestConfirmReplace {
  cardNumber: string
  cardSeqNumber: string
  typeOperation: string
  requestValidate: RequestValidate
}
// tslint:disable-next-line: max-classes-per-file
export interface ResponseConfirmReplace extends ErrorGenerate {
  responseError?: string
}

// tslint:disable-next-line: max-classes-per-file
export class RequestValidateClosure {
  cardNumber: string
  cardSeqNumber: string
  operation: string
}
// tslint:disable-next-line: max-classes-per-file
export interface ResponseValidateClosure extends ErrorGenerate {
  accountDigits: string
  cardId: string
}
// tslint:disable-next-line: max-classes-per-file
export class RequestConfirmClosure extends RequestValidateClosure {
  requestValidate: RequestValidate
}
// tslint:disable-next-line: max-classes-per-file
export interface ResponseConfirmClosure extends ErrorGenerate {
  responseError?: string
}
