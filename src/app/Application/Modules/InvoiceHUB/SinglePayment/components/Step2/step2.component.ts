import { Component, OnInit, ViewChild } from '@angular/core'
import { NgModel } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { SinglePaymentService } from '../../single-payment.service'

@Component({
  templateUrl: './step2.component.html',
})
export class Step2Component implements OnInit {
  @ViewChild('pay', { static: true }) pay: NgModel
  @ViewChild('selectedAccount', { static: true }) selectedAccount: NgModel
  step = 2
  sharedData: any = {}
  accounts = []

  subscriptions: Subscription[] = []

  constructor(
    private service: SinglePaymentService,
    public translate: TranslateService,
  ) {}

  ngOnInit(): void {
    if (this.sharedData.accounts.length == 1) {
      this.sharedData.selectedAccount = this.sharedData.accounts[0].key
    } else {
      this.sharedData.selectedAccount = ''
    }
  }

  valid() {
    return this.selectedAccount.valid && (this.pay.isDisabled || this.pay.valid)
  }
}
