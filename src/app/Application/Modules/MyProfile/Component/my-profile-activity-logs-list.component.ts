// Imports
import { Component, OnInit } from '@angular/core'
import { SessionStorageService } from 'ngx-webstorage'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { AuthenticationService } from '../../../../core/security/authentication.service'

@Component({
  templateUrl: '../View/my-profile-activity-logs-list.component.html',
})

// Component class implementing OnInit
export class MyProfileActivityLogsList
  extends DatatableMobileComponent
  implements OnInit
{
  public isCompanyAdmin = false
  public isVisiblesDateError = true
  public isVisiblesFutureDateError = true

  constructor(
    public authenticationService: AuthenticationService,
    private _sessionStorage: SessionStorageService,
  ) {
    super()
  }

  ngOnInit() {
    super.ngOnInit()
    this.isCompanyAdmin =
      this._sessionStorage.retrieve('groups')['CompanyAdmins']
  }
}
