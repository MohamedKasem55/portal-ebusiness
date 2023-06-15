import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { BillPaymentsService } from '../../bill-payments.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  templateUrl: './step2.component.html',
})
export class Step2Component implements OnInit {
  @ViewChild('authorization') authorization: any

  step = 2
  sharedData: any = {}

  tableDisplaySize = 20
  authorizeValidateSubscription: Subscription

  generateChallengeAndOTP: ResponseGenerateChallenge
  amountToProcess = 0
  amountToAuthorize = 0
  amountVatTotal = 0
  amountWithouVatTotal = 0

  constructor(
    private service: BillPaymentsService,
    public translate: TranslateService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (Object.keys(this.sharedData).length === 0) {
      this.router.navigate(['/myprofile/pending/bill-payments/step1'])
    } else {
      this.sharedData.requestValidate = new RequestValidate()
      if (typeof this.sharedData.responseValidate != 'undefined') {
        if (this.sharedData.responseValidate.total) {
          if (this.sharedData.responseValidate.total.totalAmountToProcess) {
            this.amountToProcess =
              this.sharedData.responseValidate.total.totalAmountToProcess
          } else if (
            this.sharedData.responseValidate.total.totalAmountToAuthorize
          ) {
            this.amountToProcess =
              this.sharedData.responseValidate.total.totalAmountToAuthorize
          }
          if (this.sharedData.responseValidate.total.totalVatAmountToProcess) {
            this.amountVatTotal =
              this.sharedData.responseValidate.total.totalVatAmountToProcess
          } else if (
            this.sharedData.responseValidate.total.totalVatAmountToAuthorize
          ) {
            this.amountVatTotal =
              this.sharedData.responseValidate.total.totalVatAmountToAuthorize
          }
          if (
            this.sharedData.responseValidate.total
              .totalAmountWithoutVatToProcess
          ) {
            this.amountWithouVatTotal =
              this.sharedData.responseValidate.total.totalAmountWithoutVatToProcess
          } else if (
            this.sharedData.responseValidate.total
              .totalAmountWithoutVatToAuthorize
          ) {
            this.amountWithouVatTotal =
              this.sharedData.responseValidate.total.totalAmountWithoutVatToAuthorize
          }
        }
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
