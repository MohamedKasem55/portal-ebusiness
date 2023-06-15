import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'

@Injectable({
  providedIn: 'root',
})
export class DividedDistributionRequestReportServiceService {
  private servicesUrl: string

  constructor(private http: HttpClient, public config: ConfigResourceService) {
    this.servicesUrl = config.getServicesUrl()
  }

  public getPeriods(): Observable<any> {
    return this.http
      .get(`${this.servicesUrl}/dividend/periods`)
      .pipe(map((resp) => resp as any))
  }

  public requestReport(body): Observable<void> {
    return this.http
      .post(`${this.servicesUrl}/dividend/request`, body)
      .pipe(map((resp) => resp as any))
  }
}
