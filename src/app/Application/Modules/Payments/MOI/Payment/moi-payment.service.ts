import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { AbstractActionForWizardService } from '../../../Common/Services/Abstract/abstract-action-for-wizard.service'

@Injectable()
export class MoiPaymentService extends AbstractActionForWizardService {
  constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
  ) {
    super(http, config)
  }

  //-----------------------------------------------------------------------

  protected createAccountsDTORequest(values: any): Observable<any> {
    const data: any = {}
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

  //-----------------------------------------------------------------------

  protected createInitRequest(values: any = {}): Observable<any> {
    return of({
      errorCode: '0',
    })
  }

  protected createConfirmRequest(values: any): Observable<any> {
    const data = {
      batchList: values.batchList,
      requestValidate: values.requestValidate,
    }

    return this.http.post(this.servicesUrl + '/moiPayment/confirm', data)
  }

  protected createStepRequest(step: number, values: any): Observable<any> {
    let data = {}
    switch (step) {
      case 0:
        const apiMethodKey = values.apiKey
        data = Object.assign(
          {
            applicationType: values.applicationType, // este valor realmente importa en el parámetro "applicationType"
            accountNumber: values.data.account,
          },
          values.data,
        )
        data['transactionType'] = 'P' // es P o R, segun logica en el backend
        delete data['account']
        // en caso de que algun campo sea de tipo date,
        // se indican los parametros days, months, years, y se elimina este campo
        const keys = Object.keys(data)
        for (let i = 0; i < keys.length; i++) {
          if (
            typeof data[keys[i]] == 'object' &&
            data[keys[i]].day &&
            data[keys[i]].month &&
            data[keys[i]].year
          ) {
            data['day'] = data[keys[i]].day
            data['month'] = data[keys[i]].month
            data['year'] = data[keys[i]].year
            delete data[keys[i]]
          }
        }
        //data['account'] = data['accountNumber'];
        //data['serviceType'] = null;
        //data['applicationType'] = null;
        return this.http.post(
          this.servicesUrl + '/moiPayment/prepare' + apiMethodKey,
          data,
        )
      //break;
      case 1:
        data = {
          batchList: values.batchList,
        }
        return this.http.post(this.servicesUrl + '/moiPayment/validate', data)
        break
      default:
        break
    }
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
