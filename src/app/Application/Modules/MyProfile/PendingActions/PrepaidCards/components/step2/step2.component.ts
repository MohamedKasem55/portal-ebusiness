import { Component, OnInit, ViewChild } from '@angular/core'
import { Subscription } from 'rxjs'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { PrepaidCardsService } from '../../prepaid-cards.service'
import { TranslateService } from '@ngx-translate/core'
import { Router } from '@angular/router'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  selector: 'app-step2',
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
    private service: PrepaidCardsService,
    public translate: TranslateService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (Object.keys(this.sharedData).length === 0) {
      this.router.navigate(['/myprofile/pending/prepaidCards/step1'])
    } else {
      // console.log('sharedData step2: ', this.sharedData);
      this.sharedData.requestValidate = new RequestValidate()
      if (this.sharedData.aproveFlow) {
        if (
          this.sharedData.responseValidate.batchList?.toAuthorize.length > 0
        ) {
          this.sharedData.responseValidate.batchList.toAuthorize.forEach(
            (element) => {
              this.amountToProcess = this.amountToProcess + element.amount
            },
          )
        } else if (
          this.sharedData.responseValidate.batchList?.toProcess.length > 0
        ) {
          this.sharedData.responseValidate.batchList.toProcess.forEach(
            (element) => {
              this.amountToProcess = this.amountToProcess + element.amount
            },
          )
        } else if (
          this.sharedData.responseValidate.batchList?.notAllowed.length > 0
        ) {
          this.sharedData.responseValidate.batchList.notAllowed.forEach(
            (element) => {
              this.amountToProcess = this.amountToProcess + element.amount
            },
          )
        }
      } else {
        this.sharedData.tableSelected.forEach((element) => {
          this.amountToProcess = this.amountToProcess + element.amount
        })
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
