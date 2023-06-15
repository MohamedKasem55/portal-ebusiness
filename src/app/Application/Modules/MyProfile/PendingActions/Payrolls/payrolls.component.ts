import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { PayrollsService } from './payrolls.service'
import { distinctUntilChanged } from 'rxjs/operators'
import { AbstractAppComponent } from '../../../Common/Components/Abstract/abstract-app.component'
import { TranslateService } from '@ngx-translate/core'
import { PendingActionsNotificaterService } from '../../../Common/Components/PendingActions/pending-actions-notificater.service'
import {
  WorkflowDetailsPopupComponent,
  WORKFLOWS_BY_PENDING_ACTION_MAP,
  PENDING_ACTION,
} from '../Component/workflow-details-popup/workflow-details-popup.component'

@Component({
  templateUrl: './payrolls.component.html',
})
export class PayrollsComponent
  extends AbstractAppComponent
  implements OnInit, OnDestroy
{
  wizardStep: number
  sharedData: any = {}

  resultFileReference: any[] = []

  currentComponent: any
  authorizeSubscription: Subscription

  currentItem: any = null
  result_model_status: any = null
  public visiblePagesCount = 5
  constructor(
    private service: PayrollsService,
    private router: Router,
    public translate: TranslateService,
    private pendingActionNotification: PendingActionsNotificaterService,
  ) {
    super(translate)
  }

  ngOnInit() {
    this.sharedData.rejectReason = ''
    this.service.setCurrenItem(null)
    this.subscriptions.push(
      this.service
        .getCurrentItemData()
        .pipe(distinctUntilChanged())
        .subscribe((result) => {
          this.currentItem = result
        }),
    )

    const currentLang = this.translate.currentLang
    this.subscriptions.push(
      this.service
        .getModel(currentLang, 'batchSecurityLevelStatus')
        .subscribe((result) => {
          this.result_model_status = result
          this.service.result_model_status = this.result_model_status
        }),
    )

    this.cleanSelected()
  }

  ngOnDestroy() {
    this.service.setCurrenItem(null)
  }

  componentAdded(component) {
    component.sharedData = this.sharedData
    this.wizardStep = component.step
    this.currentComponent = component
    if (component.step !== 1) {
      if (Object.keys(this.sharedData).length === 0) {
        this.router.navigate(['/myprofile/pending/payroll/step1'])
      }
    }
  }

  aproveFirstStep() {
    if (this.sharedData.salarySelected.length !== 0) {
      this.sharedData.salaryFlow = true
    } else {
      this.sharedData.salaryFlow = false
    }
    this.sharedData.aproveFlow = true
    this.router.navigate(['/myprofile/pending/payroll/step2'])
  }

  rejectFirstStep() {
    this.sharedData.aproveFlow = false
    this.router.navigate(['/myprofile/pending/payroll/step2'])
  }

  backButton() {
    this.wizardStep--
    this.router.navigate(['/myprofile/pending/payroll/step' + this.wizardStep])
  }

  confirmAprove() {
    if (this.sharedData.salarySelected.length !== 0) {
      this.authorizeSubscription = this.service
        .salaryPaymentsConfirm(
          this.sharedData.responseValidate.batchListsContainer,
          this.sharedData.requestValidate,
        )
        .subscribe((result) => {
          if (!result.error) {
            this.service.resultReferenceFile = result['fileNames']
            this.cleanSelected()
            this.pendingActionNotification.getRefreshObserver().next(true)
            this.router.navigate(['/myprofile/pending/payroll/step3'])
          }
          this.authorizeSubscription.unsubscribe()
        })
    } else {
      this.authorizeSubscription = this.service
        .importsPayrollsConfirm(
          this.sharedData.responseValidate.batchListsContainer,
          this.sharedData.requestValidate,
        )
        .subscribe((result) => {
          if (!result.error) {
            this.service.resultReferenceFile = result['fileNames']
            this.cleanSelected()
            this.pendingActionNotification.getRefreshObserver().next(true)
            this.router.navigate(['/myprofile/pending/payroll/step3'])
          }
          this.authorizeSubscription.unsubscribe()
        })
    }
  }

  confirmReject() {
    const rejectReason = this.currentComponent.rejectReason
    if (this.sharedData.salarySelected.length !== 0) {
      this.authorizeSubscription = this.service
        .salaryPaymentsRefuse(this.sharedData.salarySelected, rejectReason)
        .subscribe((result) => {
          if (!result.error) {
            this.service.resultReferenceFile = result['fileNames']
            this.cleanSelected()
            this.pendingActionNotification.getRefreshObserver().next(true)
            this.router.navigate(['/myprofile/pending/payroll/step3'])
          }
          this.authorizeSubscription.unsubscribe()
        })
    } else {
      this.authorizeSubscription = this.service
        .importsPayrollsRefuse(this.sharedData.payrollSelected, rejectReason)
        .subscribe((result) => {
          if (!result.error) {
            this.service.resultReferenceFile = result['fileNames']
            this.cleanSelected()
            this.pendingActionNotification.getRefreshObserver().next(true)
            this.router.navigate(['/myprofile/pending/payroll/step3'])
          }
          this.authorizeSubscription.unsubscribe()
        })
    }
  }

  closeItem() {
    this.service.setCurrenItem(null)
  }

  setPageAuthorizationPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }
    this.currentItem['authorizationPage'].page.pageNumber =
      dataTableEvent.offset
  }

  openModal(row, popup) {
    popup.openModal(row)
  }

  setEmployeePage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.currentItem['employeeData'].page.pageNumber = pageInfo.offset
  }

  transformStatus(key) {
    return this.service.retrieveValue(key)
  }

  isValidRefuse() {
    return this.currentComponent.validReject()
  }

  isValidConfirm() {
    return this.currentComponent.valid()
  }
  cleanSelected() {
    this.service.setSalarySelected([])
    this.service.setPayrollSelected([])
  }

  displayWorkflowDetails(popup) {
    ;(popup as WorkflowDetailsPopupComponent).openModal(
      WORKFLOWS_BY_PENDING_ACTION_MAP.get(PENDING_ACTION.PAYROLL),
      PENDING_ACTION.PAYROLL,
    )
  }
}
