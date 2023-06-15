import { Injectable } from '@angular/core'
import { AbstractActionForWizardService } from '../../../Common/Services/Abstract/abstract-action-for-wizard.service'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import { InitialUserAdd } from '../../Model/initialUserAdd'
import { HttpClient } from '@angular/common/http'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { Exception } from 'app/Application/Model/exception'

@Injectable()
export class CompanyAdminUserManagementAddService extends AbstractActionForWizardService {
  public constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
  ) {
    super(http, config)
  }

  public preInsertUser(): Observable<any> {
    const data = {}

    return this.http
      .get(this.servicesUrl + '/userManagement/register/init', data)
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            const errorService: Exception = new Exception(
              response.errorCode,
              response.errorDescription,
            )
            return observableThrowError(errorService)
          } else {
            let resp: InitialUserAdd
            resp = response
            resp.realGroup = {
              groupListOthers: [],
              groupListPayments: [],
              groupListTransfers: [],
              groupListBills: [],
              groupListCheckBook: [],
              groupListAramcoPayments: [],
              groupListBusinessCards: [],
              groupListPrePaidCards: [],
            }
            return resp
          }
        }),
        catchError(this.handleError),
      )
  }

  public validateAddUser(data): Observable<any> {
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
            return observableThrowError(errorService)
          } else {
            return body
          }
        }),
        catchError(this.handleError),
      )
  }

  public confirmAddUser(data): Observable<any> {
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
            return errorService
          } else {
            return body
          }
        }),
        catchError(this.handleError),
      )
  }

  //-----------------------------------

  protected createConfirmRequest(values: any): Observable<any> {
    return undefined
  }

  protected createInitRequest(values: any): Observable<any> {
    return undefined
  }

  protected createStepRequest(step: number, values: any): Observable<any> {
    return undefined
  }

  protected createValidateRequest(values: any): Observable<any> {
    return undefined
  }
}
