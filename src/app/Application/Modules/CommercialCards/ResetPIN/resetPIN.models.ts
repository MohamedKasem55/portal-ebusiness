import {
  BusinessCardsDetails,
  RequestValidate,
} from '../commercial-cards-models'
import { ErrorGenerate } from 'app/Application/Model/errorGenerate'

// tslint:disable-next-line: max-classes-per-file
export class RequestValidateReset {
  cardSeqNumber: string
  newPin: string
  oldPin?: string
  typeOperation: string
}
// tslint:disable-next-line: max-classes-per-file
export class ResponseValidateReset extends ErrorGenerate {
  batchListsContainer: any
}
// tslint:disable-next-line: max-classes-per-file
export class RequestConfirmReset {
  cardSeqNumber: string
  newPinNumber: string
  oldPinNumber?: string
  requestValidate: RequestValidate
  typeOperation: number
  cardNumber?: string
}
// tslint:disable-next-line: max-classes-per-file
export class ResponseConfirmReset extends ErrorGenerate {}
