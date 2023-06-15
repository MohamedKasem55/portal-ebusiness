import { of } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ConfigResourceService } from 'app/core/config/config.resource.local'

@Injectable()
export class LockboxUsersBulkShiftingService {
  constructor(public config: ConfigResourceService, public http: HttpClient) {}

  getTerminalList() {
    return this.http.get<any>(
      this.config.getServicesUrl() + '/lockbox/userManagement/bulkShift/init',
    )
  }

  getChangeTerminal(terminalId: string) {
    const body = { terminalId }
    const bodyJSON = JSON.stringify(body)

    return this.http.post<any>(
      this.config.getServicesUrl() +
        '/lockbox/userManagement/bulkShift/terminalUsers',
      bodyJSON,
    )
  }

  getInitiatorValidate(
    requestManagementLockboxUserBulkShift: any,
    sourceTerminalId: string,
    targetTerminalId: string,
  ) {
    const body = {
      lbUserTerminalUserList: requestManagementLockboxUserBulkShift,
      sourceTerminalId,
      targetTerminalId,
    }
    const bodyJSON = JSON.stringify(body)

    return of({
      errorCode: '0',
      user: body,
    })
  }

  getInitiatorConfirm(
    requestManagementLockboxUserBulkShift: any,
    sourceTerminalId: string,
    targetTerminalId: string,
  ) {
    const body = {
      usersToShift: requestManagementLockboxUserBulkShift,
      originTerminalId: sourceTerminalId,
      destinationTerminalId: targetTerminalId,
    }
    const bodyJSON = JSON.stringify(body)

    // return of();
    return this.http.post<any>(
      this.config.getServicesUrl() +
        '/lockbox/userManagement/bulkShift/confirm',
      bodyJSON,
    )
  }
}
