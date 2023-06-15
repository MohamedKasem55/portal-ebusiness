import { BusinessCardsDetails } from '../commercial-cards-models'
import { ErrorGenerate } from 'app/Application/Model/errorGenerate'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
// tslint:disable-next-line: max-classes-per-file
export class RequestValidateBlock {
  businessCardsDetails?: BusinessCardsDetails
  blockReason?: string
  typeOperation?: string
}
// tslint:disable-next-line: max-classes-per-file
export interface ResponseValidateBlock extends ErrorGenerate {
  businessCardsDetails: BusinessCardsDetails
}
// tslint:disable-next-line: max-classes-per-file
export class RequestConfirmBlock {
  businessCardsDetails?: BusinessCardsDetails
  requestValidate: RequestValidate
  typeOperation?: string
}
// tslint:disable-next-line: max-classes-per-file
export interface ResponseConfirmBlock extends ErrorGenerate {
  responseError?: string
}
