import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { AddBeneficiaryService } from '../../../../Services/add-aramco-beneficiary/add-beneficiary.service'

@Component({
  templateUrl: './step1.component.html',
})
export class Step1Component implements OnInit {
  step = 1
  sharedData: any = {}
  temporal: any
  form: FormGroup

  constructor(
    private service: AddBeneficiaryService,
    public translate: TranslateService,
    private fb: FormBuilder,
  ) {
    this.form = fb.group({
      passNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(0),
          Validators.maxLength(10),
        ],
      ],
    })
  }

  savePassNumber() {
    this.sharedData.passNumber = this.form.get('passNumber').value
  }

  ngOnInit(): void {
    //borrar cuando haya servicios
  }

  valid() {
    return this.form.valid
  }
}
