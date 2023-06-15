import { Component, OnInit, ViewChild } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { NewPaymentService } from '../../new-payment.service'

@Component({
  templateUrl: './step3.component.html',
})
export class Step3Component implements OnInit {
  @ViewChild('authorization', { static: true }) authorization: any

  step = 3
  sharedData: any = {}

  subscriptions: Subscription[]
  form: FormGroup

  constructor(
    private service: NewPaymentService,
    public translate: TranslateService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  valid() {
    return !this.authorization.valid()
  }

  getFromLevelsMap(number: any) {
    return this.sharedData.mapSecurity.get(number)
  }
}
