import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormControl } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Exception } from '../../../../../Model/exception'
import { StaticService } from '../../../../Common/Services/static.service'
import { CommonWizardComponent } from '../../Common/common-wizard-component'
import { RevenueAccount } from '../../../Model/revenue-account'
import { GovernmentRevenueService } from '../../../Services/government-revenue.service'
import { BehaviorSubject } from 'rxjs'
import { distinctUntilChanged } from 'rxjs/operators'
import { GovRevenueBatchDSO, RevenueDetail } from '../../../Model/gov-revenue-batch'
import { PendingActionsNotificaterService } from '../../../../Common/Components/PendingActions/pending-actions-notificater.service'

@Component({
  selector: 'app-government-revenue-reactivate',
  templateUrl: './request-reactivate.component.html',
})
export class RequestReactivateComponent
  extends CommonWizardComponent
  implements OnInit, OnDestroy {
  // initialResponse: any = {};
  private _initialResponse: BehaviorSubject<any> = new BehaviorSubject<any>({})
  option: OptionType
  OptionType = OptionType
  refused: string

  constructor(
    public fb: FormBuilder,
    public translate: TranslateService,
    public router: Router,
    public staticService: StaticService,
    public govRevService: GovernmentRevenueService,
    private pendingActionNotification: PendingActionsNotificaterService,
  ) {
    super(fb, translate, router, staticService, govRevService)
    this.formModel.addControl('rejectedReason', new FormControl(''))
  }

  get initialResponse() {
    return this._initialResponse.getValue()
  }

  ngOnInit() {
    super.ngOnInit()
    this.refreshData()
    const previousPayment = this.govRevService.previousPayment
    this.refused = previousPayment.status
    if (previousPayment) {
      this.subscriptions.push(
        this.govRevService
          .detailRequestStatus(previousPayment)
          .subscribe((result) => {
            if (this.hasError(result)) {
              this.onError(result)
              return
            } else {
              this._initialResponse.next(result)
              this.govRevenueAccountsList = result.govRevenueAccountsList
              this.accountsList = result.listInitiateAccountDTO
              this.companyDepositorsList = result.companyDepositors
              this.depositorsList = result.depositorsList
              this.formModel
                .get('rejectedReason')
                .patchValue(this.initialResponse.batch.rejectedReason)
            }
          }),
      )
    } else {
      this.back()
    }

    this.subscriptions.push(
      this._initialResponse
        .asObservable()
        .pipe(distinctUntilChanged())
        .subscribe((result) => {
          if (!!result.batch) {
            this.setFormValues(result.batch)
            const fields = [
              'accountFrom',
              'totalAmount',
              'beneficiaryBank',
              'letterNumber',
              'letterDate',
              'letterPeriodFrom',
              'letterPeriodTo',
              'finclosingyear',
              'beneficiaryOriginator',
              'depositorOriginator',
            ]
            if (this.refused != "R") {
              fields.forEach((field) => {
                this.formModel.get(field).disable()
              })
            }
          }
        }),
    )
  }

  setFormValues(batch: GovRevenueBatchDSO) {
    this.formModel.patchValue(
      {
        accountFrom: batch.accountNumber,
        totalAmount: batch.totalAmount,
        beneficiaryBank: batch.beneficiaryBank,
        letterNumber: batch.letterNumber,
        letterDate: this.govRevService.dateFormatter.parse(batch.valueDate),
        letterPeriodFrom: this.govRevService.dateFormatter.parse(
          batch.letterPeriodFrom,
        ),
        letterPeriodTo: this.govRevService.dateFormatter.parse(
          batch.letterPeriodTo,
        ),
        finclosingyear: batch.finClosingYear,
        beneficiaryOriginator: batch.beneficiaryOriginator,
        depositorOriginator: batch.depositorOriginator,
      },
      { onlySelf: true, emitEvent: false },
    )
    this.removeSubAccountAmount()
    batch.details.forEach((revenueDetail: RevenueDetail) => {
      this.addSubAccountAmount(revenueDetail)
    })
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  next() {
    this.pageErrorMessage = null
    switch (this.wizardStep) {
      case 1:
        switch (this.option) {
          case OptionType.DELETE:
            this.validationResponse = this.initialResponse
            this.markNextWizardStep()
            break
          case OptionType.REINITIATE:
            this.subscriptions.push(
              this.govRevService
                .initiateRequestStatus({ batch: this.buildInitiateRequest() })
                .subscribe((result) => {
                  if (this.hasError(result)) {
                    this.onError(result)
                    return
                  } else {
                    this.validationResponse = result
                    this.markNextWizardStep()
                  }
                }),
            )
            break
        }
        break
      case 2:
        switch (this.option) {
          case OptionType.DELETE:
            this.subscriptions.push(
              this.govRevService
                .deleteRequestStatus({ batch: this.validationResponse.batch })
                .subscribe((result) => {
                  if (this.hasError(result)) {
                    this.onError(result)
                    return
                } else {
                    this.confirmResponse = result
                    this.markNextWizardStep()
                  }
                }),
            )
            break
          case OptionType.REINITIATE:
            this.subscriptions.push(
              this.govRevService
                .reInitiateRequestStatus(
                  this.validationResponse.batch,
                  this.requestValidate,
                )
                .subscribe((result) => {
                  if (this.hasError(result)) {
                    this.onError(result)
                    return
                } else {
                    this.confirmResponse = result
                    this.pendingActionNotification
                      .getRefreshObserver()
                      .next(true)
                    this.markNextWizardStep()
                  }
                }),
            )
            break
        }
        break
    }
  }

  isDisabled() {
    return !(this.formModel && this.formModel.valid)
  }

  isRejected() {
    return (this.refused == "R")
  }

  get securityLevelsDTOList(): any {
    switch (this.wizardStep) {
      case 1:
        if (this.initialResponse.batch) {
          return this.initialResponse.batch.securityLevelsDTOList
        }
        break
      case 2:
        if (this.validationResponse.batch) {
          switch (this.option) {
            case OptionType.DELETE:
              return this.validationResponse.batch.securityLevelsDTOList
            case OptionType.REINITIATE:
              return this.validationResponse.batch.futureSecurityLevelsDTOList
          }
        }
        break
    }
    return null
  }

  delete() {
    this.option = OptionType.DELETE
    this.next()
  }

  reInitiate() {
    this.option = OptionType.REINITIATE
    this.next()
  }

  finish() {
    this.back()
  }
  back() {
    this.router.navigate(['/government-revenue/request-status'])
  }

  buildInitiateRequest(): Object {
    const returnBatch = JSON.parse(JSON.stringify(this.initialResponse.batch))
    const detailList = []
    for (const control of this.subAccountAmounts.controls) {
      const amount: number = +control.get('amount').value
      const revenueAccountPk = control.get('revenueAccountPk').value
      const revAccount: RevenueAccount = this.govRevenueAccountsList.find(
        (value) => value.govRevenueAccountPk == revenueAccountPk,
      )
      const revenueDetail = {
        amount,
        revenueAccount: revAccount,
      }
      detailList.push(revenueDetail)
    }
    returnBatch.accountNumber = this.formModel.get('accountFrom').value
    returnBatch.beneficiaryBank = this.formModel.get('beneficiaryBank').value
    returnBatch.beneficiaryOriginatorSelected = this.formModel.get(
      'beneficiaryOriginator',
    ).value
    returnBatch.depositorOriginatorSelected = this.formModel.get(
      'depositorOriginator',
    ).value
    returnBatch.finclosingyear = this.formModel.get('finclosingyear').value
    returnBatch.letterNumber = this.formModel.get('letterNumber').value
    returnBatch.letterperiodfrom = this.govRevService.dateFormatter.format(
      this.formModel.get('letterPeriodFrom').value,
    )
    returnBatch.letterperiodto = this.govRevService.dateFormatter.format(
      this.formModel.get('letterPeriodTo').value,
    )
    returnBatch.totalAmount = +this.formModel.get('totalAmount').value
    returnBatch.valueDate = this.govRevService.dateFormatter.format(
      this.formModel.get('letterDate').value,
    )
    returnBatch.details = detailList
    return returnBatch
  }

  valid() {
    return true
  }
}

export enum OptionType {
  DELETE = 'delete',
  REINITIATE = 'reinitiate',
}
