import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { BeneficiariesRoutingModule } from './beneficiaries-routing.module'
import { BeneficiariesComponent } from './beneficiaries.component'
import { BeneficiariesService } from './beneficiaries.service'
import { Step1Component } from './components/Step1/step1.component'
import { Step2Component } from './components/Step2/step2.component'
import { Step3Component } from './components/Step3/step3.component'

@NgModule({
  imports: [AppSharedModule, BeneficiariesRoutingModule],
  declarations: [
    BeneficiariesComponent,
    Step1Component,
    Step2Component,
    Step3Component,
  ],
  providers: [BeneficiariesService],
})
export class BeneficiariesModule {}
