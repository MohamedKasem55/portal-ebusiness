import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ConfigResourceService } from 'app/core/config/config.resource.local'
import { Observable, of } from 'rxjs'
import { AbstractActionForWizardService } from '../../../Common/Services/Abstract/abstract-action-for-wizard.service'
import { catchError, map } from 'rxjs/operators'
import { Exception } from 'app/Application/Model/exception'

@Injectable()
export class CompanyAdminUserManagementEditService extends AbstractActionForWizardService {
  public validateModifyUser(data): Observable<any> {
    //console.log('service', data);

    return this.http
      .put(this.servicesUrl + '/userManagement/validate', data)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const errorService: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            //console.log('Error en el servicio');
            return errorService
          } else {
            return body
          }
        }),
        catchError(this.handleError),
      )
  }

  public modifyUser(data): Observable<any> {
    //console.log('service', data);

    return this.http
      .put(this.servicesUrl + '/userManagement/confirm', data)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const errorService: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
              body.generateChallengeAndOTP,
            )
            //console.log('Error en el servicio');
            return errorService
          } else {
            return body
          }
        }),
        catchError(this.handleError),
      )
  }

  //------------------------------------------------------------------

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

  //--------------------------------------------------
}
