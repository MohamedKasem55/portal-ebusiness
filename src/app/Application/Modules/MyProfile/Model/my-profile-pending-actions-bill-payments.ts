import { ModelServiceAccount } from './my-profile-account-service.model'

export class ModelServicebillPayment {
  initiationDate: string
  accountFrom: Map<String, ModelServiceAccount>
  billerName: string
  billReference: string
  nickName: string
  originalAmount: string
  enteedAmount: string

  constructor(
    _initiationDate: string,
    _accountFrom: Map<String, ModelServiceAccount>,
    _billerName: string,
    _billReference: string,
    _nickName: string,
    _originalAmount: string,
    _enteedAmount: string,
  ) {
    this.initiationDate = _initiationDate
    this.accountFrom = _accountFrom
    this.billerName = _billerName
    this.billReference = _billReference
    this.nickName = _nickName
    this.originalAmount = _originalAmount
    this.enteedAmount = _enteedAmount
  }
}
