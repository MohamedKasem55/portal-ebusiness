import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

import { Observable } from 'rxjs'
import { ConfigResourceService } from '../../../../../../core/config/config.resource.local'
import { AbstractService } from '../../../../Common/Services/Abstract/abstract.service'

@Injectable()
export class CloseOLPNotificationsService extends AbstractService {
  constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
  ) {
    super(http, config)
  }

  public close(values: any): Observable<any> {
    const notifications = []

    for (let i = 0; i < values.length; i++) {
      const data = {
        customerId: values[i].customerId,
        customerType: values[i].customerType,
        notificationDate: values[i].notificationDate,
        notificationMsg: values[i].notificationMsg,
        notificationType: values[i].notificationType,
        ntfId: values[i].ntfId,
        refId: values[i].refId,
        refIdType: values[i].refIdType,
        taskId: values[i].taskId,
      }

      notifications.push(data)
    }

    const data = {
      selectedNotificationList: notifications,
    }

    const params = JSON.stringify(data)

    return this.http.post(
      this.servicesUrl + '/sadadolp/notifications/close',
      params,
    )
  }
}
