export class AlertNotification {
  englishDescription: string
  arabicDescription: string
  defaultValue: number
  maxValidationAmount: number
  minValidationAmount: number
  notificationAmount: number
  notificationFlag: boolean
  notificationType: string
  language: string

  constructor(
    _englishDescription: string,
    _arabicDescription: string,
    _defaultValue: number,
    _maxValidationAmount: number,
    _minValidationAmount: number,
    _notificationType: string,
    _notificationFlag: boolean,
    _notificationAmount: number,
  ) {
    this.notificationAmount = _notificationAmount
    this.notificationFlag = _notificationFlag
    this.notificationType = _notificationType
  }
}
