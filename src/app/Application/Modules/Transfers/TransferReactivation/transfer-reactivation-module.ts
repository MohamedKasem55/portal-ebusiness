import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { routes } from './transfer-reactivation-route'
import { RouterModule } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import { ArbDesignComponentModule } from 'arb-design'
import { LocalTransferDataComponent } from './components/local/steps/local-transfer-data.component'
import { AlrahjiTransferDataComponent } from './components/within-alrajhi/steps/alrahji-transfer-data.component'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { LocalTransferReactivationComponent } from './components/local/local-transfer-reactivation.component'
import { WithinTransferReactivationComponent } from './components/within-alrajhi/within-transfer-reactivation.component'
import { WithinStep2Component } from './components/within-alrajhi/steps/within-step2.component'
import { WithinStep1Component } from './components/within-alrajhi/steps/within-step1.component'
import { WithinStep3Component } from './components/within-alrajhi/steps/within-step3.component'
import { InternationalTransferReactivationComponent } from './components/international/international-transfer-reactivation.component'
import { InternationalReactivationDataComponent } from './components/international/steps/international-reactivation-data.component'
import { InternationalReactivationStep1Component } from './components/international/steps/international-reactivation-step1.component'
import { InternationalReactivationStep2Component } from './components/international/steps/international-reactivation-step2.component'
import { InternationalReactivationStep3Component } from './components/international/steps/international-reactivation-step3.component'
import { LocalTransferStep1Component } from './components/local/steps/local-transfer-step1.component'
import { LocalTransferStep2Component } from './components/local/steps/local-transfer-step2.component'
import { LocalTransferStep3Component } from './components/local/steps/local-transfer-step3.component'
import { TransferInternationalService } from '../Services/transfer-international.service'
import { TransferReactivationService } from './transfer-reactivation.service'

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TranslateModule,
    ArbDesignComponentModule,
    CommonModule,
    AppSharedModule,
  ],
  declarations: [
    LocalTransferReactivationComponent,
    LocalTransferDataComponent,
    LocalTransferStep1Component,
    LocalTransferStep2Component,
    LocalTransferStep3Component,
    WithinTransferReactivationComponent,
    AlrahjiTransferDataComponent,
    WithinStep2Component,
    WithinStep1Component,
    WithinStep3Component,
    InternationalTransferReactivationComponent,
    InternationalReactivationDataComponent,
    InternationalReactivationStep1Component,
    InternationalReactivationStep2Component,
    InternationalReactivationStep3Component,
  ],
  providers: [],
  exports: [],
})
export class TransferReactivationModule {
  public static routes: any = routes
}
