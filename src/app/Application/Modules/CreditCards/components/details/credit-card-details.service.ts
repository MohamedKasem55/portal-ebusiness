import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { AbstractActionDetailsService } from '../../../Common/Services/Abstract/abstract-action-details.service'

@Injectable()
export class CreditCardDetailsService extends AbstractActionDetailsService {
  constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
  ) {
    super(http, config)
  }

  protected createInitRequest(): Observable<any> {
    return of({})
  }

  protected createDetailRequest(criteria: any): Observable<any> {
    const params = {
      card: this.getSelectedItem(),
    }
    return this.http.post(this.servicesUrl + '/creditCards/details', params)
  }

  protected getOutputFromRequestedData(_body): any {
    return _body.cardList
  }

  clearData() {
    super.clearData()
  }
}
