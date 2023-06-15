import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ConfigResourceService } from 'app/core/config/config.resource.local'
import { Observable, of } from 'rxjs'
import { AbstractActionForWizardService } from '../../../Common/Services/Abstract/abstract-action-for-wizard.service'
import { map } from 'rxjs/operators'

@Injectable()
export class DebitCardChangePinService extends AbstractActionForWizardService {
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
      acctNum: values.card.acctNum,
      pin: values.currentPin,
      newPIN: values.newPin,
      requestValidate: values.requestValidate,
    }

    return this.http.post(this.servicesUrl + '/debitcard/resetPin', data)
  }

  protected createStepRequest(step: number, values: any): Observable<any> {
    return of({
      errorCode: '0',
    })
  }

  protected createValidateRequest(values: any): Observable<any> {
    const data = {}
    return this.http
      .post(this.servicesUrl + '/debitcard/resetPin/validate', data)
      .pipe(map((response: any) => response))
  }
}
