import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { AddBeneficiaryService } from '../../add-beneficiary.service'

@Component({
  templateUrl: './step2.component.html',
})
export class Step2Component implements OnInit {
  @ViewChild('authorization') authorization: any

  step = 2
  sharedData: any = {}
  temporal: any

  subscriptions: Subscription[]

  constructor(
    private service: AddBeneficiaryService,
    public translate: TranslateService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  valid() {
    if (this.authorization == null) {
      return true
    } else {
      return this.authorization.valid()
    }
  }
}
