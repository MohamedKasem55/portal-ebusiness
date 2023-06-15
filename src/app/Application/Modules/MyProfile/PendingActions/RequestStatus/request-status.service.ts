import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { AuthenticationService } from '../../../../../core/security/authentication.service'
import { DashboardService } from '../../../../Components/dashboard-layout/dashboard-service'

@Injectable()
export class RequestStatusService {
  private servicesUrl: string

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    public authenticationService: AuthenticationService,
    public translate: TranslateService,
    protected dashboardService: DashboardService,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  public getRequestStatusPendingActionsTable(): Observable<any> {
    return this.dashboardService.getPendingActions()
  }

  checkIsCounter(counter) {
    return typeof counter !== 'undefined'
  }
}
