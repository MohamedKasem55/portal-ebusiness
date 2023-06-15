import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { SinglePaymentService } from '../../single-payment.service'

@Component({
  templateUrl: './step3.component.html',
})
export class Step3Component implements OnInit {
  @ViewChild('authorization') authorization: any

  step = 3
  sharedData: any = {}

  subscriptions: Subscription[]
  account: any

  constructor(
    private service: SinglePaymentService,
    public translate: TranslateService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  valid() {
    if (this.authorization) {
      return this.authorization.valid()
    }
    return true
  }
}
