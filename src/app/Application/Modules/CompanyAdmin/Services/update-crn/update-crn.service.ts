import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { Observable } from 'rxjs'
import { UpdateCRNrequest } from '../../Component/update-crn/UpdateCRNrequest'

@Injectable()
export class UpdateCrnService {
  servicesUrl: string

  constructor(private http: HttpClient, public config: ConfigResourceService) {
    this.servicesUrl = config.getServicesUrl()
  }

  public updateCRN(updateCRNrequest: UpdateCRNrequest): Observable<any> {
    return this.http.put(
      this.servicesUrl + '/managementCompany/details/crnUpdate',
      updateCRNrequest,
    )
  }
}
