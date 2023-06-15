import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RoutingModule } from './module-routes'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { ChartsModule } from 'ng2-charts'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { PrePaidCardActivateComponent } from './prePaidCardActivate.component'
import { PrePaidCardActivateStep1Component } from './prePaidCardActivate-step1.component'
import { PrePaidCardActivateStep2Component } from './prePaidCardActivate-step2.component'
import { PrePaidCardActivateStep3Component } from './prePaidCardActivate-step3.component'
import { AuthGuardActivateCards } from './auth-guard.service'
import { PrePaidCardActivateService } from './prePaidCardActivate.service'

@NgModule({
  declarations: [
    PrePaidCardActivateComponent,
    PrePaidCardActivateStep1Component,
    PrePaidCardActivateStep2Component,
    PrePaidCardActivateStep3Component,
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    ChartsModule,
    BsDatepickerModule.forRoot(),
    RoutingModule,
  ],
  providers: [AuthGuardActivateCards, PrePaidCardActivateService],
  exports: [
    PrePaidCardActivateComponent,
    PrePaidCardActivateStep1Component,
    PrePaidCardActivateStep2Component,
    PrePaidCardActivateStep3Component,
  ],
})
export class PrePaidCardsActivateModule {}
