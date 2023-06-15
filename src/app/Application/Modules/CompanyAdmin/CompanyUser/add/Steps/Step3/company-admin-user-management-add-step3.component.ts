import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'

@Component({
  selector: 'company-admin-user-management-add-step3',
  templateUrl: './company-admin-user-management-add-step3.component.html',
})
export class CompanyAdminUserManagementAddStep3Component
  implements OnInit, OnDestroy
{
  @Input() formModel: any

  @Input() userData: any = null

  @Input() combosData: any = {}

  @Input() messageError: any = {}

  subscriptions: Subscription[] = []

  constructor(public translate: TranslateService) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }
}
