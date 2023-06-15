import { StopPaymentService } from './../ChequebookManagement/stopPayment/stop-payment.service'
import { BlockCardsService } from './BlockCards/blockCards.service'
import { ResetPINService } from './ResetPIN/resetPIN.service'
import { AuthGuardViewQueryCards } from './ViewQueryCards/auth-guard.service'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CommercialCardsManagementRoutingModule } from './module-routes'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
// import { ChartsModule } from 'ng2-charts/ng2-charts';
import { ChartsModule } from 'ng2-charts'
import { CommercialCardsManagementOptionsComponent } from './commercial-cards-management-options.component'
import { AuthGuardRequestStatus } from './RequestStatus/auth-guard-request-status.service'
import { AmountCurrencyPipe } from '../../Components/common/Pipes/amount-currency.pipe'
import { AppSharedModule } from 'app/core/shared/shared.module'
import { CardPaymentService } from './CardPayment/cardPayment.service'

@NgModule({
  declarations: [CommercialCardsManagementOptionsComponent],
  imports: [
    CommonModule,
    AppSharedModule,
    ChartsModule,
    BsDatepickerModule.forRoot(),
    CommercialCardsManagementRoutingModule,
  ],
  providers: [
    AuthGuardViewQueryCards,
    AuthGuardRequestStatus,
    AmountCurrencyPipe,
    ResetPINService,
    BlockCardsService,
    StopPaymentService,
    CardPaymentService,
  ],
  exports: [CommercialCardsManagementOptionsComponent],
})
export class ModuleImpl {}
