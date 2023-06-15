import { ModelServiceAccount } from './my-profile-account-service.model'
import { ModelServiceAlertNotification } from './my-profile-alert-notification-service.model'

export class ModelServiceCreateAlert {
  accounts: Map<String, ModelServiceAccount>
  notifications: Array<ModelServiceAlertNotification>
  mobile: string

  constructor() {
    this.accounts = new Map<String, ModelServiceAccount>()
    this.notifications = []
  }
}
