import { Component, OnInit, Injector, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Subscription } from 'rxjs'
import { Router } from '@angular/router'
import { StaticService } from '../../Common/Services/static.service'

import { Exception } from '../../../Model/exception'
import { Step1Component } from './Steps/step1/step1.component'
import { Step2Component } from './Steps/step2/step2.component'
import { Step3Component } from './Steps/step3/step3.component'
import { Step4Component } from './Steps/step4/step4.component'
import { PoSStatementService } from '../pos-statement.service'

@Component({
  selector: 'app-terminaldetails',
  templateUrl: './terminaldetails.component.html',
  styleUrls: ['./terminaldetails.component.scss'],
})
export class TerminaldetailsComponent implements OnInit {
  @ViewChild(Step1Component, { static: true })
  step1Request: Step1Component
  @ViewChild(Step2Component, { static: true })
  step2Request: Step2Component
  @ViewChild(Step3Component, { static: true })
  step3Request: Step3Component
  @ViewChild(Step4Component, { static: true })
  step4Request: Step4Component

  form: FormGroup
  cardsallocFormData: any
  step: number
  option: string
  subscriptions: Subscription[] = []
  mensajeError: any = {}
  getDTOData: any
  getuserDTOData: any
  cities: any = []
  terminalDetailsData
  editdata

  constructor(
    public fb: FormBuilder,
    private injector: Injector,
    public posService: PoSStatementService,
    public staticService: StaticService,
    private router: Router,
  ) {
    this.step = 1
    this.form = this.fb.group({
      name: ['', Validators.required],
      city: ['', Validators.required],
      location: ['', Validators.required],
      location2: ['', Validators.required],
      telephone: ['', Validators.required],
      mobile: ['', Validators.required],
      fax: ['', Validators.required],
      email: ['', Validators.required],
      pobox: [''],
      zipCode: [''],
    })
  }

  ngOnInit() {
    this.terminalDetailsData = this.posService.getTerminalDetails()
    this.form.controls.name.setValue(this.terminalDetailsData.name)
    this.form.controls.city.setValue(this.terminalDetailsData.city)
    this.form.controls.location.setValue(this.terminalDetailsData.location)
    this.form.controls.location2.setValue(this.terminalDetailsData.location2)
    this.form.controls.telephone.setValue(this.terminalDetailsData.telephone)
    this.form.controls.mobile.setValue(this.terminalDetailsData.mobile)
    this.form.controls.fax.setValue(this.terminalDetailsData.fax)
    this.form.controls.email.setValue(this.terminalDetailsData.email)
    this.form.controls.pobox.setValue(this.terminalDetailsData.pobox)
    this.form.controls.zipCode.setValue(this.terminalDetailsData.zipCode)
  }

  isDisabled() {
    return !this.form.valid
  }

  next() {
    switch (this.step) {
      case 1:
        break
      case 2:
        this.nextStep()
        break
      case 3:
        this.nextStep()
        break
    }
  }

  confirmPage() {
    const data = {
      name: this.form.controls['name'].value,
      city: this.form.controls['city'].value,
      location: this.form.controls['location'].value,
      location2: this.form.controls['location2'].value,
      telephone: this.form.controls['telephone'].value,
      mobile: this.form.controls['mobile'].value,
      fax: this.form.controls['fax'].value,
      email: this.form.controls['email'].value,
      pobox: this.form.controls['pobox'].value,
      zipCode: this.form.controls['zipCode'].value,
      region: this.terminalDetailsData.region,
      terminalId: this.terminalDetailsData.terminalId,
      cityCode: this.step1Request.city,
    }
    //console.log(JSON.stringify(data));

    this.subscriptions.push(
      this.posService.confirmUpdateTerminal(data).subscribe((result: any) => {
        if (
          (result.hasOwnProperty('error') &&
            (<any>result).error instanceof Exception) ||
          result.batch == null
        ) {
          this.onError(result)
          return
        } else {
          this.finish()
        }
      }),
    )
  }

  finish() {
    this.step = 1
    this.router.navigate(['/hajjandumrahcards/cardallocationrequest'])
    this.clear()
  }

  nextStep() {
    this.step = ++this.step % 4
    if (this.step === 0) {
      this.step = 1
      this.option = null
    }
  }

  previous() {
    this.step = --this.step % 4
    if (this.step === 0) {
      this.step = 1
      this.option = null
    }
  }

  clear() {
    this.form.reset()
    this.router.navigate(['/posstatement/pos-terminal'])
  }

  onInitStep1(events) {
    this.step1Request = events
  }

  onInitStep2(events) {
    this.step2Request = events
  }

  onInitStep3(events) {
    this.step3Request = events
  }

  onError(error: any) {
    const res = error
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }
}
