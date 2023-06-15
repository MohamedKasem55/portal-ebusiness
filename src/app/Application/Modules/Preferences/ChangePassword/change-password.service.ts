import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { AppService } from '../../../../core/service/app.service'
import { AppResponse } from '../../../Model/app.response'

@Injectable()
export class ChangePasswordService extends AppService {
  private servicesUrl: string

  constructor(private http: HttpClient, public config: ConfigResourceService) {
    super()
    this.servicesUrl = config.getServicesUrl()
  }

  changePassword(detailsUpdate: PasswordUpdate): Observable<AppResponse> {
    return this.http
      .post<AppResponse>(
        this.servicesUrl + '/userProfile/updatePassword',
        detailsUpdate,
      )
      .pipe(catchError(this.handleError))
  }
}

export class PasswordUpdate {
  oldPassword: string
  password: string

  constructor(init?: Partial<PasswordUpdate>) {
    Object.assign(this, init)
  }
}
