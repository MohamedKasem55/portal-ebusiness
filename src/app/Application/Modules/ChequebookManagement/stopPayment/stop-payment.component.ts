import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '../../../../../../node_modules/@angular/forms'
import { Exception } from '../../../Model/exception'
import { StopPaymentService } from './stop-payment.service'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'

@Component({
  selector: 'app-stop-payment',
  templateUrl: 'stop-payment.component.html',
})
export class StopPaymentComponent implements OnInit {
  form: FormGroup
  step: number
  option: string
  subscriptions: Subscription[] = []
  mensajeError: any = {}
  viewRequest: any
  requestValidate: RequestValidate
  generateChallengeAndOTP: ResponseGenerateChallenge

  constructor(
    public fb: FormBuilder,
    private router: Router,
    public translate: TranslateService,
    private service: StopPaymentService,
  ) {
    this.step = 1
    this.requestValidate = new RequestValidate()
    this.form = fb.group({
      account: ['', Validators.required],
      chequeType: ['', Validators.required],
      chequeNumber: ['', Validators.required],
    })
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

  isDisabled() {
    return (
      !this.form.valid ||
      (this.step === 2 &&
        this.generateChallengeAndOTP &&
        !this.requestValidate.otp)
    )
  }

  finish() {
    this.form = this.fb.group({
      account: ['', Validators.required],
      chequeType: ['', Validators.required],
      chequeNumber: ['', Validators.required],
    })
    this.step = 1
    this.router.navigate(['/accounts/chequebook/stop-chequebook'])
  }

  next() {
    switch (this.step) {
      case 1:
        this.setPage(null)
        break
      case 2:
        this.confirmStop()
        break
      case 3:
        // this.finish();
        break
    }
  }

  onError(error: any) {
    if (!error.error) {
      return
    }

    const res = error
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }

    const data = {
      accountNumber: this.form.controls['account'].value,
      chequeNumber: this.form.controls['chequeNumber'].value,
      stopMode: this.form.controls['chequeType'].value,
    }

    this.subscriptions.push(
      this.service.getchequebookList(data).subscribe((result: any) => {
        if (
          (result.hasOwnProperty('error') &&
            (<any>result).error instanceof Exception) ||
          result.batch == null
        ) {
          this.onError(result)
          return
        } else {
          this.requestValidate = new RequestValidate()
          this.viewRequest = result.batch
          this.generateChallengeAndOTP = result.generateChallengeAndOTP
          this.nextStep()
        }
      }),
    )
  }

  confirmStop() {
    this.service
      .stopChequeConfirm(this.viewRequest, this.requestValidate)
      .subscribe((res: any) => {
        if (
          res.hasOwnProperty('error') &&
          (<any>res).error instanceof Exception
        ) {
          this.onError(res)
          return
        } else {
          this.nextStep()
        }
      })
  }

  ngOnInit() {}
}
