import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from 'app/Application/Model/exception'

@Injectable()
export class CompanyAdminWorkflowService {
  servicesUrl: string

  constructor(private http: HttpClient, public config: ConfigResourceService) {
    this.servicesUrl = config.getServicesUrl()
  }

  public handleError(error: HttpResponse<any> | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string
    if (error instanceof HttpResponse) {
      const err = error['error'] || JSON.stringify(error)
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`
    } else {
      errMsg = error.message ? error.message : error.toString()
    }
    console.error(errMsg)
    const errorService: Exception = new Exception('handle', errMsg)
    return observableThrowError(errorService)
  }

  public getLevelsBeneficiaries() {
    return this.getLevels('BENEFICIARIES_PRIVILEGE')
  }

  public confirmLevelsBeneficiaries(levels) {
    return this.confirmLevels(levels, 'BENEFICIARIES_PRIVILEGE')
  }

  public validateLevelsBeneficiaries(levels) {
    return this.validateLevels(levels, 'BENEFICIARIES_PRIVILEGE')
  }

  public getLevelsPayrollCards() {
    return this.getLevels('PAYROLLCARDS_PRIVILEGE')
  }

  public confirmLevelsPayrollCards(levels) {
    return this.confirmLevels(levels, 'PAYROLLCARDS_PRIVILEGE')
  }

  public validateLevelsPayrollCards(levels) {
    return this.validateLevels(levels, 'PAYROLLCARDS_PRIVILEGE')
  }

  public getLevelsDirectDebits() {
    return this.getLevels('DIRECTDEBITS_PRIVILEGE')
  }

  public confirmLevelsDirectDebits(levels) {
    return this.confirmLevels(levels, 'DIRECTDEBITS_PRIVILEGE')
  }

  public validateLevelsDirectDebits(levels) {
    return this.validateLevels(levels, 'DIRECTDEBITS_PRIVILEGE')
  }

  public getLevelsAddBiller() {
    return this.getLevels('BILLPAYMENTS_PRIVILEGE')
  }

  public confirmLevelsAddBiller(levels) {
    return this.confirmLevels(levels, 'BILLPAYMENTS_PRIVILEGE')
  }

  public validateLevelsAddBiller(levels) {
    return this.validateLevels(levels, 'BILLPAYMENTS_PRIVILEGE')
  }

  public getLevelsBalanceCertificate() {
    return this.getLevels('GENERAL_PRIVILEGE')
  }

  public confirmLevelsBalanceCertificate(levels) {
    return this.confirmLevels(levels, 'GENERAL_PRIVILEGE')
  }

  public validateLevelsBalanceCertificate(levels) {
    return this.validateLevels(levels, 'GENERAL_PRIVILEGE')
  }

  public getLevelsChequeManagement() {
    return this.getLevels('REQUESTCHECKBOOK_PRIVILEGE')
  }

  public confirmLevelsChequeManagement(levels) {
    return this.confirmLevels(levels, 'REQUESTCHECKBOOK_PRIVILEGE')
  }

  public validateLevelsChequeManagement(levels) {
    return this.validateLevels(levels, 'REQUESTCHECKBOOK_PRIVILEGE')
  }

  public getLevelsPos() {
    return this.getLevels('POS_MANAGEMENT_PRIVILEGE')
  }

  public confirmLevelsPos(levels) {
    return this.confirmLevels(levels, 'POS_MANAGEMENT_PRIVILEGE')
  }

  public validateLevelsPos(levels) {
    return this.validateLevels(levels, 'POS_MANAGEMENT_PRIVILEGE')
  }

  public getLevelsPositivePay() {
    return this.getLevels('POSITIVEPAYCHECK_PRIVILEGE')
  }

  public confirmLevelsPositivePay(levels) {
    return this.confirmLevels(levels, 'POSITIVEPAYCHECK_PRIVILEGE')
  }
  public validateLevelsPositivePay(levels) {
    return this.validateLevels(levels, 'POSITIVEPAYCHECK_PRIVILEGE')
  }

  public getLevels(privilege: string): Observable<any> {
    const data = {
      privilegeId: privilege,
    }
    return this.http
      .post(this.servicesUrl + '/workflow/nonFinancial/getLevels', data)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return exception
          } else {
            return body
          }
        }),
        catchError(this.handleError),
      )
  }
  public getAllLevels(): Observable<any> {
    return this.http
      .get(this.servicesUrl + '/workflow/nonFinancial/getAllLevels')
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return exception
          } else {
            return body
          }
        }),
        catchError(this.handleError),
      )
  }
  public validateLevels(_levels: any, _privilege: string): Observable<any> {
    const data = {
      workflowList: _levels,
    }
    return this.http
      .post(this.servicesUrl + '/workflow/nonFinancial/validate', data)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return exception
          } else {
            return body
          }
        }),
        catchError(this.handleError),
      )
  }

  public confirmLevels(_batchList: any, _privilege: string): Observable<any> {
    const data = {
      batchList: _batchList,
    }
    return this.http
      .post(this.servicesUrl + '/workflow/nonFinancial/confirm', data)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
              body.generateChallengeAndOTP,
            )
            return exception
          } else {
            return body
          }
        }),
        catchError(this.handleError),
      )
  }
}
