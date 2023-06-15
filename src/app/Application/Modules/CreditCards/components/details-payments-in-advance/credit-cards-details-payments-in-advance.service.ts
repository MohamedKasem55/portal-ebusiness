import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ConfigResourceService } from 'app/core/config/config.resource.local'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { AbstractActionForWizardService } from '../../../Common/Services/Abstract/abstract-action-for-wizard.service'

@Injectable()
export class CreditCardsDetailsPaymentsInAdvanceService extends AbstractActionForWizardService {
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
      this.servicesUrl + '/paymentAdvance/currentCycleAmount',
      data,
    )
  }

  protected createConfirmRequest(values: any): Observable<any> {
    const data = {
      cardDTO: values.cardDTO,
      accountDTO: values.accountDTO,
      amount: values.amount,
    }

    return this.http.post(this.servicesUrl + '/paymentAdvance/sendHost', data)
  }

  protected createAccountsDTORequest(values: any): Observable<any> {
    /*
        const data = {
            order: "",
            orderType: "",
            page: 1,
            rows: 100,
            txType: "ECIA"
        };

        return this.http.post(this.servicesUrl + "/accounts/combo", data);
        */
    const data: any = {
      //card: values.card
    }

    return this.http.get(this.servicesUrl + '/accounts/nicknameList', {
      params: data,
    })
  }

  public accountsDTO(values: any = {}): Observable<any> {
    return this.createAccountsDTORequest(values).pipe(
      map((response: any) => {
        return response
      }),
      catchError(this.handleError),
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
