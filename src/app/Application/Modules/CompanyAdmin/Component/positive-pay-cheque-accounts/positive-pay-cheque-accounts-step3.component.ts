import { Component, Input, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { CompanyAdminPositivePayChequeAccountsService } from '../../Services/positive-pay-cheque-accounts/positive-pay-cheque-accounts.service'

@Component({
  selector: 'app-positive-pay-cheque-accounts-step3',
  templateUrl:
    '../../View/positive-pay-cheque-accounts/positive-pay-cheque-accounts-step3.component.html',
})
export class CompanyAdminPositivePayChequeAccountsStep3Component
  implements OnInit
{
  @Input() formNational: FormGroup
  @Input() form: any
  @Input() tableAccounts: any
  messageError = {}
  accounts: any[] = []

  constructor(
    public fb: FormBuilder,
    public PositivePayCheckService: CompanyAdminPositivePayChequeAccountsService,
    public translate: TranslateService,
    private router: Router,
  ) {}

  ngOnInit() {}

  onError(error: any) {
    const res = error
    this.messageError['code'] = res.error.errorCode
    this.messageError['description'] = res.error.errorDescription
  }
}
