import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { RequestValidate } from '../../../../../../Model/requestvalidateType'
import { BeneficiariesService } from '../../beneficiaries.service'

@Component({
  templateUrl: './step2.component.html',
})
export class Step2Component implements OnInit {
  @ViewChild('authorization') authorization: any

  step = 2
  sharedData: any = {}

  authorizeValidateMultipleSubscription: Subscription

  constructor(
    public service: BeneficiariesService,
    public translate: TranslateService,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.sharedData.requestValidate = new RequestValidate()
  }

  valid() {
    if (this.authorization == null) {
      return true
    } else {
      return !this.authorization || this.authorization.valid()
    }
  }
}
