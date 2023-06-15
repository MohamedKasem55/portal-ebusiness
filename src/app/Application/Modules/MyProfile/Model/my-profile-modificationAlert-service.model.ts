import { ModelServiceAlertNotification } from './my-profile-alert-notification-service.model'

export class ModelServiceModifyAlert {
  notificationAccount: string
  language: string
  mobile: string
  notifications: Array<ModelServiceAlertNotification>
  originalNotifications: Array<ModelServiceAlertNotification>

  constructor(_notificationAccount: string, _language: string) {
    this.notificationAccount = _notificationAccount
    this.language = _language == 'E' ? '2' : _language == 'A' ? '1' : _language
    this.notifications = []
    this.originalNotifications = []
  }
}
