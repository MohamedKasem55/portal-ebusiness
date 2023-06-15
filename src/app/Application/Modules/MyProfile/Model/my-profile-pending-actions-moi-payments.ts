import { ModelServiceAccount } from './my-profile-account-service.model'

export class ModelServiceMoiPayment {
  initiationDate: string
  accountFrom: Map<String, ModelServiceAccount>
  type: string
  proccess: string
  beneficiaryName: string
  amount: string

  constructor(
    _initiationDate: string,
    _accountFrom: Map<String, ModelServiceAccount>,
    _type: string,
    _proccess: string,
    _beneficiaryName: string,
    _amount: string,
  ) {
    this.initiationDate = _initiationDate
    this.accountFrom = _accountFrom
    this.type = _type
    this.proccess = _proccess
    this.beneficiaryName = _beneficiaryName
    this.amount = _amount
  }
}
