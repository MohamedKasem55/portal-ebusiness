import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../../../core/responsive/datatable-mobile.component'
import { PayrollsService } from '../../payrolls.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  templateUrl: './step2.component.html',
})
export class Step2Component extends DatatableMobileComponent implements OnInit {
  @ViewChild('salaryTable') salaryTable: any
  @ViewChild('payrollTable') payrollTable: any

  step = 2
  sharedData: any = {}

  salaryDisplaySize = 20
  payrollDisplaySize = 20

  ValidateSubscription: Subscription

  @ViewChild('authorization') authorization: any
  generateChallengeAndOTP: ResponseGenerateChallenge
  public rejectReason: string

  salaryPending = []
  payrollPending = []

  constructor(
    private service: PayrollsService,
    public translate: TranslateService,
    private router: Router,
  ) {
    super()
  }

  ngOnInit(): void {
    super.ngOnInit()
    this.sharedData.responseValidate = {}
    this.sharedData.requestValidate = new RequestValidate()
    this.rejectReason = ''

    if (this.sharedData.salarySelected.length !== 0) {
      let me = this
      this.ValidateSubscription = this.service
        .salaryPaymentsValidate(this.sharedData.salarySelected)
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData.responseValidate = result
            me.salaryPending = []
            //me.salaryPending.push(...result.batchListsContainer.notAllowed);
            me.salaryPending.push(...result.batchListsContainer.toProcess)
            me.salaryPending.push(...result.batchListsContainer.toAuthorize)
          } else {
            this.router.navigate(['/myprofile/pending/payroll/step1'])
          }
          this.ValidateSubscription.unsubscribe()
        })
    }

    if (this.sharedData.payrollSelected.length !== 0) {
      let me = this
      this.ValidateSubscription = this.service
        .importsPayrollsValidate(this.sharedData.payrollSelected)
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData.responseValidate = result
            me.payrollPending = []
            //me.payrollPending.push(...result.batchListsContainer.notAllowed);
            me.payrollPending.push(...result.batchListsContainer.toProcess)
            me.payrollPending.push(...result.batchListsContainer.toAuthorize)
          } else {
            this.router.navigate(['/myprofile/pending/payroll/step1'])
          }
          this.ValidateSubscription.unsubscribe()
        })
    }
  }

  getAllTables(): any[] {
    const tablas = []
    if (this.salaryTable) {
      tablas.push(this.salaryTable)
    }
    if (this.payrollTable) {
      tablas.push(this.payrollTable)
    }
    return tablas
  }

  valid() {
    if (this.authorization == null) {
      return true
    } else {
      return !this.authorization || this.authorization.valid()
    }
  }

  validReject() {
    return this.rejectReason.length > 0
  }

  openModal(row, popup) {
    popup.openModal(row)
  }
}
