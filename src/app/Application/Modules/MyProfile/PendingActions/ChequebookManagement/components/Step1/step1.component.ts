import { Component, Injector, OnDestroy, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { AuthenticationService } from '../../../../../../../core/security/authentication.service'
import { LevelFormatPipe } from '../../../../../../Components/common/Pipes/getLevels-pipe'
import { ModelPipe } from '../../../../../../Components/common/Pipes/model-pipe'
import { ChequebookService } from '../../chequebook.service'

@Component({
  templateUrl: './step1.component.html',
})
export class Step1Component implements OnInit, OnDestroy {
  step = 1
  sharedData: any = {}

  getPendingChequeBatchesSubscription: Subscription[] = []
  chequeListResults: any = {}
  stopchequeList: any = {}
  positivePayList: any = {}
  tableDisplaySize = 20
  tableDisplaySizeStop = 20
  tableDisplaySizePositivePay = 20

  constructor(
    private service: ChequebookService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    private modelPipe: ModelPipe,
    private levelsPipe: LevelFormatPipe,
    private injector: Injector,
  ) {}

  ngOnInit(): void {
    this.chequeListResults.items = []
    this.chequeListResults.size = 0
    this.chequeListResults.total = 0

    this.stopchequeList.items = []
    this.stopchequeList.size = 0
    this.stopchequeList.total = 0

    this.positivePayList.items = []
    this.positivePayList.size = 0
    this.positivePayList.total = 0

    this.sharedData.tableSelected = []
    this.sharedData.tableStopSelected = []
    this.sharedData.tablePositivePaySelected = []

    if (
      this.authenticationService.activateOption(
        'PendingActionChequeManagement',
        [],
        ['RequestCheckBookGroup'],
      )
    ) {
      this.setPage(null)
    }

    if (
      this.authenticationService.activateOption(
        'PendingActionChequeManagement',
        [],
        ['StopCheckBookGroup'],
      )
    ) {
      this.setPageStop(null)
    }
    if (
      this.authenticationService.activateOption(
        'PendingActionChequeManagement',
        ['POSITIVEPAYCHECK_PRIVILEGE'],
        ['PositivePayCheckGroup'],
      )
    ) {
      this.setPagePositivePay(null)
    }

    if (
      this.service.tableSelectedRows &&
      typeof this.service.tableSelectedRows != 'undefined' &&
      this.service.tableSelectedRows.length > 0
    ) {
      this.sharedData.tableSelected = this.service.tableSelectedRows
    }

    if (
      this.service.tableStopSelectedRows &&
      typeof this.service.tableStopSelectedRows != 'undefined' &&
      this.service.tableStopSelectedRows.length > 0
    ) {
      this.sharedData.tableStopSelected = this.service.tableStopSelectedRows
    }

    if (
      this.service.tablePositivePaySelectedRows &&
      typeof this.service.tablePositivePaySelectedRows != 'undefined' &&
      this.service.tablePositivePaySelectedRows.length > 0
    ) {
      this.sharedData.tablePositivePaySelected =
        this.service.tablePositivePaySelectedRows
    }
  }

  ngOnDestroy() {
    if (this.getPendingChequeBatchesSubscription.length > 0) {
      for (const sub of this.getPendingChequeBatchesSubscription) {
        sub.unsubscribe()
      }
    }
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }

    this.getPendingChequeBatchesSubscription.push(
      this.service
        .getPendingCreateCheque(pageInfo.offset + 1, this.tableDisplaySize)
        .subscribe((result) => {
          if (!result.error) {
            this.chequeListResults = result

            for (const item of this.chequeListResults.items) {
              const levels = !item.futureLevels
                ? item.securityLevelsDTOList
                : item.futureSecurityLevelsDTOList
              item.statusTranslated = this.levelsPipe.transform(
                levels,
                'status',
              )
              item.nextStatusTranslated = this.levelsPipe.transform(
                levels,
                'nextStatus',
              )
            }
          }
        }),
    )
  }

  setPageStop(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }

    this.getPendingChequeBatchesSubscription.push(
      this.service
        .getPendingStopCheque(pageInfo.offset + 1, this.tableDisplaySizeStop)
        .subscribe((result) => {
          if (!result.error) {
            this.stopchequeList = result
          }
        }),
    )
  }

  setPagePositivePay(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }

    this.getPendingChequeBatchesSubscription.push(
      this.service
        .getPendingPositivePay(pageInfo.offset + 1, this.tableDisplaySizeStop)
        .subscribe((result) => {
          if (!result.error) {
            this.positivePayList = result
          }
        }),
    )
  }

  onSelect(selected) {
    const items = Object.assign([], this.chequeListResults.items)
    this.chequeListResults.items = []
    this.chequeListResults.items.push(...items)

    this.sharedData.tableSelected.splice(
      0,
      this.sharedData.tableSelected.length,
    )
    this.sharedData.tableSelected.push(...selected)
    this.service.tableSelectedRows = this.sharedData.tableSelected
  }

  onSelectStop(selected) {
    const items = Object.assign([], this.stopchequeList.items)
    this.stopchequeList.items = []
    this.stopchequeList.items.push(...items)
    this.sharedData.tableStopSelected.splice(
      0,
      this.sharedData.tableStopSelected.length,
    )
    this.sharedData.tableStopSelected.push(...selected)
    this.service.tableStopSelectedRows = this.sharedData.tableStopSelected
  }

  onSelectPositivePay(selected) {
    const items = Object.assign([], this.positivePayList.items)
    this.positivePayList.items = []
    this.positivePayList.items.push(...items)
    this.sharedData.tablePositivePaySelected.splice(
      0,
      this.sharedData.tablePositivePaySelected.length,
    )
    this.sharedData.tablePositivePaySelected.push(...selected)
    this.service.tablePositivePaySelectedRows =
      this.sharedData.tablePositivePaySelected
  }

  changeDisplaySize(event) {
    this.tableDisplaySize = event
    this.setPage(null)
  }

  changeDisplaySizeStop(event) {
    this.tableDisplaySizeStop = event
    this.setPageStop(null)
  }

  changeDisplaySizePositivePay(event) {
    this.tableDisplaySizePositivePay = event
    this.setPagePositivePay(null)
  }
}
