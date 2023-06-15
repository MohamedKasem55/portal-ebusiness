import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from '../../../../../../Model/requestvalidateType'
import { DirectDebitsService } from '../../direct-debits.service'

@Component({
  templateUrl: './step2.component.html',
})
export class Step2Component implements OnInit {
  @ViewChild('authorization') authorization: any

  step = 2

  sharedData: any = {}
  generateChallengeAndOTP: ResponseGenerateChallenge
  items: any = []

  constructor(
    private service: DirectDebitsService,
    public translate: TranslateService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (Object.keys(this.sharedData).length === 0) {
      this.router.navigate([
        '/myprofile/pending/government-revenue-transfer-payments/step1',
      ])
    }
    this.sharedData.requestValidate = new RequestValidate()
    if (
      this.sharedData.aproveFlow &&
      this.sharedData.singleSelected.length > 0
    ) {
      this.items = []
      const items = []
      this.items = items.concat(
        this.sharedData.authorizeValidate.batchList.toProcess,
        this.sharedData.authorizeValidate.batchList.toAuthorize,
        this.sharedData.authorizeValidate.batchList.notAllowed,
      )
    }
  }

  valid() {
    if (typeof this.authorization != 'undefined') {
      return !this.authorization || this.authorization.valid()
    } else {
      return true
    }
  }
}
