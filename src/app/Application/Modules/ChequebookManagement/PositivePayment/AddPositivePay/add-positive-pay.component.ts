import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { StorageService } from '../../../../../core/storage/storage.service'
import { Exception } from '../../../../Model/exception'
import { AddPositivePayStep1Component } from './add-positive-pay-step1.component'
import { AddPositivePayStep2Component } from './add-positive-pay-step2.component'
import { AddPositivePayService } from './add-positive-pay.service'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  selector: 'app-positive-pay',
  templateUrl: './add-positive-pay.component.html',
})
export class AddPositivePayComponent implements OnInit, OnDestroy {
  @ViewChild(AddPositivePayStep1Component)
  step1: AddPositivePayStep1Component
  @ViewChild(AddPositivePayStep2Component)
  step2: AddPositivePayStep2Component

  @ViewChild('authorization') authorization: any

  step: number
  option: string

  subscriptions: Subscription[] = []
  mensajeError: any = {}

  form: FormGroup

  positivePayValidate: any = {}
  positivePayConfirm: any = {}
  requestValidate: RequestValidate = new RequestValidate()

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public translate: TranslateService,
    private service: AddPositivePayService,
    public storage: StorageService,
  ) {
    this.step = 1
    const hoy = new Date()
    this.form = fb.group({
      account: ['', Validators.required],
      chequeNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(0),
          Validators.maxLength(10),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      amount: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{0,13}(.[0-9]{0,2})?$'),
        ],
      ],
    })
  }

  ngOnInit() {}

  onInitStep1(events) {
    this.step1 = events
  }

  onInitStep2(events) {
    this.step2 = events
  }

  isValid() {
    this.form.markAllAsTouched()
    return this.form.valid
  }

  validatePositivePay() {
    this.subscriptions.push(
      this.service
        .validatePositivePay(this.form.value)
        .subscribe((result: any) => {
          if (
            (result.hasOwnProperty('error') &&
              (<any>result).error instanceof Exception) ||
            result.batch == null
          ) {
            this.onError(result)
            return
          } else {
            this.positivePayValidate = result
            this.nextStep()
          }
        }),
    )
  }

  confirmPositivePay() {
    this.subscriptions.push(
      this.service
        .confirmPositivePay(
          this.positivePayValidate.batch,
          this.requestValidate,
        )
        .subscribe((result: any) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            this.positivePayConfirm = result
            this.nextStep()
          }
        }),
    )
  }

  next() {
    switch (this.step) {
      case 1:
        if (this.isValid()) {
          this.validatePositivePay()
        }
        break
      case 2:
        this.confirmPositivePay()
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
    this.router.navigate(['/accounts/chequebook/positive-payment'])
  }

  valid(): boolean {
    if (this.authorization) {
      return this.authorization.valid()
    } else {
      return true
    }
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
