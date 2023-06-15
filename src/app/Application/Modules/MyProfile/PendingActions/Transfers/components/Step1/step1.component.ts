import { Component, Injector, OnDestroy, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { map } from 'rxjs/operators'
import { AuthenticationService } from '../../../../../../../core/security/authentication.service'
import { LevelFormatPipe } from '../../../../../../Components/common/Pipes/getLevels-pipe'
import { TransfersService } from '../../transfers.service'

@Component({
  templateUrl: './step1.component.html',
})
export class Step1Component implements OnInit, OnDestroy {
  step = 1
  sharedData: any = {}

  transferStatusSubscription: Subscription
  selectedSubscription: Subscription

  pagedResults: any = {}
  displaySize = 50
  withinSubscription: Subscription

  localPagedResults: any = {}
  localDisplaySize = 50
  localSubscription: Subscription

  internationalPagedResults: any = {}
  internationalDisplaySize = 50
  internationalSubscription: Subscription

  constructor(
    private service: TransfersService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    private injector: Injector,
  ) {}

  ngOnInit(): void {
    this.pagedResults.items = []
    this.pagedResults.size = 0
    this.pagedResults.total = 0
    this.sharedData.selected = []
    this.setPage(null)

    this.selectedSubscription = this.service.getSelected.subscribe(
      (selected) => {
        // console.log('shared- subscription',billPaymentsSelected);
        this.sharedData.selected = selected
      },
    )
  }

  ngOnDestroy() {
    this.selectedSubscription.unsubscribe()
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }

    this.withinSubscription = this.service
      .getList(pageInfo.offset + 1, this.displaySize)
      .pipe(
        map((r) => {
          if (!r.error && typeof r.transfers.items !== 'undefined') {
            if (
              Array.isArray(r.transfers.items) &&
              r.transfers.items.length > 0
            ) {
              r.transfers.items.forEach((item) => {
                item['fullAccountNumber'] = item.accountFrom.fullAccountNumber
                item['alias'] = item.accountFrom.alias
                item['statusExport'] = new LevelFormatPipe(
                  this.injector,
                ).transform(item.securityDetails, 'status')
                item['nextStatusExport'] = new LevelFormatPipe(
                  this.injector,
                ).transform(item.securityDetails, 'nextStatus')
              })
            }
          }
          return r
        }),
      )
      .subscribe((result) => {
        if (!result.error) {
          this.pagedResults = result.transfers
        }
        this.withinSubscription.unsubscribe()
      })
  }

  // onSelect({ selected }) {
  //   this.sharedData.selected.splice(0, this.sharedData.selected.length);
  //   this.sharedData.selected.push(...selected);
  // }

  changeDisplay(event) {
    this.displaySize = event
    this.setPage(null)
  }
}
