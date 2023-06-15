import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { AuthenticationService } from '../../../../core/security/authentication.service'

@Injectable()
export class MonthlyStatisticsService {
  servicesUrl: string

  constructor(
    private _http: HttpClient,
    public config: ConfigResourceService,
    public authenticationService: AuthenticationService,
    public translate: TranslateService,
    public router: Router,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }
}
