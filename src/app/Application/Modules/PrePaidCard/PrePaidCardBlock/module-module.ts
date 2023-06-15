import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RoutingModule } from './module-routes'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { ChartsModule } from 'ng2-charts'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { PrePaidCardBlockComponent } from './prePaidCardBlock.component'
import { PrePaidCardBlockStep1Component } from './prePaidCardBlock-step1.component'
import { PrePaidCardBlockStep2Component } from './prePaidCardBlock-step2.component'
import { PrePaidCardBlockStep3Component } from './prePaidCardBlock-step3.component'
import { AuthGuardBlockCards } from './auth-guard.service'
import { AuthGuardBlockReplCards } from './auth-guard-block-repl.service'
import { ModelPipe } from 'app/Application/Components/common/Pipes/model-pipe'

@NgModule({
  declarations: [
    PrePaidCardBlockComponent,
    PrePaidCardBlockStep1Component,
    PrePaidCardBlockStep2Component,
    PrePaidCardBlockStep3Component,
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    ChartsModule,
    BsDatepickerModule.forRoot(),
    RoutingModule,
  ],
  providers: [AuthGuardBlockCards, AuthGuardBlockReplCards, ModelPipe],
  exports: [
    PrePaidCardBlockComponent,
    PrePaidCardBlockStep1Component,
    PrePaidCardBlockStep2Component,
    PrePaidCardBlockStep3Component,
  ],
})
export class PrePaidCardBlockModule {}
