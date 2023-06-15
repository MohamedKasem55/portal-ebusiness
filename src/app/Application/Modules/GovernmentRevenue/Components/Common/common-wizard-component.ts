import { Directive, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormArray, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Exception } from 'app/Application/Model/exception'
import { Account } from '../../../../Model/account'
import { AbstractWizardComponent } from '../../../Common/Components/Abstract/abstract-wizard.component'
import { StaticService } from '../../../Common/Services/static.service'
import { DepositorOriginator } from '../../Model/depositor-originator'
import { GovRevenueBatchDSO, RevenueDetail } from '../../Model/gov-revenue-batch'
import { RevenueAccount } from '../../Model/revenue-account'
import { GovernmentRevenueService } from '../../Services/government-revenue.service'
import { compareDepositor, totalAmountValidator } from './gov-revenue-utils'
import { WizardStep1Component } from './wizard-step-1.component'
import { WizardStep2Component } from './wizard-step-2.component'

@Directive()
export abstract class CommonWizardComponent
  extends AbstractWizardComponent
  implements OnInit, OnDestroy {
  @ViewChild('authorization') authorization: any
  @ViewChild(WizardStep1Component) step1: WizardStep1Component
  @ViewChild(WizardStep2Component) step2: WizardStep2Component
  pageErrorMessage: any
  govRevenueAccountsList: RevenueAccount[]
  companyDepositorsList: DepositorOriginator[]
  depositorsList: DepositorOriginator[] = []
  accountsList: Account[]
  govRevenueBankCodeList: any[]

  constructor(
    public fb: FormBuilder,
    public translate: TranslateService,
    public router: Router,
    public staticService: StaticService,
    public govRevService: GovernmentRevenueService
  ) {
    super(fb, translate, router)
    this.formModel = this.fb.group(
      {
        accountFrom: ['', Validators.required],
        totalAmount: [
          '',
          [
            Validators.required,
            Validators.pattern('^[0-9]*.?[0-9]*$'),
            Validators.min(0),
          ],
        ],
        beneficiaryBank: ['', Validators.required],
        letterNumber: ['', Validators.required],
        letterDate: ['', Validators.required],
        letterPeriodFrom: ['', Validators.required],
        letterPeriodTo: ['', Validators.required],
        finclosingyear: ['', Validators.maxLength(35)],
        beneficiaryOriginator: ['', Validators.required],
        depositorOriginator: ['', Validators.required],
        subAccountAmounts: this.fb.array([]),
      },
      { validators: totalAmountValidator },
    )
  }

    ngOnInit() {
        super.ngOnInit()
        this.refreshData()
    }

    refreshData() {
        const comboKey = 'govRevenueSingleBankCodes'
        this.subscriptions.push(
            this.staticService
                .getAllCombosAsArrays([comboKey], true)
                .subscribe((result) => {
                    if (result === null) {
                        this.onError(result)
                    } else {
                        this.govRevenueBankCodeList = result[comboKey]
                    }
                }),
        )
    }

    get subAccountAmounts(): FormArray {
        return this.formModel.get('subAccountAmounts') as FormArray
    }

    addSubAccountAmount(revenueDetail?: RevenueDetail) {
        this.subAccountAmounts.push(
            this.fb.group({
                revenueAccountPk: [
                    revenueDetail ? revenueDetail.revenueAccount.govRevenueAccountPk : '',
                    [Validators.required],
                ],
                detail: [
                    revenueDetail ? revenueDetail.revenueAccount.revenueAccountName : '',
                ],
                amount: [
                    revenueDetail ? revenueDetail.amount : '',
                    [
                        Validators.required,
                        Validators.pattern('^[0-9]*.?[0-9]*$'),
                        Validators.min(0),
                    ],
                ],
            }),
        )
    }

  removeSubAccountAmount(index?) {
    if (
      typeof index === 'undefined' ||
      index === null ||
      typeof index !== 'number'
    ) {
      // variable is undefined or null or not a number
      while (this.subAccountAmounts.length !== 0) {
        this.subAccountAmounts.removeAt(0)
      }
    } else {
      for(let i = index; i< this.subAccountAmounts.controls.length -1; i++) {
        this.subAccountAmounts.controls[i].setValue(this.subAccountAmounts.value[i + 1])
      }
      this.subAccountAmounts.removeAt(this.subAccountAmounts.length -1)
        }
    }

    onBeneficiaryOriginatorChange(selectedBeneficiary) {
        if (selectedBeneficiary) {
            this.subscriptions.push(
                this.govRevService.getDepositorsByChapter(selectedBeneficiary.chapter)
                    .subscribe((result) => {
                        if (
                            result.hasOwnProperty('errorCode') &&
                            <any>result instanceof Exception
                        ) {
                            this.onError(result)
                        } else {
                            this.depositorsList.splice(0, this.depositorsList.length)
                            this.formModel.get('depositorOriginator').patchValue('')
                            this.depositorsList = [...result.depositors];
                        }
                    }),
            )
        }
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
                finclosingyear: this.govRevService.dateFormatter.parse(
                    batch.finClosingYear,
                ),
                beneficiaryOriginator: batch.beneficiaryOriginator,
                depositorOriginator: batch.depositorOriginator,
            },
            {onlySelf: true, emitEvent: false},
        )
        this.removeSubAccountAmount()
        batch.details.forEach((revenueDetail: RevenueDetail) => {
            this.addSubAccountAmount(revenueDetail)
        })
    }

    onError(result: Exception) {
        this.pageErrorMessage = {
            code: result.errorCode,
            description: result.errorDescription,
        }
    }

    clearForm() {
        this.removeSubAccountAmount()
        super.clearForm()
    }

    getWizardStepsCount() {
        return 3
    }

    validAuthorization() {
        if (this.authorization == null) {
            return true
        } else {
            return this.authorization.valid()
        }
    }

    onInitStep(step, events) {
        switch (step) {
            case 1:
                this.step1 = events
                break
            case 2:
                this.step2 = events
                break
        }
    }
}
