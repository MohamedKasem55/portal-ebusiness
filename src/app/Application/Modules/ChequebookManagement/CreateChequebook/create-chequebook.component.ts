import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { StorageService } from '../../../../core/storage/storage.service'
import { CreateChequebookStep1Component } from './create-chequebook-step1.component'
import { CreateChequebookStep2Component } from './create-chequebook-step2.component'
import { CreateChequebookService } from './create-chequebook.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  selector: 'app-create-chequebook',
  templateUrl: './create-chequebook.component.html',
  styleUrls: ['./create-chequebook.component.scss'],
})
export class CreateChequebookComponent implements OnInit, OnDestroy {
  @ViewChild(CreateChequebookStep1Component)
  step1: CreateChequebookStep1Component
  @ViewChild(CreateChequebookStep2Component)
  step2: CreateChequebookStep2Component

  step: number
  option: string

  subscriptions: Subscription[] = []
  mensajeError: any = {}

  generateChallengeAndOTP: ResponseGenerateChallenge
  requestValidate: RequestValidate

  form: any

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public translate: TranslateService,
    private service: CreateChequebookService,
    public storage: StorageService,
  ) {
    this.step = 1
    const hoy = new Date()
    this.form = fb.group({
      account: ['', Validators.required],
      bookType: ['', Validators.required],
      quantity: ['', Validators.required],
      deliveryMethod: ['', Validators.required],
      companyName: ['', Validators.required],
      country: [''],
      region: [''],
      city: [''],
      district: [''],
      streetName: [''],
      postalCode: [''],
      additionalCode: [''],
      buildingNo: [''],
      unitNo: [''],
      branchName: [''],
      phone: [''],
      feePerChequeBook: [''],
      deliveryFees: [''],
      totalFees: [''],
    })
  }

  ngOnInit() {}

  onInitStep1(events) {
    //console.log('onInitStep1', events);
    this.step1 = events
  }

  onInitStep2(events) {
    //console.log('onInitStep2', events);
    this.step2 = events
  }

  next() {
    switch (this.step) {
      case 1:
        this.nextStep()
        break
      case 2:
        this.nextStep()
        break
      case 3:
        this.finish()
        break
    }
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

  finish() {
    this.step = 1
    this.router.navigate(['/accounts/chequebook'])
  }

  isDisabled() {
    return !this.form.valid
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
