import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { ChartsModule } from 'ng2-charts'
import { AppSharedModule } from '../../../core/shared/shared.module'
import { AmountCurrencyPipe } from '../../Components/common/Pipes/amount-currency.pipe'
import { PrePaidCardService } from './prePaidCard.service'
import { routes } from './module-routes'
import { PrePaidCardsListModule } from './PrePaidCardList/prePaidCardList.modules'
import { AuthGuardRequestCards } from './PrePaidCardRequest/auth-guard.service'
import { AuthGuardCardPayment } from './PrePaidCardPayment/auth-guard.service'
import { AuthGuardResetPIN } from './PrePaidCardReset/auth-guard.service'
import { AuthGuardBlockCards } from './PrePaidCardBlock/auth-guard.service'
import { AuthGuardActivateCards } from './PrePaidCardActivate/auth-guard.service'
import { AuthGuardViewQueryCards } from './PrePaidCardViewQuery/auth-guard.service'
import { AuthGuardRequestStatus } from './RequestStatus/auth-guard-request-status.service'
import { PrePaidCardResetPINService } from './PrePaidCardReset/prePaidCardResetPin.service'
import { PrePaidCardBlockService } from './PrePaidCardBlock/prePaidCardBlock.service'
import { PrePaidCardPaymentService } from './PrePaidCardPayment/prePaidCardPayment.service'
import { StopPaymentService } from '../ChequebookManagement/stopPayment/stop-payment.service'
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PrePaidCardsListModule,
    AppSharedModule,
    ChartsModule,
    BsDatepickerModule.forRoot(),
    RouterModule.forChild(routes),
  ],
  providers: [
    AuthGuardRequestCards,
    AuthGuardCardPayment,
    AuthGuardResetPIN,
    AuthGuardBlockCards,
    AuthGuardActivateCards,
    AuthGuardViewQueryCards,
    AuthGuardRequestStatus,
    AmountCurrencyPipe,
    PrePaidCardResetPINService,
    PrePaidCardBlockService,
    PrePaidCardPaymentService,
    StopPaymentService,
    PrePaidCardService,
  ],
  exports: [],
})
export class ModuleImpl {
  public static routes: any = routes
}
