import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { Account } from '../../../../Model/account'
import { Company } from '../../../../Model/company'
import {
  DepositorOriginator,
  OriginatorType
} from '../../Model/depositor-originator'
import { RevenueAccount } from '../../Model/revenue-account'
import { GovernmentRevenueService } from '../../Services/government-revenue.service'
import { compareDepositor } from './gov-revenue-utils'

@Component({
  selector: 'app-gov-revenue-payment-step1',
  templateUrl: './wizard-step-1.component.html',
})
export class WizardStep1Component implements OnInit {
  @Input() viewForm: FormGroup
  @Input() accounts: Account[]
  @Input() beneficiaryOriginators: DepositorOriginator[]
  @Input() filteredOriginators: DepositorOriginator[]
  @Input() revenueAccounts: RevenueAccount[]
  @Input() banks: any[]
  @Input() pageErrorMessage: any
  @Input() securityLevelsDTOList: any
  @Input() revenueAccounteditView = true
  @Input() detailsView: boolean


  @Output() onInit = new EventEmitter<Component>()
  @Output() removeSubAccount: EventEmitter<number> = new EventEmitter<number>()
  @Output() addSubAccount: EventEmitter<boolean> = new EventEmitter<boolean>()
  @Output()
  beneficiaryChange: EventEmitter<DepositorOriginator> = new EventEmitter<DepositorOriginator>()
  company: Company
  compareDepositor: Function = compareDepositor
  public ordDep: OriginatorType = OriginatorType.DEPOSITOR
  public origBenef: OriginatorType = OriginatorType.BENEFICIARY
  OriginatorType = OriginatorType

  constructor(
    private fb: FormBuilder,
    private govRevenueService: GovernmentRevenueService,
    private translateService: TranslateService,
  ) {}

  ngOnInit() {
    this.company = this.govRevenueService.company
    this.onInit.emit(this as Component)
  }

  get subAccountAmounts(): FormArray {
    return this.viewForm.get('subAccountAmounts') as FormArray
  }

  onBeneficiaryChange(selected) {
    this.beneficiaryChange.emit(selected)
  }

  showLabelSelect(item, label_empty) {
    if (typeof item !== 'undefined' && item !== '' && item !== null) {
      return item.depositorOriginatorName
    } else {
      return '--' + this.translateService.instant(label_empty) + '--'
    }
  }

  getDateControlValue(controlName): any {
    return this.govRevenueService.dateFormatter.format(
      this.viewForm.controls[controlName].value,
    )
  }
}
