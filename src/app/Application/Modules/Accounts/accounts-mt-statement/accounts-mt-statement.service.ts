import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { AbstractService } from '../../Common/Services/Abstract/abstract.service'

@Injectable({
  providedIn: 'root',
})
export class AccountsMtStatementService extends AbstractService {
  servicesUrl: string

  constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
  ) {
    super(http, config)
    this.servicesUrl = config.getServicesUrl()
  }

  public list(): Observable<any> {
    return this.http
      .get(`${this.servicesUrl}/swiftStatements/init`)
      .pipe(map((response: any) => response))
  }

  public getfilePdf(data): Observable<any> {
    return this.http
      .post(`${this.servicesUrl}/swiftStatements/download`, data, {
        responseType: 'blob',
      })
      .pipe(map((response: any) => response))
  }
}
