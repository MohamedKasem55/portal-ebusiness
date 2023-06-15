import { Component, Input, ViewChild } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'

import { AuthenticationService } from 'app/core/security/authentication.service'
import { DebitCardActionsService } from './debit-card-actions.service'
import { DebitCardAdjustPosComponent } from '../debit-card-adjust-pos/debit-card-adjust-pos.component'
import { DebitCardChangePinComponent } from '../debit-card-change-pin/debit-card-change-pin.component'
import { DebitCardStopComponent } from '../debit-card-stop/debit-card-stop.component'
import { DebitCardECommerceComponent } from '../debit-card-e-commerce/debit-card-e-commerce.component'

@Component({
  selector: 'app-debit-card-actions',
  templateUrl: './debit-card-actions.component.html',
  styleUrls: ['./debit-card-actions.component.scss'],
})
export class DebitCardActionsComponent {
  activeTab: number

  @Input()
  carouselDisplayingCard: any

  @ViewChild(DebitCardAdjustPosComponent)
  posForm: DebitCardAdjustPosComponent
  @ViewChild(DebitCardChangePinComponent)
  pinForm: DebitCardChangePinComponent
  @ViewChild(DebitCardStopComponent)
  stopForm: DebitCardStopComponent
  @ViewChild(DebitCardECommerceComponent)
  ecommerceForm: DebitCardECommerceComponent

  constructor(
    public fb: FormBuilder,
    public service: DebitCardActionsService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
  ) {
    this.activeTab = 1
  }

  back() {
    this.service.clearData()
    this.router.navigate(['/'])
  }

  setActiveTab(tab) {
    this.activeTab = tab
    if (this.pinForm.formModel.dirty) {
      this.pinForm.formModel.reset()
    }
    if (this.stopForm.formModel.dirty) {
      this.stopForm.formModel.reset()
    }
    if (this.ecommerceForm.formModel.dirty) {
      this.ecommerceForm.formModel.reset()
    }
    if (this.posForm.formModel.dirty) {
      this.posForm.formModel.reset()
    }
  }

  isActiveTab(tab) {
    return this.activeTab == tab
  }
}
