import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { PaymentsService } from '../../payments.service'
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

  constructor(
    private service: PaymentsService,
    public translate: TranslateService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    //console.log(this.sharedData);
    if (Object.keys(this.sharedData).length === 0) {
      this.router.navigate(['/myprofile/pending/aramco-payments/step1'])
    } else {
      if (this.sharedData.aproveFlow) {
        this.sharedData.requestValidate = new RequestValidate()
        this.authorizeValidateSubscription = this.service
          .authorizeValidate(this.sharedData.tableSelected)
          .subscribe((result) => {
            if (!result.error) {
              this.generateChallengeAndOTP = result.generateChallengeAndOTP
              this.sharedData.validate = result.aramcoBatchList
              //console.log(result);
            }
            this.amountToProcess = 0
            if (this.sharedData.validate.toProcess.length > 0) {
              for (const aux of this.sharedData.validate.toProcess) {
                this.amountToProcess += +aux.amount
              }
            } else if (this.sharedData.validate.toAuthorize.length > 0) {
              for (const aux of this.sharedData.validate.toAuthorize) {
                this.amountToProcess += +aux.amount
              }
            }
            this.authorizeValidateSubscription.unsubscribe()
          })
      } else {
        this.sharedData.requestValidate = new RequestValidate()
        this.authorizeValidateSubscription = this.service
          .authorizeValidate(this.sharedData.tableSelected)
          .subscribe((result) => {
            if (!result.error) {
              this.sharedData.validate = result.aramcoBatchList
              //console.log(result);
            }
            this.amountToProcess = 0
            if (this.sharedData.validate.toProcess.length > 0) {
              for (const aux of this.sharedData.validate.toProcess) {
                this.amountToProcess += +aux.amount
              }
            } else if (this.sharedData.validate.toAuthorize.length > 0) {
              for (const aux of this.sharedData.validate.toAuthorize) {
                this.amountToProcess += +aux.amount
              }
            }
            this.authorizeValidateSubscription.unsubscribe()
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
