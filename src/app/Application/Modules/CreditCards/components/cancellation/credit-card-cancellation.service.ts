import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ConfigResourceService } from 'app/core/config/config.resource.local'
import { Observable, of } from 'rxjs'
import { AbstractActionForWizardService } from '../../../Common/Services/Abstract/abstract-action-for-wizard.service'

@Injectable()
export class CreditCardCancellationService extends AbstractActionForWizardService {
  constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
  ) {
    super(http, config)
  }

  protected createInitRequest(): Observable<any> {
    return of({
      errorCode: '0',
    })
  }

  protected createConfirmRequest(values: any): Observable<any> {
    const data = {
      card: values.card,
    }

    return this.http.post(
      this.servicesUrl + '/creditCards/cancellation/cancel',
      data,
    )
  }

  protected createStepRequest(step: number, values: any): Observable<any> {
    return of({
      errorCode: '0',
    })
  }

  protected createValidateRequest(values: any): Observable<any> {
    return of({
      errorCode: '0',
    })
  }
}
