import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ConfigResourceService } from 'app/core/config/config.resource.local'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { AbstractActionForWizardService } from '../../../Common/Services/Abstract/abstract-action-for-wizard.service'

@Injectable()
export class CreditCardsDetailsChangeMailingAddressService extends AbstractActionForWizardService {
  constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
  ) {
    super(http, config)
  }

  protected createInitRequest(values: any = {}): Observable<any> {
    const data = {
      card: values.card,
    }
    return this.http.post(
      this.servicesUrl + '/changeMailing/inquiryMailing',
      data,
    )
  }

  protected createConfirmRequest(values: any): Observable<any> {
    const data = {
      card: values.card,
      creditCardDetails: values.creditCardDetails,
    }

    return this.http.post(
      this.servicesUrl + '/changeMailing/updateCardMailAddress',
      data,
    )
  }

  protected createStepRequest(step: number, values: any): Observable<any> {
    return of({
      errorCode: '0',
    })
  }

  protected createCompleteFormDataRequest(values: any): Observable<any> {
    const data = values.formData
    return this.http.post(
      this.servicesUrl + '/changeMailing/completeData',
      data,
    )
  }

  public completeFormData(values: any): Observable<any> {
    return this.createCompleteFormDataRequest(values).pipe(
      map((response: any) => {
        return response
      }),
      catchError(this.handleError),
    )
  }

  protected createValidateRequest(values: any): Observable<any> {
    return of({
      errorCode: '0',
    })
  }
}
