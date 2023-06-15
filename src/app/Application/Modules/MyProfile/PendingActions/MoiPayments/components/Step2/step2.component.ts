import { Component, Injector, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { LevelFormatPipe } from '../../../../../../Components/common/Pipes/getLevels-pipe'
import { MoiPaymentsService } from '../../moi-payments.service'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  templateUrl: './step2.component.html',
})
export class Step2Component implements OnInit {
  @ViewChild('authorization') authorization: any

  step = 2
  sharedData: any = {}

  paymentsDisplaySize = 20
  refundsDisplaySize = 20

  paymentsTotalAmountToProcess: number
  paymentsTotalAmountToAuthorize: number
  paymentsTotalAmount: number

  showBatchListSubscription: Subscription

  constructor(
    private service: MoiPaymentsService,
    public translate: TranslateService,
    private router: Router,
    public levelFormatPipe: LevelFormatPipe,
    private injector: Injector,
  ) {}

  ngOnInit(): void {
    this.sharedData.showBatchList = {}
    this.sharedData.requestValidate = new RequestValidate()

    this.showBatchListSubscription = this.service
      .showBatchList(
        'A',
        this.sharedData.paymentsSelected,
        this.sharedData.refundsSelected,
      )
      .subscribe((result) => {
        this.showBatchListSubscription.unsubscribe()
        if (!result.error) {
          this.sharedData.showBatchList = result
          this.calculatePaymentsTotalAmount()
          if (
            this.sharedData.showBatchList
              .checkAndSeparateAuthorizationPermissionSP
          ) {
            this.processItemsLevels(
              this.sharedData.showBatchList
                .checkAndSeparateAuthorizationPermissionSP['toProcess'],
            )
            this.processItemsLevels(
              this.sharedData.showBatchList
                .checkAndSeparateAuthorizationPermissionSP['toAuthorize'],
            )
            this.sharedData.paymentsSelected.forEach((paymentSelected) => {
              let batch = this.findBatch(
                paymentSelected['batchPk'],
                result.checkAndSeparateAuthorizationPermissionSP['toProcess'],
              )
              if (!batch) {
                batch = this.findBatch(
                  paymentSelected['batchPk'],
                  result.checkAndSeparateAuthorizationPermissionSP[
                    'toAuthorize'
                  ],
                )
              }
              paymentSelected['citizenId'] =
                this.service.getCitizenIdFromDetails(
                  batch.details ? batch.details : [],
                )
            })
          }
          if (
            this.sharedData.showBatchList
              .checkAndSeparateAuthorizationPermissionSR
          ) {
            this.processItemsLevels(
              this.sharedData.showBatchList
                .checkAndSeparateAuthorizationPermissionSR['toProcess'],
            )
            this.processItemsLevels(
              this.sharedData.showBatchList
                .checkAndSeparateAuthorizationPermissionSR['toAuthorize'],
            )
            this.sharedData.refundsSelected.forEach((refundsSelected) => {
              let batch = this.findBatch(
                refundsSelected['batchPk'],
                result.checkAndSeparateAuthorizationPermissionSR['toProcess'],
              )
              if (!batch) {
                batch = this.findBatch(
                  refundsSelected['batchPk'],
                  result.checkAndSeparateAuthorizationPermissionSR[
                    'toAuthorize'
                  ],
                )
              }
              refundsSelected['citizenId'] =
                this.service.getCitizenIdFromDetails(
                  batch.details ? batch.details : [],
                )
            })
          }
        } else {
          this.router.navigate(['/myprofile/pending/moi-payments/step1'])
        }
      })
  }

  private findBatch(batchPk: number, batchesArray: any[]) {
    const batch = batchesArray.find(
      (batchElem) => batchElem['batchPk'] === batchPk,
    )
    return batch
  }

  valid() {
    if (this.authorization == null) {
      return true
    } else {
      return !this.authorization || this.authorization.valid()
    }
  }

  calculatePaymentsTotalAmount() {
    this.paymentsTotalAmount = 0

    if (
      this.sharedData.showBatchList.checkAndSeparateAuthorizationPermissionSP &&
      this.sharedData.showBatchList.checkAndSeparateAuthorizationPermissionSP[
        'toProcess'
      ]
    ) {
      this.sharedData.showBatchList.checkAndSeparateAuthorizationPermissionSP[
        'toProcess'
      ].forEach((batch) => {
        this.paymentsTotalAmountToProcess += parseFloat(batch.amount)
        this.paymentsTotalAmount += parseFloat(batch.amount)
      })
    }

    if (
      this.sharedData.showBatchList.checkAndSeparateAuthorizationPermissionSP &&
      this.sharedData.showBatchList.checkAndSeparateAuthorizationPermissionSP[
        'toAuthorize'
      ]
    ) {
      this.sharedData.showBatchList.checkAndSeparateAuthorizationPermissionSP[
        'toAuthorize'
      ].forEach((batch) => {
        this.paymentsTotalAmountToAuthorize += parseFloat(batch.amount)
        this.paymentsTotalAmount += parseFloat(batch.amount)
      })
    }
  }

  protected processItemsLevels(items) {
    if (Array.isArray(items) && items.length > 0) {
      items.forEach((item) => {
        if (
          this.sharedData.approveFlow &&
          typeof item.securityLevelsDTOList != 'undefined' &&
          item.securityLevelsDTOList != null
        ) {
          item['statusExport'] = new LevelFormatPipe(this.injector).transform(
            item.securityLevelsDTOList,
            'status',
          )
          item['nextStatusExport'] = new LevelFormatPipe(
            this.injector,
          ).transform(item.securityLevelsDTOList, 'nextStatus')
        }
        // else {
        //   item["statusExport"] = new LevelFormatPipe(this.injector).transform(
        //     item.futureSecurityLevelsDTOList,
        //     "status"
        //   );
        //   item["nextStatusExport"] = new LevelFormatPipe(
        //     this.injector
        //   ).transform(item.futureSecurityLevelsDTOList, "nextStatus");
        // }
      })
    }
  }
}
