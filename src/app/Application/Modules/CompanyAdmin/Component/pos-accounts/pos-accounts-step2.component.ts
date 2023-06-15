import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { CompanyAdminAccountsService } from '../../Services/company-admin-account.service'
import { PagedData } from '../../../../Model/paged-data'
import { Page } from '../../../../Model/page'

@Component({
  selector: 'app-pos-accounts-step2',
  templateUrl: '../../View/pos-accounts/pos-accounts-step2.component.html',
})
export class CompanyAdminPOSAccountsStep2Component
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('tablePermision', { static: true }) tablePermision: any
  @ViewChild('tableNoPermision', { static: true }) tableNoPermision: any

  @Input() tableAccounts: any
  @Input() accountSelected: any
  @Input() accountNotSelected: any

  accountSelectedPage: PagedData<any>
  accountNotSelectedPage: PagedData<any>
  messageError = {}
  tableDisplaySize = 10
  servicesUrl: string
  accounts: any[] = []

  constructor(
    public fb: FormBuilder,
    public translate: TranslateService,
    public service: CompanyAdminAccountsService,
    public config: ConfigResourceService,
  ) {
    super()
    this.servicesUrl = config.getServicesUrl()
    this.accountSelectedPage = new PagedData<any>()
    this.accountNotSelectedPage = new PagedData<any>()
  }

  getAllTables(): any[] {
    const tablas = []
    if (this.tablePermision) {
      tablas.push(this.tablePermision)
    }
    if (this.tableNoPermision) {
      tablas.push(this.tableNoPermision)
    }
    return tablas
  }

  ngOnInit() {
    super.ngOnInit()

    this.accountSelectedPage.data = this.accountSelected
    const pageAcctSelected = new Page()
    pageAcctSelected.pageNumber = 1
    pageAcctSelected.pageSize = 20
    pageAcctSelected.totalElements = this.accountSelected.length
    this.accountSelectedPage.page = pageAcctSelected

    this.accountNotSelectedPage.data = this.accountNotSelected
    let pageAcctNotSelected = new Page()
    pageAcctNotSelected.pageNumber = 1
    pageAcctNotSelected.pageSize = 20
    pageAcctNotSelected.totalElements = this.accountNotSelected.length
    this.accountNotSelectedPage.page = pageAcctNotSelected
  }

  onError(error: any) {
    const res = error
    this.messageError['code'] = res.error.errorCode
    this.messageError['description'] = res.error.errorDescription
  }

  setAcctNotSelectedPageSize(event: any) {
    this.accountNotSelectedPage.page.pageSize = +event.target.value
    this.tableNoPermision.offset = 0
    this.tableNoPermision.recalculate()
  }

  setAcctSelectedPageSize(event: any) {
    this.accountSelectedPage.page.pageSize = +event.target.value
    this.tablePermision.offset = 0
    this.tablePermision.recalculate()
  }
}
