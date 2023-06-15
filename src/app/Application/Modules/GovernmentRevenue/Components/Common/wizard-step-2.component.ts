import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormArray, FormGroup } from '@angular/forms'
import { Company } from '../../../../Model/company'
import { OriginatorType } from '../../Model/depositor-originator'
import { RevenueAccount } from '../../Model/revenue-account'
import { GovernmentRevenueService } from '../../Services/government-revenue.service'

@Component({
  selector: 'app-gov-revenue-payment-step2',
  templateUrl: './wizard-step-2.component.html',
})
export class WizardStep2Component implements OnInit {
  @Input() pageErrorMessage: any
  @Input() sharedForm: FormGroup
  @Input() revenueAccounts: RevenueAccount[]
  @Input() securityLevelsDTOList: any
  @Output() onInit = new EventEmitter<Component>()

  OriginatorType = OriginatorType

  company: Company

  constructor(public govRevService: GovernmentRevenueService) {}

  ngOnInit() {
    this.company = this.govRevService.company
    this.onInit.emit(this as Component)
  }

  getControlValue(controlName): any {
    return this.sharedForm.controls[controlName].value
  }

  getDateControlValue(controlName): any {
    return this.govRevService.dateFormatter.format(
      this.getControlValue(controlName),
    )
  }

  get subAccountAmounts(): FormArray {
    return this.sharedForm.get('subAccountAmounts') as FormArray
  }
}
