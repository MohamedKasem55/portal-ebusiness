import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { AuthenticationService } from '../../../../../core/security/authentication.service'

@Component({
  selector: 'app-add-payer-step1',
  templateUrl: './add-payer-step1.component.html',
  styleUrls: ['./add-payer.component.scss'],
})
export class AddPayerStep1Component implements OnInit, OnDestroy {
  @Input() form: FormGroup
  @Input() banks: any
  @Input() banksCodes: any

  mensajeError: any = {}
  subscriptions: Subscription[] = []

  banksMap: Map<string, string> = new Map<string, string>()
  banksCodeMap: Map<string, string> = new Map<string, string>()

  constructor(
    private fb: FormBuilder,
    public router: Router,
    public authenticationService: AuthenticationService,
  ) {}

  ngOnInit() {
    for (let i = this.banks.length - 1; i >= 0; i--) {
      this.banksMap.set(this.banks[i].key, this.banks[i].value)
    }
    for (let i = this.banksCodes.length - 1; i >= 0; i--) {
      this.banksCodeMap.set(this.banksCodes[i].key, this.banksCodes[i].value)
    }
    //console.log(this.banksCodeMap);
    if (!((this.form.controls['elements'] as FormArray).length > 0)) {
      this.addElement()
    }
  }

  createElementForm(form: FormGroup) {
    const control = form.controls['elements'] as FormArray
    control.push(this.initForm())
  }

  initForm() {
    const formElement = this.fb.group({
      mandate: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(21)]),
      ],
      personalName: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(60)]),
      ],
      account: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(24)]),
      ],
      amount: [null, Validators.compose([Validators.required])],
      bank: ['', Validators.required],
      personalAddress1: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      description1: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      personalAddress2: [null, Validators.compose([Validators.maxLength(50)])],
      description2: [null, Validators.compose([Validators.maxLength(50)])],
    })

    formElement.controls.bank.valueChanges.subscribe((value) => {
      if (value == 'RJHI') {
        formElement.controls.account.clearValidators()
        formElement.controls.account.setValidators([
          Validators.required,
          Validators.pattern('([0-9]{15}|[0-9]{17}|[0-9]{21})'),
        ])
        formElement.controls.account.updateValueAndValidity()
      } else {
        formElement.controls.account.clearValidators()
        formElement.controls.account.setValidators([Validators.required])
        formElement.controls.account.updateValueAndValidity()
      }
    })

    return formElement
  }

  getBank(code) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.banks.length; ++i) {
      if (this.banks[i].key == code) {
        return this.banks[i]
      }
    }
    return null
  }

  addElement() {
    this.createElementForm(this.form)
  }

  removeElement(index) {
    const control = this.form.controls['elements'] as FormArray
    control.removeAt(index)
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  onError(error: any) {
    const res = error
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }
}
