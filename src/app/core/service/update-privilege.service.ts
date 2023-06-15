import { Injectable } from '@angular/core'
import { AuthenticationService } from '../security/authentication.service'
import { map } from 'rxjs/operators'
import { LogService } from '../log/log.service'
import { HttpClient } from '@angular/common/http'
import { ConfigResourceService } from '../config/config.resource.local'
@Injectable({
  providedIn: 'root',
})
export class UpdatePrivilegeService {
  servicesUrl: string
  constructor(
    private logService: LogService,
    private authenticationService: AuthenticationService,
    private http: HttpClient,
    public config: ConfigResourceService,
  ) {}

  getUpdatedPriv(): any {
    this.servicesUrl = this.config.getServicesUrl()
    this.http
      .put(this.servicesUrl.concat('/userManagement/refreshPrivileges'), {})
      .pipe(
        map((response: any) => {
          let result
          let json = response
          if (json) {
            result = response
          } else {
            result = {
              error: true,
              errorCode: json.errorCode,
              errorDescription: this.authenticationService.errorLanguage(json),
            }
            this.logService.log.error(json.errorCode)
          }
          return result
        }),
      )
      .subscribe((data: any) => {
        this.authenticationService.changeToNewPriv(data)
      })
  }
}
