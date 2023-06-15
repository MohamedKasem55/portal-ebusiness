import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { CompanyAdminPositivePayChequeAccountsService } from '../../Services/positive-pay-cheque-accounts/positive-pay-cheque-accounts.service'

@Component({
  selector: 'app-positive-pay-cheque-accounts-step2',
  templateUrl:
    '../../View/positive-pay-cheque-accounts/positive-pay-cheque-accounts-step2.component.html',
})
export class CompanyAdminPositivePayChequeAccountsStep2Component
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('tablePermision', { static: true }) tablePermision: any
  @ViewChild('tableNoPermision', { static: true }) tableNoPermision: any

  @Input() formNational: FormGroup
  @Input() form: any
  @Input() tableAccounts: any
  @Input() accountNotSelected: any[]
  messageError = {}
  tableDisplaySize = 10
  servicesUrl: string
  accounts: any[] = []

  constructor(
    public fb: FormBuilder,
    public translate: TranslateService,
    public PositivePayCheckService: CompanyAdminPositivePayChequeAccountsService,
    public config: ConfigResourceService,
  ) {
    super()
    this.servicesUrl = config.getServicesUrl()
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
    //this.getAccounts();
    //this.validateAccounts(accounts);
    //console.log(this.tableAccounts);
  }

  onError(error: any) {
    const res = error
    this.messageError['code'] = res.error.errorCode
    this.messageError['description'] = res.error.errorDescription
  }
}
