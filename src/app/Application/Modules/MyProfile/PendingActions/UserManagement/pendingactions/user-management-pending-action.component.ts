import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { StaticService } from '../../../../Common/Services/static.service'
import { UserManagementPendingActionService } from './user-management-pending-action.service'
import { CompanyAdminUserManagementSelectedDataService } from '../../../../CompanyAdmin/CompanyUser/list/company-admin-user-management-selected-data.service'

@Component({
  selector: 'app-user-management-action',
  templateUrl: './user-management-pending-action.component.html',
  styleUrls: ['./user-management-pending-action.component.scss'],
})
export class UserManagementPendingActionComponent implements OnInit, OnDestroy {
  currentItem: any = null
  formModel: FormGroup = null
  entityProperties: any[] = []
  combosData: any[] = []

  constructor(
    public service: UserManagementPendingActionService,
    public staticService: StaticService,
    public translate: TranslateService,
    public router: Router,
    public userServe: CompanyAdminUserManagementSelectedDataService,
  ) {}

  ngOnInit() {}

  ngOnDestroy(): void {}

  onSelect(selected) {
    return selected
  }

  onClickItem(selected) {
    this.currentItem = selected
    this.userServe.setSelectedUser(selected)
  }

  closeItem() {
    this.currentItem = null
  }
}
