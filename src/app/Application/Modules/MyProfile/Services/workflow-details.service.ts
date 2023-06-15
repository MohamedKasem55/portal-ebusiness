import { of } from 'rxjs'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ConfigResourceService } from 'app/core/config/config.resource.local'
import { TranslateService } from '@ngx-translate/core'
import { map } from 'rxjs/operators'

export interface CanBeError {
  error?: boolean
  errorCode?: string
  errorDescription?: string
}

export interface NonFinancialWorkflow {
  levels?: boolean[]
  paymentId?: string
}

export interface NonFinancialWorkflowsResponse extends CanBeError {
  workflowList?: NonFinancialWorkflow[]
}

export interface FinancialWorkflow {
  details?: {
    amountMax: number
    amountMin: number
    levels: boolean[]
  }[]
  paymentId?: string
}

export interface FinancialWorkflowsResponse extends CanBeError {
  workflowList?: FinancialWorkflow[]
}

@Injectable({
  providedIn: 'root',
})
export class WorkflowDetailsService {
  private servicesUrl: string

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    public translate: TranslateService,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  getUserAccounts() {
    // return of([
    //   { fullAccountNumber: "123456789123456789", alias: "Cuenta A" },
    //   { fullAccountNumber: "987654321987654321", alias: "Cuenta B" }
    // ]);

    return this.http
      .get<any>(this.servicesUrl + '/workflow/accounts/getUserAccounts')
      .pipe(map((response) => response.accountList))
  }

  getNonFinancialWorkflows(paymentTypes: string[]) {
    // const a = Math.floor(Math.random() * 5);

    // const data = paymentTypes.map((pt) => ({
    //   paymentId: pt,
    //   levels: [a - 1 > 0, a - 2 > 0, a - 3 > 0, a - 4 > 0, a - 5 > 0]
    // } as NonFinancialWorkflow)) as NonFinancialWorkflow[];

    // return of({
    //   error: false,
    //   workflowList: data
    // } as NonFinancialWorkflowsResponse);

    const bodyObj = {
      paymentTypes,
    }
    const body = JSON.stringify(bodyObj)
    return this.http
      .post<any>(
        this.servicesUrl + '/workflow/nonFinancial/getUserLevels',
        body,
      )
      .pipe(
        map((response) => {
          const result: NonFinancialWorkflowsResponse = {}

          if (response.errorCode !== '0') {
            result.error = true
            result.errorCode = response.errorCode
            result.errorDescription = response.errorDescription
          } else {
            result.error = false
            result.workflowList = response.workflowList
          }

          return result
        }),
      )
  }

  getFinancialWorkflows(accountNumber: string, paymentTypes: string[]) {
    // const a = Math.floor(Math.random() * 5);

    // const data = paymentTypes.map((pt) => ({
    //   paymentId: pt,
    //   details: [{ amountMin: 0, amountMax: 10, levels: [a - 1 > 0, a - 2 > 0, a - 3 > 0, a - 4 > 0, a - 5 > 0] }]
    // } as FinancialWorkflow)) as FinancialWorkflow[];

    // return of({
    //   error: false,
    //   workflowList: data
    // } as FinancialWorkflowsResponse);

    const bodyObj = {
      accountNumber,
      paymentTypes,
    }
    const body = JSON.stringify(bodyObj)
    return this.http
      .post<any>(this.servicesUrl + '/workflow/accounts/getUserLevels', body)
      .pipe(
        map((response) => {
          const result: FinancialWorkflowsResponse = {}

          if (response.errorCode !== '0') {
            result.error = true
            result.errorCode = response.errorCode
            result.errorDescription = response.errorDescription
          } else {
            result.error = false
            result.workflowList = response.workflowTypePaymentList
          }

          return result
        }),
      )
  }
}
