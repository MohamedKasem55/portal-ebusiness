import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { AuthenticationService } from 'app/core/security/authentication.service'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../../core/responsive/datatable-mobile.component'
import { Exception } from '../../../../../Model/exception'
import { Page } from '../../../../../Model/page'
import { PagedData } from '../../../../../Model/paged-data'
import { BeneficiaryListService } from '../../../Services/aramco-beneficiary/beneficiary-list.service'
import { SharedDataService } from '../../../Services/aramco-beneficiary/shared-data.service'

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('paymentsPageTable', { static: true }) table: any

  sharedData: any = {}
  subscriptions: Subscription[] = []

  paymentsPage: any

  step = 'details'

  constructor(
    private service: BeneficiaryListService,
    public translate: TranslateService,
    public router: Router,
    public authenticationService: AuthenticationService,
    public sharedService: SharedDataService,
  ) {
    super()

    this.paymentsPage = new PagedData<any>()
    this.paymentsPage.data = []
    const page = new Page()
    page.pageNumber = 0
    page.pageSize = 20
    this.paymentsPage.page = page
  }

  getAllTables(): any[] {
    const tablas = []
    if (this.table) {
      tablas.push(this.table)
    }
    return tablas
  }

  setPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }
    this.paymentsPage.page.pageNumber = dataTableEvent.offset
    this.sharedData.detailsPage = this.paymentsPage.page.pageNumber + 1
    this.sharedData.detailsRows = this.paymentsPage.page.pageSize
    this.subscriptions.push(
      this.service
        .listDetails(
          this.sharedData.details,
          this.sharedData.detailsPage,
          this.sharedData.detailsRows,
        )
        .subscribe((result) => {
          if (
            result.hasOwnProperty('error') &&
            (<any>result).error instanceof Exception
          ) {
            return
          } else {
            this.paymentsPage.data = result.aramcoPaymentList.items
            this.paymentsPage.page.size = result.aramcoPaymentList.size
            this.paymentsPage.page.totalElements =
              result.aramcoPaymentList.total
          }
        }),
    )
  }

  ngOnInit(): void {
    super.ngOnInit()
    this.sharedData = this.sharedService.getData()
    this.setPage(null)
    this.subscriptions.push(
      this.translate.onLangChange.subscribe(
        function (event: LangChangeEvent) {
          this.setPage(null)
        }.bind(this),
      ),
    )
  }

  backButton() {
    this.router.navigate(['/companyadmin/aramco/beneficiaryList'])
  }

  deleteDetails() {
    this.sharedData.deleted = []
    this.sharedData.deleted.push(this.sharedData.details)
    this.sharedService.setData(this.sharedData)
    this.router.navigate(['/companyadmin/aramco/beneficiaryList/delete'])
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }
}
