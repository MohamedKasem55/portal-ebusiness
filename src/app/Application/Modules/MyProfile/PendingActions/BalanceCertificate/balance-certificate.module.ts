import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { BalanceCertificateRoutingModule } from './balance-certificate-routing.module'
import { BalanceCertificateComponent } from './balance-certificate.component'
import { BalanceCertificateGuard } from './balance-certificate.guard'
import { BalanceCertificateService } from './balance-certificate.service'
import { BalanceCertificateTableComponent } from './components/common/balance-certificate-table.component'
import { Step1Component } from './components/Step1/step1.component'
import { Step2Component } from './components/Step2/step2.component'
import { Step3Component } from './components/Step3/step3.component'
import { CommonModule } from '@angular/common'
import { SharedModule } from 'app/Application/Modules/shared/shared.module'
import { PendingActionsModule } from '../pending-actions.module'

@NgModule({
  imports: [
    AppSharedModule,
    BalanceCertificateRoutingModule,
    CommonModule,
    SharedModule,
    PendingActionsModule,
  ],
  declarations: [
    BalanceCertificateComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    BalanceCertificateTableComponent,
  ],
  providers: [BalanceCertificateService, BalanceCertificateGuard],
})
export class BalanceCertificateModule {}
