import {
  Component,
  Inject,
  LOCALE_ID,
  OnInit,
} from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  templateUrl: './company-admin-user-management-details-user-deleteOneStep.component.html',
})
// Component class implementing OnInit
export class CompanyAdminUserManagementDetailsUserDeleteOneStepComponent

  implements OnInit {

  constructor(
    public fb: FormBuilder,
    public route: ActivatedRoute,
    public router: Router,
    @Inject(LOCALE_ID) private _locale: string,
  ) {
  }

  ngOnInit() {
  }
}
