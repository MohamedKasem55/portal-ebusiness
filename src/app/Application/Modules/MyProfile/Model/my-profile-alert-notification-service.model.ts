export class ModelServiceAlertNotification {
  arabicDescription: string
  defaultValue: number
  englishDescription: string
  maxValidationAmount: number
  minValidationAmount: number
  notificationAmount: number
  notificationFlag: boolean
  notificationType: string

  constructor(
    _arabicDescription: string,
    _defaultValue: number,
    _englishDescription: string,
    _maxValidationAmount: number,
    _minValidationAmount: number,
    _notificationAmount: number,
    _notificationFlag: boolean,
    _notificationType: string,
  ) {
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
