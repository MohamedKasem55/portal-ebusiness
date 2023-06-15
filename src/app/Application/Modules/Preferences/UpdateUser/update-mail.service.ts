import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { AppService } from '../../../../core/service/app.service'
import { AppResponse } from '../../../Model/app.response'

@Injectable()
export class UpdateMailService extends AppService {
  private servicesUrl: string

  constructor(private http: HttpClient, public config: ConfigResourceService) {
    super()
    this.servicesUrl = config.getServicesUrl()
  }

  updateMail(detailsUpdate: MailUpdate): Observable<AppResponse> {
    return this.http
      .post<AppResponse>(
        this.servicesUrl + '/userProfile/updateMail',
        detailsUpdate,
      )
      .pipe(catchError(this.handleError))
  }
}

export class MailUpdate {
  mail: string
  repeatMail: string

  constructor(init?: Partial<MailUpdate>) {
    Object.assign(this, init)
  }
}
