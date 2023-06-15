import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../../../core/responsive/datatable-mobile.component'
import { AccountWorkflowService } from '../../account-workflow.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'

@Component({
  templateUrl: './step2.component.html',
})
export class Step2Component extends DatatableMobileComponent implements OnInit {
  @ViewChild('authorization') authorization: any

  step = 2
  sharedData: any = {}

  tableDisplaySize = 20
  authorizeValidateSubscription: Subscription

  generateChallengeAndOTP: ResponseGenerateChallenge
  amountToProcess = 0
  amountToAuthorize = 0

  constructor(
    private service: AccountWorkflowService,
    public translate: TranslateService,
    private router: Router,
  ) {
    super()
  }

  ngOnInit(): void {
    if (Object.keys(this.sharedData).length === 0) {
      this.router.navigate(['/myprofile/pending/account-workflow/step1'])
    } else {
      this.amountToProcess = 0
      if (
        this.sharedData.responseValidate &&
        this.sharedData.responseValidate.batchList
      ) {
        for (const aux of this.sharedData.responseValidate.batchList
          .toProcess) {
          this.amountToProcess += aux.amount
        }

        this.amountToAuthorize = 0
        for (const aux of this.sharedData.responseValidate.batchList
          .toAuthorize) {
          this.amountToAuthorize += aux.amount
        }
      }
    }
  }

  valid() {
    return !this.authorization || this.authorization.valid()
  }
}
