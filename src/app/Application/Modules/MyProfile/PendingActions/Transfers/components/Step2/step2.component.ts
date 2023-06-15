import { Component, Injector, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { AuthenticationService } from '../../../../../../../core/security/authentication.service'
import { StorageService } from '../../../../../../../core/storage/storage.service'
import { LevelFormatPipe } from '../../../../../../Components/common/Pipes/getLevels-pipe'

@Component({
  templateUrl: './step2.component.html',
})
export class Step2Component implements OnInit {
  @ViewChild('authorization') authorization: any

  step = 2
  sharedData: any
  totalFee: number
  totalAmount: number
  isQuickTransfer: boolean = false

  public vat: number

  constructor(
    private _storage: StorageService,
    private router: Router,
    public authenticationService: AuthenticationService,
    public translate: TranslateService,
    public injector: Injector,
  ) {
    const parameters = this._storage.retrieve('parameters')
    this.vat = +parameters.items['vatPercentage'].value
  }

  ngOnInit(): void {
    if (Object.keys(this.sharedData).length === 0) {
      this.router.navigate(['/myprofile/pending/transfers/step1'])
    }
    if (typeof this.sharedData.validateResponse != 'undefined') {
      if (
        this.sharedData.validateResponse.withinAuthorizationPermission
          .toAuthorize
      ) {
        this.processItemsLevels(
          this.sharedData.validateResponse.withinAuthorizationPermission
            .toProcess,
        )
        this.processItemsLevels(
          this.sharedData.validateResponse.withinAuthorizationPermission
            .toAuthorize,
        )
        this.processItemsLevels(
          this.sharedData.validateResponse.withinAuthorizationPermission
            .notAllowed,
        )
      }
      this.processItemsLevels(
          this.sharedData.validateResponse.ownAuthorizationPermission.toProcess,
      )
      this.processItemsLevels(
          this.sharedData.validateResponse.ownAuthorizationPermission
              .toAuthorize,
      )
      this.processItemsLevels(
          this.sharedData.validateResponse.ownAuthorizationPermission
              .notAllowed,
      )
      this.processItemsLevels(
        this.sharedData.validateResponse.localAuthorizationPermission.toProcess,
      )
      this.processItemsLevels(
        this.sharedData.validateResponse.localAuthorizationPermission
          .toAuthorize,
      )
      this.processItemsLevels(
        this.sharedData.validateResponse.localAuthorizationPermission
          .notAllowed,
      )
      this.processItemsLevels(
        this.sharedData.validateResponse.internationalAuthorizationPermission
          .toProcess,
      )
      this.processItemsLevels(
        this.sharedData.validateResponse.internationalAuthorizationPermission
          .toAuthorize,
      )
      this.processItemsLevels(
        this.sharedData.validateResponse.internationalAuthorizationPermission
          .notAllowed,
      )
    }
    this.totalAmount = 0
    this.totalFee = 0

    if (typeof this.sharedData.validateResponse != 'undefined') {
      this.totalFee =
        (this.sharedData.validateResponse.totalFeeProcess
          ? this.sharedData.validateResponse.totalFeeProcess
          : 0) +
        (this.sharedData.validateResponse.totalFeeAuthorize
          ? this.sharedData.validateResponse.totalFeeAuthorize
          : 0) +
        (this.sharedData.validateResponse.totalFeeNotAllowed
          ? this.sharedData.validateResponse.totalFeeNotAllowed
          : 0)

      const validResp = this.sharedData.validateResponse
      // let transfersToSum: any[] = validResp.withinAuthorizationPermission.toProcess;
      // transfersToSum = transfersToSum.concat(validResp.localAuthorizationPermission.toProcess);
      // transfersToSum = transfersToSum.concat(validResp.internationalAuthorizationPermission.toProcess);
      // this.totalAmount = transfersToSum.map(t => t.amount).reduce((previousAmount, currentAmount) => previousAmount + currentAmount);
      this.totalAmount =
        (this.sharedData.validateResponse.totalAmountProcess
          ? this.sharedData.validateResponse.totalAmountProcess
          : 0) +
        (this.sharedData.validateResponse.totalAmountAuthorize
          ? this.sharedData.validateResponse.totalAmountAuthorize
          : 0) +
        (this.sharedData.validateResponse.totalAmountNotAllowed
          ? this.sharedData.validateResponse.totalAmountNotAllowed
          : 0)
    }
    this.checkIsQuick()
  }

  checkIsQuick(): void {
    if (this.sharedData.validateResponse.localAuthorizationPermission) {
      const toAuthorize =
        this.sharedData.validateResponse.localAuthorizationPermission
          .toAuthorize
      const toProcess =
        this.sharedData.validateResponse.localAuthorizationPermission.toProcess
      const notAllowed =
        this.sharedData.validateResponse.localAuthorizationPermission.notAllowed
      const joined = [...toAuthorize, ...toProcess, ...notAllowed]
      if (joined && joined.length > 0) {
        for (let i = 0; i <= joined.length; i++) {
          if (joined[i]?.ipsEligibilityFlg) {
            this.isQuickTransfer = true
            return
          }
        }
      }
    }
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

  valid() {
    if (this.sharedData.aproveFlow) {
      return !this.authorization || this.authorization.valid()
    } else {
      return true
    }
  }
}
