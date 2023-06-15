import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { NewPaymentService } from '../../new-payment.service'
import { DecimalPipe } from '@angular/common'

@Component({
  templateUrl: './step2.component.html',
})
export class Step2Component implements OnInit {
  step = 2
  sharedData: any = {}
  form: FormGroup

  subscriptions: Subscription[] = []
  transfersLimit: any[] = []

  constructor(
    private service: NewPaymentService,
    public translate: TranslateService,
    public router: Router,
    private fb: FormBuilder,
    @Inject(LOCALE_ID) private locale: string,
  ) {}

  ngOnInit(): void {}

  setBalanceLimit(index, target) {
    if (target && target.value) {
      const formArray = <FormArray>this.form.controls['beneficiaries']
      const beneficiarios = <FormGroup>formArray.controls[index]

      beneficiarios.controls['amount'].clearValidators()
      beneficiarios.controls['amount'].setValidators([
        Validators.required,
        Validators.min(0),
        Validators.max(
          this.sharedData.accounts[target.value].value.availableBalance,
        ),
        Validators.pattern('^[0-9]*.?[0-9]*$'),
      ])
      beneficiarios.controls['amount'].updateValueAndValidity()
      ;(<FormArray>this.form.controls['beneficiaries']).controls[index] =
        beneficiarios
      this.transfersLimit[index] =
        this.sharedData.accounts[target.value].value.availableBalance
    }
  }

  removeBeneficiary(value) {
    this.sharedData.payments.splice(value, 1)
    ;(<FormArray>this.form.controls.beneficiaries).removeAt(value)
    if (this.sharedData.payments.length == 0) {
      this.router.navigate(['/aramcoPayments/beneficiaries/payment'])
    }
  }

  valid() {
    return this.form && !this.form.valid
  }

  transformAmount(element, index) {
    const decimalPipe = new DecimalPipe(this.locale)
    try {
      const valueInput = element.target.value.replace(/,/g, '')

      this.form.controls.beneficiaries['controls'][index]
        .get('amount')
        .setValue(valueInput)
      element.target.value = decimalPipe.transform(valueInput, '1.2-6')
    } catch (e) {
      this.form.controls.beneficiaries['controls'][index]
        .get('amount')
        .setValue('')
      element.target.value = decimalPipe.transform(0, '1.2-6')
      this.form.controls.beneficiaries['controls'][index]
        .get('amount')
        .setValue(0)
    }
  }
}
