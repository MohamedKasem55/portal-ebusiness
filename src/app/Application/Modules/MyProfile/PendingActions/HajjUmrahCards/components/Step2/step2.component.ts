import { Component, Injector, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { LevelFormatPipe } from '../../../../../../Components/common/Pipes/getLevels-pipe'
import { HajjUmrahService } from '../../Hajj-Umrah.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  templateUrl: './step2.component.html',
})
export class Step2Component implements OnInit {
  @ViewChild('authorization') authorization: any

  step = 2
  sharedData: any = []

  tableDisplaySize = 20
  authorizeValidateSubscription: Subscription

  generateChallengeAndOTP: ResponseGenerateChallenge
  amountToProcess = 0
  amountToAuthorize = 0

  constructor(
    private service: HajjUmrahService,
    public translate: TranslateService,
    private router: Router,
    private injector: Injector,
  ) {}

  ngOnInit(): void {
    //this.sharedData.rejectReason = null;
    if (this.sharedData.selected.length > 0) {
      //console.log(this.sharedData);
      this.sharedData.requestValidate = new RequestValidate()
      this.amountToProcess = 0
      for (const aux of this.sharedData.selected) {
        this.amountToProcess += +aux.amount
      }
      //console.log(this.amountToProcess);
    }
    this.processItemsLevels(
      this.sharedData.responseValidate.batchListsContainerDTO.toProcess,
    )
    this.processItemsLevels(
      this.sharedData.responseValidate.batchListsContainerDTO.toProcess,
    )
  }

  valid() {
    return !this.authorization || this.authorization.valid()
  }

  protected processItemsLevels(items) {
    if (Array.isArray(items) && items.length > 0) {
      items.forEach((item) => {
        item['statusExport'] = new LevelFormatPipe(this.injector).transform(
          item.securityLevelsDTOList,
          'status',
        )
        item['nextStatusExport'] = new LevelFormatPipe(this.injector).transform(
          item.securityLevelsDTOList,
          'nextStatus',
        )
      })
    }
  }
}
