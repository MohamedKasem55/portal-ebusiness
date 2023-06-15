import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { Subscription } from 'rxjs'
import { BulkPaymentService } from '../../bulk-payment.service'

@Component({
  templateUrl: './step2.component.html',
})
export class Step2Component implements OnInit {
  @ViewChild('authorization') authorization: any

  step = 2
  sharedData: any = []

  tableDisplaySize = 50
  authorizeValidateSubscription: Subscription

  generateChallengeAndOTP: ResponseGenerateChallenge
  amountToProcess = 0
  amountToAuthorize = 0

  constructor(
    private service: BulkPaymentService,
    public translate: TranslateService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (Object.keys(this.sharedData).length === 0) {
      this.router.navigate(['/myprofile/pending/bulk-payment/step1'])
    } else {
      this.sharedData.requestValidate = new RequestValidate()
      if (this.sharedData.responseValidate.totalAmountToProcess) {
        this.amountToProcess =
          this.sharedData.responseValidate.totalAmountToProcess
      } else if (this.sharedData.responseValidate.totalAmountToAuthorize) {
        this.amountToProcess =
          this.sharedData.responseValidate.totalAmountToAuthorize
      }
    }
  }

  valid() {
    if (this.authorization == null) {
      return true
    } else {
      return !this.authorization || this.authorization.valid()
    }
  }
}
