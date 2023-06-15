import { Subscription } from 'rxjs'
import { FormArray } from '@angular/forms'
import {
  FinancialWorkflowsResponse,
  NonFinancialWorkflow,
  NonFinancialWorkflowsResponse,
} from './../../../Services/workflow-details.service'
import { FormGroup } from '@angular/forms'
import { FormBuilder } from '@angular/forms'
import { Component, OnInit, ViewChild } from '@angular/core'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { WorkflowData } from '../workflow-detail-table/workflow-detail-table.component'
import { WorkflowDetailsService } from '../../../Services/workflow-details.service'
import { Observable, zip, iif, of, pipe } from 'rxjs'
import { concatMap } from 'rxjs/operators'

export enum PENDING_ACTION {
  BILL_PAYMENTS = 'BILL_PAYMENTS',
  ARAMCO_PAYMENTS = 'ARAMCO_PAYMENTS',
  TRANSFERS = 'TRANSFERS',
  STANDING_ORDERS = 'STANDING_ORDERS',
  BENEFICIARIES = 'BENEFICIARIES',
  BULK_PAYMENTS = 'BULK_PAYMENTS',
  MOI_PAYMENTS = 'MOI_PAYMENTS',
  HAJJ_UMRAH_CARDS = 'HAJJ_UMRAH_CARDS',
  DIRECT_DEBITS = 'DIRECT_DEBITS',
  ESAL = 'ESAL',
  BALANCE_CERTIFICATE = 'BALANCE_CERTIFICATE',
  CHEQUE_BOOK_MANAGEMENT = 'CHEQUE_BOOK_MANAGEMENT',
  PAYROLL = 'PAYROLL',
  WMS_PAYROLL = 'WMS_PAYROLL',
  WPS_PAYROLL = 'WPS_PAYROLL',
  PAYROLL_CARDS = 'PAYROLL_CARDS',
  GOVERNMENT_REVENUE_TRANSFER = 'GOVERNMENT_REVENUE_TRANSFER',
  COMMERCIAL_CARDS = 'COMMERCIAL_CARDS',
  PREPAID_CARDS = 'PREPAID_CARDS',
}

export enum WORKFLOW {
  // Non financial worlflows
  BILL_ADD_NF = 'BA',
  DIRECT_DEBITS_PRIVILEGE_NF = 'DD',
  DIRECT_DEBITS_FILE_UPLOAD_NF = 'DF',
  BALANCE_CERTIFICATE_NF = 'BC',
  HAJJ_UMRAD_OPERATION = 'HO',
  HAJJ_UMRAD_ALLOCATION = 'HA',
  POSITIVE_PAY_CHEQUE_PRIVILEGE_NF = 'CP',
  REQUEST_CHEQUE_BOOK_PRIVILEGE_NF = 'CC',
  REQUEST_CHEQUE_BOOK_STOP = 'CS',
  WITHIN_ALRAJHI_BENEFICIARIES_NF = 'BW',
  LOCAL_BANK_BENEFICIARIES_NF = 'BL',
  INTERNATIONAL_BANK_BENEFICIARIES_NF = 'BT',
  TRANSFER_GOVERNMENT_REVENUE = 'TG',
  PAYROLL_CARDS_NF = 'PC',
  PARYOLL_CARDS_PAYMENT_NF = 'PP',
  PAYROLL_CARDS_UPLOAD_NF = 'PU',
  PAYROLL_CARDS_OPERATION_NF = 'PO',

  // Financial workflows
  BILL_PAYMENTS = 'BI',
  ARAMCO_PAYMENT = 'AO',
  BULK_PAYMENT = 'BK',
  GOVERNMENT_SADAD_REFUND = 'GR',
  GOVERNMENT_SADAD_PAYMENT = 'GS',
  SADAD_INVOICE_HUB = 'SI',
  STANDING_ORDERS = 'SO',
  INTERNATIONAL_TRANSFERS = 'TI',
  LOCAL_TRANSFERS = 'TL',
  WITHIN_ALRAJHI_TRANSFERS = 'TW',
  PAYROLL = 'PL',
  PAYROLL_FILE_UPLOAD = 'PF',
  WPS_WMS_PAYROLL = 'WL',
  WPS_WMS_PAYROLL_FILE_UPLOAD = 'WF',
  COMMERCIAL_CARD = 'PB',
  PREPAID_CARDS = 'PS',
}

export const WORKFLOW_IS_NON_FINANCIAL: Map<WORKFLOW, boolean> = new Map<
  WORKFLOW,
  boolean
>([
  [WORKFLOW.BILL_ADD_NF, true],
  [WORKFLOW.DIRECT_DEBITS_PRIVILEGE_NF, true],
  [WORKFLOW.DIRECT_DEBITS_FILE_UPLOAD_NF, true],
  [WORKFLOW.BALANCE_CERTIFICATE_NF, true],
  [WORKFLOW.HAJJ_UMRAD_OPERATION, true],
  [WORKFLOW.HAJJ_UMRAD_ALLOCATION, true],
  [WORKFLOW.POSITIVE_PAY_CHEQUE_PRIVILEGE_NF, true],
  [WORKFLOW.REQUEST_CHEQUE_BOOK_PRIVILEGE_NF, true],
  [WORKFLOW.REQUEST_CHEQUE_BOOK_STOP, true],
  [WORKFLOW.WITHIN_ALRAJHI_BENEFICIARIES_NF, true],
  [WORKFLOW.LOCAL_BANK_BENEFICIARIES_NF, true],
  [WORKFLOW.INTERNATIONAL_BANK_BENEFICIARIES_NF, true],
  [WORKFLOW.PAYROLL_CARDS_NF, true],
  [WORKFLOW.PARYOLL_CARDS_PAYMENT_NF, true],
  [WORKFLOW.PAYROLL_CARDS_UPLOAD_NF, true],
  [WORKFLOW.PAYROLL_CARDS_OPERATION_NF, true],
  [WORKFLOW.BILL_PAYMENTS, false],
  [WORKFLOW.ARAMCO_PAYMENT, false],
  [WORKFLOW.BULK_PAYMENT, false],
  [WORKFLOW.GOVERNMENT_SADAD_REFUND, false],
  [WORKFLOW.GOVERNMENT_SADAD_PAYMENT, false],
  [WORKFLOW.SADAD_INVOICE_HUB, false],
  [WORKFLOW.STANDING_ORDERS, false],
  [WORKFLOW.INTERNATIONAL_TRANSFERS, false],
  [WORKFLOW.LOCAL_TRANSFERS, false],
  [WORKFLOW.WITHIN_ALRAJHI_TRANSFERS, false],
  [WORKFLOW.TRANSFER_GOVERNMENT_REVENUE, false],
  [WORKFLOW.PAYROLL, false],
  [WORKFLOW.PAYROLL_FILE_UPLOAD, false],
  [WORKFLOW.COMMERCIAL_CARD, false],
  [WORKFLOW.PREPAID_CARDS, false],
])

export const WORKFLOWS_BY_PENDING_ACTION_MAP: Map<PENDING_ACTION, WORKFLOW[]> =
  new Map<PENDING_ACTION, WORKFLOW[]>([
    [
      PENDING_ACTION.BILL_PAYMENTS,
      [WORKFLOW.BILL_PAYMENTS, WORKFLOW.BILL_ADD_NF],
    ],
    [PENDING_ACTION.ARAMCO_PAYMENTS, [WORKFLOW.ARAMCO_PAYMENT]],
    [
      PENDING_ACTION.TRANSFERS,
      [
        WORKFLOW.INTERNATIONAL_TRANSFERS,
        WORKFLOW.LOCAL_TRANSFERS,
        WORKFLOW.WITHIN_ALRAJHI_TRANSFERS,
      ],
    ],
    [PENDING_ACTION.STANDING_ORDERS, [WORKFLOW.STANDING_ORDERS]],
    [
      PENDING_ACTION.BENEFICIARIES,
      [
        WORKFLOW.WITHIN_ALRAJHI_BENEFICIARIES_NF,
        WORKFLOW.LOCAL_BANK_BENEFICIARIES_NF,
        WORKFLOW.INTERNATIONAL_BANK_BENEFICIARIES_NF,
      ],
    ],
    [PENDING_ACTION.BULK_PAYMENTS, [WORKFLOW.BULK_PAYMENT]],
    [
      PENDING_ACTION.MOI_PAYMENTS,
      [WORKFLOW.GOVERNMENT_SADAD_REFUND, WORKFLOW.GOVERNMENT_SADAD_PAYMENT],
    ],
    [
      PENDING_ACTION.HAJJ_UMRAH_CARDS,
      [WORKFLOW.HAJJ_UMRAD_OPERATION, WORKFLOW.HAJJ_UMRAD_ALLOCATION],
    ],
    [
      PENDING_ACTION.DIRECT_DEBITS,
      [
        WORKFLOW.DIRECT_DEBITS_PRIVILEGE_NF,
        WORKFLOW.DIRECT_DEBITS_FILE_UPLOAD_NF,
      ],
    ],
    [PENDING_ACTION.ESAL, [WORKFLOW.SADAD_INVOICE_HUB]],
    [PENDING_ACTION.BALANCE_CERTIFICATE, [WORKFLOW.BALANCE_CERTIFICATE_NF]],
    [
      PENDING_ACTION.CHEQUE_BOOK_MANAGEMENT,
      [
        WORKFLOW.POSITIVE_PAY_CHEQUE_PRIVILEGE_NF,
        WORKFLOW.REQUEST_CHEQUE_BOOK_PRIVILEGE_NF,
        WORKFLOW.REQUEST_CHEQUE_BOOK_STOP,
      ],
    ],
    [
      PENDING_ACTION.GOVERNMENT_REVENUE_TRANSFER,
      [WORKFLOW.TRANSFER_GOVERNMENT_REVENUE],
    ],
    [PENDING_ACTION.PAYROLL, [WORKFLOW.PAYROLL, WORKFLOW.PAYROLL_FILE_UPLOAD]],
    [
      PENDING_ACTION.WPS_PAYROLL,
      [WORKFLOW.WPS_WMS_PAYROLL, WORKFLOW.WPS_WMS_PAYROLL_FILE_UPLOAD],
    ],
    [
      PENDING_ACTION.WMS_PAYROLL,
      [WORKFLOW.WPS_WMS_PAYROLL, WORKFLOW.WPS_WMS_PAYROLL_FILE_UPLOAD],
    ],
    [
      PENDING_ACTION.PAYROLL_CARDS,
      [
        WORKFLOW.PAYROLL_CARDS_NF,
        WORKFLOW.PARYOLL_CARDS_PAYMENT_NF,
        WORKFLOW.PAYROLL_CARDS_OPERATION_NF,
        WORKFLOW.PAYROLL_CARDS_UPLOAD_NF,
      ],
    ],
    [PENDING_ACTION.COMMERCIAL_CARDS, [WORKFLOW.COMMERCIAL_CARD]],
    [PENDING_ACTION.PREPAID_CARDS, [WORKFLOW.PREPAID_CARDS]],
  ])

@Component({
  selector: 'app-workflow-details-popup',
  templateUrl: './workflow-details-popup.component.html',
})
export class WorkflowDetailsPopupComponent implements OnInit {
  @ViewChild('workflowDetailsPopUp', { static: true })
  public modal: ModalDirective
  public title: string

  public init: boolean

  public isReadOnly: boolean = true
  public workflowsNonFinancial: WORKFLOW[] = []
  public workflowsFinancial: WORKFLOW[] = []

  public workflowDetailTables: WorkflowData[] = []
  public accounts: any[] = []
  public defaultAccount: string

  public showAccountSelection: boolean
  public accountSelectionSubscription: Subscription
  public form: FormGroup

  constructor(
    public fb: FormBuilder,
    public workflowDetailsService: WorkflowDetailsService,
  ) {
    this.form = this.fb.group({
      account: null,
      financialWorkflows: this.fb.array([]),
      nonFinancialWorkflows: this.fb.array([]),
    })
  }

  ngOnInit() {}

  setAccount(defaultAccount: string) {
    this.defaultAccount = defaultAccount
  }

  openModal(
    workflows: WORKFLOW[],
    relatedPendingAction?: PENDING_ACTION,
    workflowTitlePrefix?: string,
  ) {
    this.title = relatedPendingAction.toLowerCase()
    this.form.reset()

    workflows.forEach((workflow) => {
      const isNonFinancial = WORKFLOW_IS_NON_FINANCIAL.get(workflow)
      if (isNonFinancial) {
        this.workflowsNonFinancial.push(workflow)
      } else {
        this.showAccountSelection = true
        this.workflowsFinancial.push(workflow)
      }
    })

    this.setUpWorkflows(workflowTitlePrefix).subscribe(() => {
      if (!!this.workflowsFinancial && this.workflowsFinancial.length > 0) {
        this.accountSelectionSubscription = this.form
          .get('account')
          .valueChanges.subscribe((newAccount) => {
            this.modal.hide()
            this.workflowDetailsService
              .getFinancialWorkflows(newAccount, this.workflowsFinancial)
              .subscribe((financialWorkflows) => {
                const financialWorkflowsFormArray = this.form.get(
                  'financialWorkflows',
                ) as FormArray
                financialWorkflowsFormArray.clear()
                const newWorkflowDetailTables =
                  this.workflowDetailTables.filter((w) =>
                    WORKFLOW_IS_NON_FINANCIAL.get(w.workflow),
                  )
                financialWorkflows.workflowList.map((fwf) => {
                  const workflow = fwf.paymentId as WORKFLOW
                  const newTable = this.createWorkflowDetailTable(
                    workflow,
                    fwf.details,
                    workflowTitlePrefix,
                  )
                  financialWorkflowsFormArray.push(newTable.formGroup)
                  newWorkflowDetailTables.push(newTable)
                })
                this.workflowDetailTables = newWorkflowDetailTables
                this.sortTables()
                this.modal.show()
              })
          })
      }
      this.init = true
      this.modal.show()
    })
  }

  setUpWorkflows(workflowTitlePrefix: string) {
    return new Observable((observer) => {
      iif(
        () => !!this.workflowsFinancial && this.workflowsFinancial.length > 0,
        this.workflowDetailsService.getUserAccounts(),
        of(null),
      ).subscribe((userAccounts) => {
        if (userAccounts) {
          this.accounts = userAccounts

          this.form
            .get('account')
            .setValue(userAccounts[0].fullAccountNumber, { emitEvent: false })
          if (!!this.defaultAccount) {
            const foundAccount = userAccounts.find(
              (ua) => ua.fullAccountNumber === this.defaultAccount,
            )
            if (!!foundAccount) {
              this.form
                .get('account')
                .setValue(foundAccount.fullAccountNumber, { emitEvent: false })
              this.form.get('account').disable({ emitEvent: false })
            } else {
              this.form.get('account').enable({ emitEvent: false })
            }
          } else {
            this.form.get('account').enable({ emitEvent: false })
          }
        }

        zip(
          iif(
            () =>
              !!this.workflowsFinancial && this.workflowsFinancial.length > 0,
            this.workflowDetailsService.getFinancialWorkflows(
              this.form.get('account').value,
              this.workflowsFinancial,
            ),
            of(null),
          ),
          iif(
            () =>
              !!this.workflowsNonFinancial &&
              this.workflowsNonFinancial.length > 0,
            this.workflowDetailsService.getNonFinancialWorkflows(
              this.workflowsNonFinancial,
            ),
            of(null),
          ),
        ).subscribe(([financialWorkflows, nonFinancialWorkflows]) => {
          if (!!financialWorkflows) {
            const parsedFinancialWorkflows =
              financialWorkflows as FinancialWorkflowsResponse
            parsedFinancialWorkflows.workflowList.map((fwf) => {
              const workflow = fwf.paymentId as WORKFLOW
              const newTable = this.createWorkflowDetailTable(
                workflow,
                fwf.details,
                workflowTitlePrefix,
              )
              ;(this.form.get('financialWorkflows') as FormArray).push(
                newTable.formGroup,
              )
              this.workflowDetailTables.push(newTable)
            })
          }

          if (!!nonFinancialWorkflows) {
            const parsedNonFinancialWorkflows =
              nonFinancialWorkflows as NonFinancialWorkflowsResponse
            parsedNonFinancialWorkflows.workflowList.map((nfwf) => {
              const workflow = nfwf.paymentId as WORKFLOW
              const newTable = this.createWorkflowDetailTable(
                workflow,
                [{ levels: nfwf.levels }],
                workflowTitlePrefix,
              )
              ;(this.form.get('nonFinancialWorkflows') as FormArray).push(
                newTable.formGroup,
              )
              this.workflowDetailTables.push(newTable)
            })
          }

          this.sortTables()

          observer.next()
          observer.complete()
        })
      })
    })
  }

  createWorkflowDetailTable(
    workflow: WORKFLOW,
    data: { levels: boolean[]; amountMin?: number; amountMax?: number }[],
    titlePrefix?: string,
  ): WorkflowData {
    const formGroup = this.fb.group({
      tiers: this.fb.array([]),
    })

    data.forEach((e) => {
      const newFG = this.fb.group({
        levels: this.fb.array(
          e.levels.map((level) => ({
            value: level,
            disabled: this.isReadOnly,
          })),
        ),
      })
      if (!!e.amountMin && !!e.amountMax) {
        newFG.addControl(
          'amountMin',
          this.fb.control({ value: e.amountMin, disabled: this.isReadOnly }),
        )
        newFG.addControl(
          'amountMax',
          this.fb.control({ value: e.amountMax, disabled: this.isReadOnly }),
        )
      }
      ;(formGroup.get('tiers') as FormArray).push(newFG)
    })

    return {
      titlePrefix,
      workflow,
      formGroup,
      showAmountInterval: (formGroup.get('tiers') as FormArray).controls.some(
        (c) => !!c.get('amountMin') && !!c.get('amountMax'),
      ),
    }
  }

  sortTables() {
    this.workflowDetailTables.sort((a, b) => {
      if (a.showAmountInterval) {
        return -1
      }
      if (b.showAmountInterval) {
        return 1
      }
      return 0
    })
  }

  close() {
    this.init = false
    this.isReadOnly = true
    this.workflowsNonFinancial = []
    this.workflowsFinancial = []
    this.workflowDetailTables = []
    this.accounts = []
    this.showAccountSelection = false
    if (!!this.accountSelectionSubscription) {
      this.accountSelectionSubscription.unsubscribe()
      this.accountSelectionSubscription = undefined
    }
    this.form.reset()
    this.modal.hide()
  }
}
