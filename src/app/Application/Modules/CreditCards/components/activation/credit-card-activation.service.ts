import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ConfigResourceService } from 'app/core/config/config.resource.local'
import { Observable, of } from 'rxjs'
import { AbstractActionForWizardService } from '../../../Common/Services/Abstract/abstract-action-for-wizard.service'

@Injectable()
export class CreditCardActivationService extends AbstractActionForWizardService {
  constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
  ) {
    super(http, config)
  }

  protected createInitRequest(): Observable<any> {
    const data = {
      page: 1,
      rows: 20,
    }
    return this.http.post(
      this.servicesUrl + '/creditCards/activation/list',
      data,
    )
  }

  protected createConfirmRequest(values: any): Observable<any> {
    const data = {
      card: values.card,
    }

    return this.http.post(
      this.servicesUrl + '/creditCards/activation/activate',
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
