import { ViewCardCredentialsComponent } from './../../ViewCardCredentials/view-card-credentials.component';
import { ViewQueryCardsService } from './viewQueryCards.service'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RoutingModule } from './module-routes'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { ChartsModule } from 'ng2-charts'
import { ViewQueryCardsComponent } from './viewQueryCards.component'
import { AuthGuardViewQueryCards } from './auth-guard.service'
import { CardsDetailsStatementsComponent } from './details-statements/cards-details-statements.component'
import { CardsDetailsStatementsService } from './details-statements/cards-details-statements.service'
import { AppSharedModule } from 'app/core/shared/shared.module'
import { ResetPINComponent } from '../ResetPIN/resetPIN.component'
import { ResetPINStep1Component } from '../ResetPIN/resetPIN-step1.component'
import { ResetPINStep2Component } from '../ResetPIN/resetPIN-step2.component'
import { ResetPINStep3Component } from '../ResetPIN/resetPIN-step3.component'
import { BlockCardsComponent } from '../BlockCards/blockCards.component'
import { BlockCardsStep1Component } from '../BlockCards/blockCards-step1.component'
import { BlockCardsStep2Component } from '../BlockCards/blockCards-step2.component'
import { BlockCardsStep3Component } from '../BlockCards/blockCards-step3.component'
import { CardPaymentComponent } from '../CardPayment/cardPayment.component'
import { CardPaymentStep1Component } from '../CardPayment/cardPayment-step1.component'
import { CardPaymentStep2Component } from '../CardPayment/cardPayment-step2.component'
import { CardPaymentStep3Component } from '../CardPayment/cardPayment-step3.component'
import { ActivateCardsComponent } from '../ActivateCards/activateCards.component'
import { ActivateCardsStep1Component } from '../ActivateCards/activateCards-step1.component'
import { ActivateCardsStep2Component } from '../ActivateCards/activateCards-step2.component'
import { ActivateCardsStep3Component } from '../ActivateCards/activateCards-step3.component'
import { ActivateCardsService } from '../ActivateCards/activateCards.service'
import { ViewCardCredentialsModule } from '../../ViewCardCredentials/view-card-credentials.module';

@NgModule({
  declarations: [
    ViewQueryCardsComponent,
    CardsDetailsStatementsComponent,
    ResetPINComponent,
    ResetPINStep1Component,
    ResetPINStep2Component,
    ResetPINStep3Component,
    BlockCardsComponent,
    BlockCardsStep1Component,
    BlockCardsStep2Component,
    BlockCardsStep3Component,
    CardPaymentComponent,
    CardPaymentStep1Component,
    CardPaymentStep2Component,
    CardPaymentStep3Component,
    ActivateCardsComponent,
    ActivateCardsStep1Component,
    ActivateCardsStep2Component,
    ActivateCardsStep3Component,
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    ChartsModule,
    BsDatepickerModule.forRoot(),
    ViewCardCredentialsModule,
    RoutingModule,
  ],
  providers: [
    AuthGuardViewQueryCards,
    ViewQueryCardsService,
    CardsDetailsStatementsService,
    ActivateCardsService],
  exports: [ViewQueryCardsComponent],
})
export class ViewQueryCardsModule { }
