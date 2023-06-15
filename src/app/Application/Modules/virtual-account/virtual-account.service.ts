import { HttpClient } from '@angular/common/http'
import { AuthenticationService } from '../../../core/security/authentication.service'
import { ConfigResourceService } from '../../../core/config/config.resource.local'
import { Injector } from '@angular/core'

import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

@Injectable()
export class VirtualAccountService {
  private servicesUrl: string
  baseRoute = '/vaext'
  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    public authenticationService: AuthenticationService,
    private injector: Injector,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  getData() {
    return this.http
      .get<Observable<any>>(this.servicesUrl + this.baseRoute)
      .pipe(
        map((res) => res),
        catchError((err, caught) => {
          const result: any = {}
          result.error = true
          result.errorCode = -1
          result.errorDescription = 'Operation not availble'
          return err
        }),
      )
  }
}
