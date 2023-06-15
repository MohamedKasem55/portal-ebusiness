import { Component, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-pos-accounts-step3',
  templateUrl: '../../View/pos-accounts/pos-accounts-step3.component.html',
})
export class CompanyAdminPOSAccountsStep3Component implements OnInit {
  messageError = {}

  constructor(
    public fb: FormBuilder,
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
