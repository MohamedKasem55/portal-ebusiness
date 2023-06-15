import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ConfigResourceService } from 'app/core/config/config.resource.local'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class CurrencyService {
  private servicesUrl: string

  constructor(private http: HttpClient, public config: ConfigResourceService) {
    this.servicesUrl = config.getServicesUrl()
  }

  getCurrencyISO(): Observable<any> {
    return this.getModel('currencyIso')
  }

  getCurrencyDecimals(): Observable<any> {
    return this.getModel('currencyDecimals')
  }

  private getModel(name): Observable<any> {
    const data: any = {}
    data.name = name
    return this.http.post(this.servicesUrl + '/statics/model', data).pipe(
      map((response: any) => {
        // const output=response;
        return response['props']
      }),
    )
  }
}
