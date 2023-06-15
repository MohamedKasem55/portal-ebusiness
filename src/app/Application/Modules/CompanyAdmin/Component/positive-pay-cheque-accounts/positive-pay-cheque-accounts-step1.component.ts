import { HttpClient } from '@angular/common/http'
import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { Exception } from '../../../../Model/exception'
import { CompanyAdminPositivePayChequeAccountsService } from '../../Services/positive-pay-cheque-accounts/positive-pay-cheque-accounts.service'

@Component({
  selector: 'app-positive-pay-cheque-accounts-step1',
  templateUrl:
    '../../View/positive-pay-cheque-accounts/positive-pay-cheque-accounts-step1.component.html',
})
export class CompanyAdminPositivePayChequeAccountsStep1Component
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('tablePermision', { static: true }) tablePermision: any
  @Input() formNational: FormGroup
  @Input() form: any
  @Input() tableSelected: any[]
  tmpSelected: any = []
  tableAccounts: any = {}
  accounts: any[] = []
  messageError = {}
  tableDisplaySize = 10

  pageNumber = 1
  servicesUrl: string
  constructor(
    private http: HttpClient,
    public fb: FormBuilder,
    public config: ConfigResourceService,
    public PositivePayCheckService: CompanyAdminPositivePayChequeAccountsService,
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
    this.PositivePayCheckService.getAccounts().subscribe((response) => {
      if (
        response.hasOwnProperty('error') &&
        (<any>response).error instanceof Exception
      ) {
        this.onError(response)
      } else {
        this.tableAccounts = response
        for (let i = 0; i < this.tableAccounts.accountList.length; i++) {
          this.tableAccounts.accountList[i]['privilege'] =
            this.tableAccounts.permissionList[i]
          if (this.tableAccounts.permissionList[i]) {
            this.tmpSelected.push(this.tableAccounts.accountList[i])
          }
        }
        this.tableSelected.splice(0, this.tableSelected.length)
        this.tableSelected.push(...this.tmpSelected)
        //console.log(this.tableSelected);
      }
    })
  }

  onSelect({ selected }) {
    this.tableSelected.splice(0, this.tableSelected.length)
    this.tableSelected.push(...selected)
    //console.log(this.tableSelected);
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

  onDetailToggle(event) {
    //console.log('Detail Toggled', event);
  }
}
