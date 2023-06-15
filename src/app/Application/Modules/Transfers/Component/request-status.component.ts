import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  Injector,
  Inject,
  LOCALE_ID,
} from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { AuthenticationService } from '../../../../core/security/authentication.service'
import { RequestStatusTransferService } from '../Services/request-status.service'
import { map } from 'rxjs/operators'
import { LevelFormatPipe } from '../../../Components/common/Pipes/getLevels-pipe'
import { PagedData } from '../../../Model/paged-data'
import { TransferReactivationService } from '../TransferReactivation/transfer-reactivation.service'
import { ModelPipe } from '../../../Components/common/Pipes/model-pipe'
import { StatusPipe } from '../../../Components/common/Pipes/status-pipe'
import { AmountCurrencyPipe } from '../../../Components/common/Pipes/amount-currency.pipe'
import { Page } from '../../../Model/page'

@Component({
  templateUrl: '../View/request-status.component.html',
})
export class RequestStatusTransferComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('table', { static: true }) table: any

  pagedResults: PagedData<any>

  localPagedResults: any = {}
  localDisplaySize = 20
  localSubscription: Subscription

  internationalPagedResults: any = {}
  internationalDisplaySize = 20
  internationalSubscription: Subscription

  futureLevels: any

  constructor(
    private service: RequestStatusTransferService,
    public translate: TranslateService,
    private router: Router,
    public authenticationService: AuthenticationService,
    protected injector: Injector,
    @Inject(LOCALE_ID) private _locale: string,
    public reactivationService: TransferReactivationService,
  ) {
    super()
  }

  ngOnInit(): void {
    super.ngOnInit()
    this.pagedResults = new PagedData()
    this.setPage(null)
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.subscriptions.push(this.service
      .getList(pageInfo.offset + 1, this.pagedResults.page.pageSize)
      .subscribe((result) => {
        if (!result.error) {
          const pagedData = new PagedData<any>()
          const pageObject = new Page()

          pageObject.pageNumber = pageInfo.offset
          pageObject.pageSize = this.pagedResults.page.pageSize
          pageObject.size = result.transfers.size
          pageObject.totalElements = result.transfers.total
          pageObject.totalPages = pageObject.totalElements / pageObject.pageSize

          pagedData.data = result.transfers.items
          pagedData.page = pageObject

          this.pagedResults = pagedData
        }
      }))
  }

  back() {
    this.router.navigate(['/transfers'])
  }

  openModal(row, popup) {
    popup.openModal(row)
  }

  setPageSize(event: any) {
    this.pagedResults.page.pageSize = +event.target.value
    this.setPage({ offset: 0 })
  }

  initiateReactivation(row) {
    if (row['batchType'] === 'TL') {
      this.reactivationService
        .getLocalTransferDetails([row])
        .subscribe((result) => {
          if (result.errorCode && result.errorCode === '0') {
            this.reactivationService.currentTransferDetailType = 'TL'
            this.reactivationService.currentTransactionDetailInformation =
              result
            this.router.navigateByUrl('/transfers/activate/local')
          }
        })
      return true
    }

    if (row['batchType'] === 'TW') {
      this.reactivationService
        .getAlrahjiTransferDetails([row])
        .subscribe((result) => {
          if (result.errorCode && result.errorCode === '0') {
            this.reactivationService.currentTransferDetailType = 'TW'
            this.reactivationService.currentTransactionDetailInformation =
              result
            this.router.navigateByUrl('/transfers/activate/within')
          }
        })
      return true
    }

    if (row['batchType'] === 'TI') {
      this.reactivationService
        .getInternationalTransferDetails([row])
        .subscribe((result) => {
          if (result.errorCode && result.errorCode === '0') {
            this.reactivationService.currentTransferDetailType = 'TI'
            this.reactivationService.currentTransactionDetailInformation =
              result
            this.router.navigateByUrl('/transfers/activate/international')
          }
        })
      return true
    }

    return false
  }
}
