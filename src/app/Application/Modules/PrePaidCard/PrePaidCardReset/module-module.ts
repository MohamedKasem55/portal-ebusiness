import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RoutingModule } from './module-routes'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { ChartsModule } from 'ng2-charts'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { PrePaidCardResetPinComponent } from './prePaidCardResetPin.component'
import { PrePaidCardResetPinStep1Component } from './prePaidCardResetPin-step1.component'
import { PrePaidCardResetPinStep2Component } from './prePaidCardResetPin-step2.component'
import { PrePaidCardResetPinStep3Component } from './prePaidCardResetPin-step3.component'
import { AuthGuardResetPIN } from './auth-guard.service'
import { StaticService } from '../../Common/Services/static.service'

@NgModule({
  declarations: [
    PrePaidCardResetPinComponent,
    PrePaidCardResetPinStep1Component,
    PrePaidCardResetPinStep2Component,
    PrePaidCardResetPinStep3Component,
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    ChartsModule,
    BsDatepickerModule.forRoot(),
    RoutingModule,
  ],
  providers: [AuthGuardResetPIN, StaticService],
  exports: [
    PrePaidCardResetPinComponent,
    PrePaidCardResetPinStep1Component,
    PrePaidCardResetPinStep2Component,
    PrePaidCardResetPinStep3Component,
  ],
})
export class PrePaidCardResetPINModule {}
