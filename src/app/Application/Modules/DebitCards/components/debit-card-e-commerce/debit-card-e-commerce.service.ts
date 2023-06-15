import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ConfigResourceService } from 'app/core/config/config.resource.local'
import { Observable, of } from 'rxjs'
import { AbstractActionForWizardService } from '../../../Common/Services/Abstract/abstract-action-for-wizard.service'

@Injectable()
export class DebitCardECommerceService extends AbstractActionForWizardService {
  constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
  ) {
    super(http, config)
  }

  protected createInitRequest(values: any = {}): Observable<any> {
    return undefined
  }

  protected createConfirmRequest(values: any): Observable<any> {
    const data = {
      cardNum: values.card.cardNum,
      cardSeqNum: values.card.cardSeqNum,
      prodType: values.card.prodType,
      enableECommerce: values.enableECommerce,
    }
    return this.http.post(
      this.servicesUrl + '/debitcard/changeDebitCardInternet',
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

  get termsConditions(): string {
    return `${this.config.getDocumentUrl()}/Debit_Card_Mada.pdf`
  }
}
