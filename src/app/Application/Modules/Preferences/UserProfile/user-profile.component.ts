import {
  Component,
  Inject,
  Injector,
  LOCALE_ID,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { StorageService } from '../../../../core/storage/storage.service'
import { StaticService } from '../../Common/Services/static.service'
import { Exception } from 'app/Application/Model/exception'
import { UserDetails } from '../../CompanyAdmin/Model/userDetails'
import { UserProfileService } from '../user-profile.service'
import { CompanyAdminUserManagementEditFormService } from '../../Common/Components/CompanyAdmin/CompanyUser/UserForm/company-admin-user-management-edit-form.service'

enum AuthTypeEnum {
  Static = 'STATIC',
  Otc = 'OTC',
  Challenge = 'CHALLENGE',
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('checkboxesCell', { static: true })
  public checkboxCellTemplate: TemplateRef<any>
  @ViewChild('accountsTable', { static: true }) public accountsTable: any
  @ViewChild('privilegesTable', { static: true }) public privilegesTable: any

  public AuthType = AuthTypeEnum

  formModel: FormGroup

  userData: any

  user: any

  combosData: any = {}

  messageError: any = {}

  subscriptions: Subscription[] = []

  constructor(
    public fb: FormBuilder,
    private userProfileService: UserProfileService,
    private translateService: TranslateService,
    private storage: StorageService,
    public staticService: StaticService,
    public formService: CompanyAdminUserManagementEditFormService,
    @Inject(LOCALE_ID) private _locale: string,
    private injector: Injector,
  ) {
    super()

    this.combosData['tokens'] = []
  }

  ngOnInit() {
    super.ngOnInit()
    const storageVal = this.storage.retrieve('currentuser')
    if (!storageVal) {
      return
    }
    const userTemp = JSON.parse(storageVal)

    this.messageError = {}

    this.subscriptions.push(
      this.userProfileService
        .get(userTemp.user.userId)
        .subscribe((response: any) => {
          if (
            response.errorCode != '0' ||
            response.hasOwnProperty('error') ||
            response.error instanceof Exception
          ) {
            const res = response
            this.messageError['code'] = res.error.errorCode
            this.messageError['description'] = res.error.errorDescription
          } else {
            this.messageError = {}
            this.user = response
            this.userData = response

            this.combosData['tokens'].push(
              ...this.userData.unassignedHardSerialList,
            )
            this.combosData['tokens'].push(
              ...this.userData.unassignedSoftSerialList,
            )

            this.formModel = this.formService.createUserForm(this.userData)
          }
        }),
    )
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.accountsTable)
    tablas.push(this.privilegesTable)
    return tablas
  }
}

export class Privilege {
  levels: boolean[]
  functionality: string
}

export class Acount {
  inquiry: boolean[]
  levels: boolean[]
  name: string
}
