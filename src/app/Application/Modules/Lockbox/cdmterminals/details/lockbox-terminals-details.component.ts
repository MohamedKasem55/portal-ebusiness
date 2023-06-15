import {
  Component,
  Inject,
  Injector,
  LOCALE_ID,
  OnDestroy,
  OnInit,
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { AbstractAppComponent } from '../../../Common/Components/Abstract/abstract-app.component'
import { Router } from '@angular/router'
import { LockboxTerminalsDetailsService } from './lockbox-terminals-details.service'
import { TranslateService } from '@ngx-translate/core'
import { AuthenticationService } from '../../../../../core/security/authentication.service'
import { StaticService } from '../../../Common/Services/static.service'

@Component({
  selector: 'app-lockbox-terminals-details',
  templateUrl: './lockbox-terminals-details.component.html',
  styleUrls: ['./lockbox-terminals-details.component.scss'],
})
export class LockboxTerminalsDetailsComponent
  extends AbstractAppComponent
  implements OnInit, OnDestroy
{
  selectedItem: any

  detailsData: any

  entityProperties: any[] = []

  formModel: FormGroup

  routes: any[] = [
    ['dashboard.lockbox'],
    ['lockbox.cdmTerminals.menu', ['/lockbox/ca-cdm-terminals/list']],
    ['lockbox.cdmTerminals.details.menu'],
  ]

  // ----------------------------

  combosKeys: any[] = [
    // 'lockBoxMachineVendor',
    // 'lockBoxTerminalStatus',
    // 'process',
    // 'processStatus',
  ]
  combosData: any = {}

  constructor(
    public detailsService: LockboxTerminalsDetailsService,
    public fb: FormBuilder,
    public translate: TranslateService,
    public staticService: StaticService,
    public authenticationService: AuthenticationService,
    public router: Router,
    protected injector: Injector,
    @Inject(LOCALE_ID) private _locale: string,
  ) {
    super(translate)

    this.combosData = {}

    this.formModel = this.fb.group({})
  }

  ngOnInit() {
    this.selectedItem = this.detailsService.getSelectedItem()

    if (!this.selectedItem || !this.selectedItem.terminalID) {
      this.router.navigate([this.getBackUrl()])
      return
    }

    this.detailsData = null
    this.subscriptions.push(
      this.detailsService.detail(this.selectedItem).subscribe((response) => {
        this.detailsData = response.terminal
        this.detailsService.detailsData = this.detailsData
        const detailsData = Object.assign({}, this.detailsData)
        this.entityProperties =
          this.detailsService.configureDetailsFormModel(detailsData)
      }),
    )
    super.ngOnInit()
  }

  loadDataAndConfig() {
    this.subscriptions.push(
      this.staticService
        .getAllCombosAsArrays(this.combosKeys)
        .subscribe((resultC) => {
          const data: any = resultC
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.combosKeys.length; i++) {
            this.combosData[this.combosKeys[i]] = data[this.combosKeys[i]]
          }
          // -------------------------------------------------
          this.detailsData = null
          this.subscriptions.push(
            this.detailsService
              .detail(this.selectedItem)
              .subscribe((response) => {
                this.detailsData =
                  this.detailsService.getSelectedItemDetailsData()

                this.entityProperties =
                  this.detailsService.configureDetailsFormModel(
                    this.detailsData,
                  )
              }),
          )
          // -------------------------------------------------
        }),
    )
  }

  refreshData() {
    this.loadDataAndConfig()
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  formConfigured(event) {
    this.formModel.disable()
  }

  canExecuteAction(action) {
    switch (action) {
      case 'edit':
        return true || this.authenticationService.activateOption(null, [], [])
        break
      default:
        break
    }
    return false
  }

  isDisabledAction(action) {
    switch (action) {
      case 'edit':
        return false
        break
      default:
        break
    }
    return false
  }

  executeAction(action) {
    switch (action) {
      default:
        break
    }
    return false
  }

  getBackUrl() {
    return '/lockbox/ca-cdm-terminals/list'
  }
}
