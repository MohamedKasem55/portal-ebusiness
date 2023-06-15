import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'

@Component({
  selector: 'company-admin-user-management-edit-step2',
  templateUrl: './company-admin-user-management-edit-step2.component.html',
})
export class CompanyAdminUserManagementEditStep2Component
  implements OnInit, OnDestroy
{
  @Input() formModel: any

  @Input() user: any = null

  @Input() userData: any = null

  @Input() combosData: any = {}

  @Input() messageError: any = {}

  subscriptions: Subscription[] = []

  constructor(public translate: TranslateService) {}

  ngOnInit() {
    this.formModel.disable()
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }
}
