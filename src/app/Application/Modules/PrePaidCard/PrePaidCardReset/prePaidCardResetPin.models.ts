import { ErrorGenerate } from 'app/Application/Model/errorGenerate'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

// tslint:disable-next-line: max-classes-per-file
export class RequestValidateReset {
  cardSeqNumber: string
  newPinNumber: string
  oldPinNumber?: string
  typeOperation: string
}
// tslint:disable-next-line: max-classes-per-file
export class ResponseValidateReset extends ErrorGenerate {
  cardSeqNumber: string
  newPinNumber: string
  oldPinNumber?: string
  typeOperation: string
}
// tslint:disable-next-line: max-classes-per-file
export class RequestConfirmReset {
  cardNumber: string
  cardSeqNumber: string
  newPinNumber: string
  oldPinNumber?: string
  requestValidate: RequestValidate
  typeOperation: string
}
// tslint:disable-next-line: max-classes-per-file
export class ResponseConfirmReset extends ErrorGenerate {}
