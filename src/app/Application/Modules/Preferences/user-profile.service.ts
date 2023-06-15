import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ConfigResourceService } from '../../../core/config/config.resource.local'

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private _servicesUrl: string

  constructor(public http: HttpClient, public config: ConfigResourceService) {
    this._servicesUrl = config.getServicesUrl()
  }

  public get(userId: string): Observable<any> {
    return this.http
      .get(`${this._servicesUrl}/userManagement/details/${userId}`)
      .pipe((resp) => resp)
  }
}
