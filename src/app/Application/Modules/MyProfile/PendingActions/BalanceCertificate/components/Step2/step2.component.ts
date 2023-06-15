import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { BalanceCertificateService } from '../../balance-certificate.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'

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

  constructor(
    private service: BalanceCertificateService,
    public translate: TranslateService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (Object.keys(this.sharedData).length === 0) {
      this.router.navigate(['/myprofile/pending/balance-certificate/step1'])
    } else {
      this.amountToProcess = 0
      for (const aux of this.sharedData.tableSelected) {
        this.amountToProcess += aux.amount
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
