import { ModelServiceAlertNotification } from './my-profile-alert-notification-service.model'

export class ModelServiceAlert {
  accountNumber: string
  language: string
  mobile: string
  notificationAmountType: string
  notificationsList: Array<ModelServiceAlertNotification>
  notificationsNumber: number
  subscriptionDate: string
  subscriptionType: string

  constructor(
    _accountNumber: string,
    _language: string,
    _mobile: string,
    _notificationAmountType: string,
    _notificationsList: Array<ModelServiceAlertNotification>,
    _notificationsNumber: number,
    _subscriptionDate: string,
    _subscriptionType: string,
  ) {
    this.accountNumber = _accountNumber
    this.language = _language
    this.mobile = _mobile
    this.notificationAmountType = _notificationAmountType
    this.notificationsList = _notificationsList
    this.notificationsNumber = _notificationsNumber
    this.subscriptionDate = _subscriptionDate
    this.subscriptionType = _subscriptionType
  }
}
