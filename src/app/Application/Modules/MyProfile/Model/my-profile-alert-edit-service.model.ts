export class ModelServiceAlertEdit {
  accountNumber: string
  language: string
  mobile: string
  notificationAmountType: string
  notificationsNumber: number
  subscriptionDate: string
  subscriptionType: string
  arabicDescription: string
  defaultValue: number
  englishDescription: string
  maxValidationAmount: number
  minValidationAmount: number
  notificationAmount: number
  notificationFlag: number
  notificationType: string

  constructor(
    _accountNumber: string,
    _language: string,
    _mobile: string,
    _notificationAmountType: string,
    _notificationsNumber: number,
    _subscriptionDate: string,
    _subscriptionType: string,
    _arabicDescription: string,
    _defaultValue: number,
    _englishDescription: string,
    _maxValidationAmount: number,
    _minValidationAmount: number,
    _notificationAmount: number,
    _notificationFlag: number,
    _notificationType: string,
  ) {
    this.accountNumber = _accountNumber
    this.language = _language
    this.mobile = _mobile
    this.notificationAmountType = _notificationAmountType
    this.notificationsNumber = _notificationsNumber
    this.subscriptionDate = _subscriptionDate
    this.subscriptionType = _subscriptionType
    this.arabicDescription = _arabicDescription
    this.defaultValue = _defaultValue
    this.englishDescription = _englishDescription
    this.maxValidationAmount = _maxValidationAmount
    this.minValidationAmount = _minValidationAmount
    this.notificationAmount = _notificationAmount
    this.notificationFlag = _notificationFlag
    this.notificationType = _notificationType
  }
}
