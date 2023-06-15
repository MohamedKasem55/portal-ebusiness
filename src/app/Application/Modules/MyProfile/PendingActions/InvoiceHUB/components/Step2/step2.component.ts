import { Component, Injector, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { LevelFormatPipe } from '../../../../../../Components/common/Pipes/getLevels-pipe'
import { StaticService } from '../../../../../Common/Services/static.service'
import { InvoiceHUBService } from '../../invoiceHUB.service'
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
  combosData: any = {}

  constructor(
    private service: InvoiceHUBService,
    public translate: TranslateService,
    private router: Router,
    private injector: Injector,
    private staticService: StaticService,
  ) {}

  ngOnInit(): void {
    if (Object.keys(this.sharedData).length === 0) {
      this.router.navigate(['/myprofile/pending/invoiceHUB/step1'])
    } else {
      const combosKeys = ['batchSecurityLevelStatus']
      this.combosData['batchSecurityLevelStatus'] = []

      this.staticService.getAllCombos(combosKeys).subscribe(comboData => {
        const data = comboData

        const statusValues =
          data[combosKeys.indexOf('batchSecurityLevelStatus')]['values']
        Object.keys(statusValues).map((key, index) => {
          this.combosData['batchSecurityLevelStatus'][key] = statusValues[key]
        })
      })
      if (this.sharedData.approveFlow) {
        this.sharedData.requestValidate = new RequestValidate()
        this.sharedData.valid = true
        this.authorizeValidateSubscription = this.service
          .authorizeValidate(this.sharedData.tableSelected)
          .subscribe(result => {
            if (!result.error) {
              this.generateChallengeAndOTP = result.generateChallengeAndOTP
              this.sharedData['batchList'] = result.batchList
              this.processItemsLevels(this.sharedData.batchList.toProcess)
              this.processItemsLevels(this.sharedData.batchList.toAuthorize)
            }
            this.authorizeValidateSubscription.unsubscribe()
          })
      }

      this.amountToProcess = 0
      for (const aux of this.sharedData.tableSelected) {
        this.amountToProcess += aux.amount
      }
    }
  }

  valid() {
    if (this.authorization == null) {
      this.sharedData.valid = true
      return true
    } else {
      this.sharedData.valid = !this.authorization || this.authorization.valid()
      return !this.authorization || this.authorization.valid()
    }
  }

  protected processItemsLevels(items) {
    if (Array.isArray(items) && items.length > 0) {
      items.forEach(item => {
        item['curStatusExport'] = new LevelFormatPipe(this.injector).transform(
          item.futureSecurityLevelsDTOList,
          'status',
        )
        item['nextStatusExport'] = new LevelFormatPipe(this.injector).transform(
          item.futureSecurityLevelsDTOList,
          'nextStatus',
        )
        item['statusExport'] = this.combosData['batchSecurityLevelStatus'][
          item.status
        ]
          ? this.combosData['batchSecurityLevelStatus'][item.status]
          : item.status
      })
    }
  }
}
