import { HttpClient } from '@angular/common/http'
import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { CompanyAdminAccountsService } from '../../Services/company-admin-account.service'
import { Exception } from 'app/Application/Model/exception'

@Component({
  selector: 'app-pos-accounts-step1',
  templateUrl: '../../View/pos-accounts/pos-accounts-step1.component.html',
})
export class CompanyAdminPOSAccountsStep1Component
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('tablePermision', { static: true }) tablePermision: any
  @Input() formNational: FormGroup
  tableSelected: any[] = []
  tmpSelected: any = []
  tableAccounts: any = {}
  accounts: any[] = []
  messageError = {}
  tableDisplaySize = 20

  pageNumber = 1
  servicesUrl: string
  constructor(
    private http: HttpClient,
    public fb: FormBuilder,
    public config: ConfigResourceService,
    public service: CompanyAdminAccountsService,
    public translate: TranslateService,
  ) {
    super()
    this.servicesUrl = config.getServicesUrl()
  }

  ngOnInit() {
    super.ngOnInit()
    this.getAccounts()
  }

  getAllTables(): any[] {
    const tablas = []
    if (this.tablePermision) {
      tablas.push(this.tablePermision)
    }
    return tablas
  }

  getAccounts() {
    this.service.getAccounts().subscribe((response) => {
      if (response instanceof Exception) {
        this.onError(response)
      } else {
        this.tableAccounts = response
        for (let i = 0; i < this.tableAccounts.permissionList.length; i++) {
          if (this.tableAccounts.permissionList[i]) {
            this.tmpSelected.push(this.tableAccounts.accountListDTO[i])
          }
        }
        this.tableSelected.splice(0, this.tableSelected.length)
        this.tableSelected.push(...this.tmpSelected)
      }
    })
  }

  onSelect({ selected }) {
    this.tableSelected.splice(0, this.tableSelected.length)
    this.tableSelected.push(...selected)
  }

  onError(error: any) {
    const res = error
    this.messageError['code'] = res.error.errorCode
    this.messageError['description'] = res.error.errorDescription
  }

  getId(row) {
    return row['fullAccountNumber']
  }

  getIdFunction() {
    return this.getId.bind(this)
  }

  setPageSize(event: any) {
    this.tableDisplaySize = +event.target.value
    this.tablePermision.offset = 0
    this.tablePermision.recalculate()
  }
}
