import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ConfigResourceService } from 'app/core/config/config.resource.local'
import { Observable, of } from 'rxjs'
import { AbstractActionForWizardService } from '../../../Common/Services/Abstract/abstract-action-for-wizard.service'
import { catchError, map } from 'rxjs/operators'

@Injectable()
export class DebitCardAdjustPosService extends AbstractActionForWizardService {
  constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
  ) {
    super(http, config)
  }

  protected createInitRequest(values: any = {}): Observable<any> {
    const data = {
      cardNumber: values.card.cardNum,
    }
    return this.http.post(this.servicesUrl + '/debitcard/fixedPosLimits', data)
  }

  protected createPosLimitDTORequest(values: any): Observable<any> {
    const data = {
      cardNumber: values.card.cardNum,
      cardSeqNumber: values.card.cardSeqNum,
    }
    return this.http.post(this.servicesUrl + '/debitcard/limit', data)
  }

  public posLimitDTO(values: any = {}): Observable<any> {
    return this.createPosLimitDTORequest(values).pipe(
      map((response: any) => {
        return response
      }),
      catchError(this.handleError),
    )
  }

  protected createConfirmRequest(values: any): Observable<any> {
    return this.http.post(this.servicesUrl + '/debitcard/posLimit', values)
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
