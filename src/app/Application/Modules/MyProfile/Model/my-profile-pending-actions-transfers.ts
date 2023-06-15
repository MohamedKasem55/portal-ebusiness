import { ModelServiceAccount } from './my-profile-account-service.model'

export class ModelServiceTransfers {
  initiationDate: string
  accountFrom: Map<String, ModelServiceAccount>
  beneficiaryName: string
  accountTo: string
  amount: number

  constructor(
    _initiationDate: string,
    _accountFrom: Map<String, ModelServiceAccount>,
    _beneficiaryName: string,
    _accountTo: string,
    _amount: number,
  ) {
    this.initiationDate = _initiationDate
    this.accountFrom = _accountFrom
    this.beneficiaryName = _beneficiaryName
    this.accountTo = _accountTo
    this.amount = _amount
  }
}
