import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'

@Injectable()
export class PayrollCardsService {
  servicesUrl: string
  institutionData: any

  constructor(private http: HttpClient, public config: ConfigResourceService) {
    this.servicesUrl = config.getServicesUrl()
  }

  public getInstitution(): Observable<any> {
    if (!this.institutionData) {
      return this.http
        .get(this.servicesUrl + '/payrollCards/getInstitution')
        .pipe(
          map((response: any) => {
            response.error = response.errorCode !== '0'
            this.institutionData = response
            return response
          }),
        )
    } else {
      return of(this.institutionData)
    }
  }
}
