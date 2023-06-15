export class ModelServiceAlertNotification {
  mandateNumber: string
  accountFrom: number
  annout: string
  BeneficiaryName: number
  nickName: number
  PaymentType: number
  currentStatus: boolean
  nextLevel: string

  constructor(
    _mandateNumber: string,
    _accountFrom: number,
    _annout: string,
    _BeneficiaryName: number,
    _nickName: number,
    _PaymentType: number,
    _currentStatus: boolean,
    _nextLevel: string,
  ) {
    this.mandateNumber = _mandateNumber
    this.accountFrom = _accountFrom
    this.annout = _annout
    this.BeneficiaryName = _BeneficiaryName
    this.nickName = _nickName
    this.PaymentType = _PaymentType
    this.currentStatus = _currentStatus
    this.nextLevel = _nextLevel
  }
}
