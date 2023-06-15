import { ViewCardCredentialsModule } from './../ViewCardCredentials/view-card-credentials.module';
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DebitCardsListComponent } from './components/debit-cards-list/debit-cards-list.component'
import { AppSharedModule } from '../../../core/shared/shared.module'
import { RouterModule } from '@angular/router'
import { ModalModule } from 'ngx-bootstrap/modal'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { routes } from './debit-cards.routes'
import { StaticService } from '../Common/Services/static.service'
import { DebitCardListService } from './components/debit-cards-list/debit-card-list.service'
import { DebitCardChangePinService } from './components/debit-card-change-pin/debit-card-change-pin.service'
import { DebitCardAdjustPosService } from './components/debit-card-adjust-pos/debit-card-adjust-pos.service'
import { DebitCardActionsComponent } from './components/debit-card-actions/debit-card-actions.component'
import { DebitCardActionsService } from './components/debit-card-actions/debit-card-actions.service'
import { DebitCardAdjustPosComponent } from './components/debit-card-adjust-pos/debit-card-adjust-pos.component'
import { DebitCardChangePinComponent } from './components/debit-card-change-pin/debit-card-change-pin.component'
import { DebitCardChangePinStep1Component } from './components/debit-card-change-pin/Steps/Step1/debit-card-change-pin-step1.component'
import { DebitCardChangePinStep2Component } from './components/debit-card-change-pin/Steps/Step2/debit-card-change-pin-step2.component'
import { DebitCardChangePinStep4Component } from './components/debit-card-change-pin/Steps/Step4/debit-card-change-pin-step4.component'
import { DebitCardChangePinFormComponent } from './components/debit-card-change-pin/Steps/Common/debit-card-change-pin-form.component'
import { DebitCardStopService } from './components/debit-card-stop/debit-card-stop.service'
import { DebitCardStopComponent } from './components/debit-card-stop/debit-card-stop.component'
import { DebitCardStopFormComponent } from './components/debit-card-stop/Steps/Common/debit-card-stop-form.component'
import { DebitCardStopStep1Component } from './components/debit-card-stop/Steps/Step1/debit-card-stop-step1.component'
import { DebitCardStopStep2Component } from './components/debit-card-stop/Steps/Step2/debit-card-stop-step2.component'
import { DebitCardStopStep3Component } from './components/debit-card-stop/Steps/Step3/debit-card-stop-step3.component'
import { DebitCardECommerceService } from './components/debit-card-e-commerce/debit-card-e-commerce.service'
import { DebitCardECommerceComponent } from './components/debit-card-e-commerce/debit-card-e-commerce.component'
import { DebitCardChangePinStep3Component } from './components/debit-card-change-pin/Steps/Step3/debit-card-change-pin-step3.component';
import { DebitCardApplyComponent } from './components/debit-card-apply/debit-card-apply.component';
import { CardDetailsComponent } from './components/debit-card-apply/card-details/card-details.component';
import { SelectPickUpComponent } from './components/debit-card-apply/select-pick-up/select-pick-up.component';
import { SummaryComponent } from './components/debit-card-apply/summary/summary.component';
import { FinishComponent } from './components/debit-card-apply/finish/finish.component'
import {DebitCardApplyService} from "./components/debit-card-apply/debit-card-apply.service";
import { CurrentAccountsService } from '../Accounts/accounts-current-account/accounts-current-account.service'

@NgModule({
  declarations: [
    DebitCardsListComponent,
    DebitCardActionsComponent,
    DebitCardAdjustPosComponent,
    DebitCardChangePinComponent,
    DebitCardChangePinStep1Component,
    DebitCardChangePinStep2Component,
    DebitCardChangePinStep3Component,
    DebitCardChangePinStep4Component,
    DebitCardChangePinFormComponent,
    DebitCardStopComponent,
    DebitCardStopStep1Component,
    DebitCardStopStep2Component,
    DebitCardStopStep3Component,
    DebitCardStopFormComponent,
    DebitCardECommerceComponent,
    DebitCardApplyComponent,
    CardDetailsComponent,
    SelectPickUpComponent,
    SummaryComponent,
    FinishComponent,
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    RouterModule.forChild(routes),
    ModalModule.forRoot(),
    ViewCardCredentialsModule,
    BsDatepickerModule.forRoot(),
  ],
  providers: [
    // injectable and services classes
    DebitCardListService,
    StaticService,
    DebitCardActionsService,
    DebitCardAdjustPosService,
    DebitCardChangePinService,
    DebitCardStopService,
    DebitCardECommerceService,
    DebitCardApplyService,
    CurrentAccountsService
  ],
  exports: [
    DebitCardsListComponent,
    DebitCardActionsComponent,
    DebitCardAdjustPosComponent,
    DebitCardChangePinComponent,
    DebitCardChangePinStep1Component,
    DebitCardChangePinStep2Component,
    DebitCardChangePinStep3Component,
    DebitCardChangePinStep4Component,
    DebitCardChangePinFormComponent,
    DebitCardStopComponent,
    DebitCardStopStep1Component,
    DebitCardStopStep2Component,
    DebitCardStopStep3Component,
    DebitCardStopFormComponent,
    DebitCardECommerceComponent,
  ],
})
export class DebitCardsModule {
  public static routes: any = routes
}
