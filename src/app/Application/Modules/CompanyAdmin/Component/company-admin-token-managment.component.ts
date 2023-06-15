// Imports
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { Page } from '../../../Model/page'
import { PagedData } from '../../../Model/paged-data'
import { CompanyAdminTokenManagmentService } from '../../../Modules/CompanyAdmin/Services/company-admin-token-managment.service'
import { tokenList } from '../Model/tokenList'

@Component({
  providers: [CompanyAdminTokenManagmentService],
  templateUrl: '../View/company-admin-token-managment.component.html',
})
export class CompanyAdminTokenManagment
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('tokenTable', { static: true }) table: any
  model: any = {}
  pagedData = new PagedData()
  order: string
  orderType: string
  error
  errorDescription
  loading = false

  subscriptions: Subscription[] = []

  organizationUsers: number = 0
  organizationUserTokens: number = 0
  unnasignedTokens: number = 0

  constructor(
    public route: ActivatedRoute,
    public companyAdmTokenMngService: CompanyAdminTokenManagmentService,
    public translate: TranslateService,
    public router: Router,
  ) {
    super()
    this.order = 'date'
    this.orderType = 'asc'
    this.pagedData.page = new Page()
    this.pagedData.page.pageNumber = 1
    this.pagedData.page.pageSize = 20

    this.pagedData.data = new Array<tokenList>()
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  ngOnInit() {
    super.ngOnInit()
    this.pagedData.page = new Page()
    this.pagedData.page.pageNumber = 1
    this.pagedData.page.pageSize = 20
    this.pagedData.data = new Array<tokenList>()
    this.setPage({ offset: 0 })
    this.subscriptions.push(
      this.translate.onLangChange.subscribe(() => {
        this.setPage({ offset: this.pagedData.page.pageNumber - 1 })
      }),
    )
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }

    this.pagedData.page.pageNumber = pageInfo.offset

    this.companyAdmTokenMngService
      .getTokenList(
        this.pagedData.page.pageNumber + 1,
        this.pagedData.page.pageSize,
        this.order,
        this.orderType,
      )
      .subscribe((result) => {
        if (result.errorCode) {
          this.errorDescription = result.errorDescription
          this.loading = false
        } else {
          this.pagedData = result
          this.loading = false
        }
      })

    this.companyAdmTokenMngService.getSummary().subscribe((r) => {
      const stats = r.tokenCompanySatistics
      this.organizationUsers =
        stats.numberOfCompanyUsers + stats.numberOfCompanyAdmins
      this.organizationUserTokens =
        stats.numberOfCompanyUsersWithToken +
        stats.numberOfCompanyAdminWithToken
      this.unnasignedTokens = stats.numberOfUnassignedToken
    })
  }

  setSort(sortInfo) {
    if (sortInfo.sorts[0]) {
      this.orderType = sortInfo.sorts[0].dir
      this.order = sortInfo.sorts[0].prop
    }

    this.pagedData.page.pageNumber = 1
    this.loading = true
    this.companyAdmTokenMngService
      .getTokenList(
        this.pagedData.page.pageNumber,
        this.pagedData.page.pageSize,
        this.order,
        this.orderType,
      )
      .subscribe((result) => {
        if (result.errorCode) {
          this.errorDescription = result.errorDescription
          this.loading = false
        } else {
          this.pagedData = result

          this.loading = false
        }
      })
  }

  onSelect({ selected }) {}

  goNewToken() {
    this.router.navigate([
      '/companyadmin/token/managment/request',
    ])
  }
}
