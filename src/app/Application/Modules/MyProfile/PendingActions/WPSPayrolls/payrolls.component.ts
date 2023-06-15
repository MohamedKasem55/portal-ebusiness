import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { distinctUntilChanged } from 'rxjs/operators'
import { AbstractAppComponent } from '../../../Common/Components/Abstract/abstract-app.component'
import { PendingActionsNotificaterService } from '../../../Common/Components/PendingActions/pending-actions-notificater.service'
import { PayrollsService } from './payrolls.service'
import { ColumnMode } from '@swimlane/ngx-datatable'
import {
  WorkflowDetailsPopupComponent,
  WORKFLOWS_BY_PENDING_ACTION_MAP,
  PENDING_ACTION,
} from '../Component/workflow-details-popup/workflow-details-popup.component'

@Component({
  templateUrl: './payrolls.component.html',
})
export class PayrollsComponent extends AbstractAppComponent implements OnInit {
  wizardStep: number
  sharedData: any = {}
  rejectReason: any
  currentComponent: any
  defaultColumnMode = ColumnMode.force
  public defaultHeight: any = 'auto'

  authorizeSubscription: Subscription

  currentItem: any = null
  result_model_status: any = null

  constructor(
    public service: PayrollsService,
    private router: Router,
    public translate: TranslateService,
    private pendingActionNotification: PendingActionsNotificaterService,
  ) {
    super(translate)
    this.wizardStep = 1
  }

  ngOnInit() {
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

  componentAdded(component) {
    this.currentComponent = component
    component.sharedData = this.sharedData
    this.wizardStep = component.step

    if (component.step !== 1) {
      if (Object.keys(this.sharedData).length === 0) {
        this.router.navigate(['/myprofile/wpspending/wpspayrolls/step1'])
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
    this.router.navigate(['/myprofile/pending/wpspayrolls/step2'])
  }

  rejectFirstStep() {
    this.sharedData.aproveFlow = false
    this.rejectReason = ''
    this.router.navigate(['/myprofile/pending/wpspayrolls/step2'])
  }

  backButton() {
    this.wizardStep--
    this.router.navigate([
      '/myprofile/pending/wpspayrolls/step' + this.wizardStep,
    ])
  }

  confirmAprove() {
    if (this.sharedData.salarySelected.length !== 0) {
      //console.log('salary',this.sharedData.responseValidate.payrollSalaryPaymentBatch);
      this.authorizeSubscription = this.service
        .salaryPaymentsConfirm(
          this.sharedData.responseValidate.payrollSalaryPaymentBatch,
          this.sharedData.requestValidate,
        )
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData['confirm'] = result
            this.cleanSelected()
            this.pendingActionNotification.getRefreshObserver().next(true)
            this.router.navigate(['/myprofile/pending/wpspayrolls/step3'])
          }
          this.authorizeSubscription.unsubscribe()
        })
    } else {
      this.authorizeSubscription = this.service
        .importsPayrollsConfirm(
          this.sharedData.responseValidate.batchList,
          this.sharedData.requestValidate,
        )
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData['confirm'] = result
            this.cleanSelected()
            this.pendingActionNotification.getRefreshObserver().next(true)
            this.router.navigate(['/myprofile/pending/wpspayrolls/step3'])
          }
          this.authorizeSubscription.unsubscribe()
        })
    }
  }

  confirmReject() {
    if (this.sharedData.salarySelected.length !== 0) {
      this.authorizeSubscription = this.service
        .salaryPaymentsRefuse(
          this.sharedData.responseValidate.payrollSalaryPaymentBatch,
          this.rejectReason,
        )
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData['confirm'] = null
            this.cleanSelected()
            this.pendingActionNotification.getRefreshObserver().next(true)
            this.router.navigate(['/myprofile/pending/wpspayrolls/step3'])
          }
          this.authorizeSubscription.unsubscribe()
        })
    } else {
      const toReject = []
      toReject.push(...this.sharedData.responseValidate.batchList.toProcess)
      toReject.push(...this.sharedData.responseValidate.batchList.toAuthorize)
      this.authorizeSubscription = this.service
        .importsPayrollsRefuse(toReject, this.rejectReason)
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData['confirm'] = null
            this.cleanSelected()
            this.pendingActionNotification.getRefreshObserver().next(true)
            this.router.navigate(['/myprofile/pending/wpspayrolls/step3'])
          }
          this.authorizeSubscription.unsubscribe()
        })
    }
  }

  isNotValid() {
    return (
      !this.currentComponent.valid() ||
      (this.currentComponent.authorization &&
        this.currentComponent.authorization.otp &&
        (!this.currentComponent.authorization.otp.model ||
          this.currentComponent.authorization.otp.model === ''))
    )
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

  transformStatus(key) {
    return this.service.retrieveValue(key)
  }

  cleanSelected() {
    this.service.setSalarySelected([])
    this.service.setPayrollSelected([])
  }

  shrinkData(data: string, breakSpacePosition = 0) {
    const stringsData = data.split(' ')
    let shrinkString = ''
    let shrinkString2 = ''
    stringsData.forEach((value, index) => {
      if (index <= breakSpacePosition) {
        shrinkString = shrinkString + value + ' '
      } else {
        shrinkString2 = shrinkString2 + value + ' '
      }
    })
    return [shrinkString, shrinkString2]
  }

  displayWorkflowDetails(popup) {
    const payrollType = this.service.getPayrollLayout()
    const titlePrefix = `${payrollType} `
    const pendingAction =
      payrollType === 'WMS'
        ? PENDING_ACTION.WMS_PAYROLL
        : PENDING_ACTION.WPS_PAYROLL
    ;(popup as WorkflowDetailsPopupComponent).openModal(
      WORKFLOWS_BY_PENDING_ACTION_MAP.get(pendingAction),
      pendingAction,
      titlePrefix,
    )
  }
}
