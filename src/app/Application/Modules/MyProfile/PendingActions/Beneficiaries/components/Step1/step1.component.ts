import { Component, Injector, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { AuthenticationService } from '../../../../../../../core/security/authentication.service'
import { BeneficiariesService } from '../../beneficiaries.service'
import { LevelFormatPipe } from '../../../../../../Components/common/Pipes/getLevels-pipe'

@Component({
  templateUrl: './step1.component.html',
})
export class Step1Component implements OnInit {
  step = 1
  sharedData: any = {}

  public innerWidth: any
  public mobile = false

  pagedResults: any = {}
  displaySize = 20
  subscription: Subscription

  localPagedResults: any = {}
  localDisplaySize = 20
  localSubscription: Subscription

  internationalPagedResults: any = {}
  internationalDisplaySize = 20
  internationalSubscription: Subscription

  constructor(
    public service: BeneficiariesService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    private injector: Injector,
  ) {}

  ngOnInit(): void {
    this.pagedResults.items = []
    this.pagedResults.size = 0
    this.pagedResults.total = 0
    this.setPage(null)

    if (
      this.service.tableSelectedRows &&
      typeof this.service.tableSelectedRows != 'undefined' &&
      this.service.tableSelectedRows.length > 0
    ) {
      this.sharedData.beneficiariesSelected = this.service.tableSelectedRows
    } else {
      this.sharedData.beneficiariesSelected = []
    }
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.subscription = this.service
      .getList(pageInfo.offset + 1, this.displaySize)
      .subscribe((result) => {
        if (!result.error) {
          this.pagedResults = result.beneficiaries
          this.processItemsLevels(this.pagedResults.items)
        }
        this.subscription.unsubscribe()
      })
  }

  onSelect(event) {
    // console.log('Select Event', event);
    this.sharedData.beneficiariesSelected.splice(
      0,
      this.sharedData.beneficiariesSelected.length,
    )
    this.sharedData.beneficiariesSelected.push(...event)

    this.service.tableSelectedRows = this.sharedData.beneficiariesSelected
  }

  changeDisplay(event) {
    this.displaySize = event
    this.setPage(null)
  }

  protected processItemsLevels(items) {
    if (Array.isArray(items) && items.length > 0) {
      items.forEach((item) => {
        item['currencyCode'] = item.currency
        item['curStatusExport'] = new LevelFormatPipe(this.injector).transform(
          item.securityLevels,
          'status',
        )
        item['nextStatusExport'] = new LevelFormatPipe(this.injector).transform(
          item.securityLevels,
          'nextStatus',
        )
      })
    }
    //console.log(items);
  }
}
