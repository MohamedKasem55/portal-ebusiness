import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { AbstractActionDetailsService } from '../../../Common/Services/Abstract/abstract-action-details.service'

@Injectable()
export class DebitCardActionsService extends AbstractActionDetailsService {
  constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
  ) {
    super(http, config)
  }

  protected createInitRequest(): Observable<any> {
    return of({})
  }
  protected createDetailRequest(values: any): Observable<any> {
    return undefined
  }

  clearData() {
    super.clearData()
  }
}
