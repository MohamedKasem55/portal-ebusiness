import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { AddBeneficiaryRoutingModule } from './add-beneficiary-routing.module'
import { AddBeneficiaryComponent } from './add-beneficiary.component'
import { AddBeneficiaryService } from './add-beneficiary.service'
import { Step1Component } from './components/Step1/step1.component'
import { Step2Component } from './components/Step2/step2.component'
import { Step3Component } from './components/Step3/step3.component'

@NgModule({
  imports: [
    AppSharedModule,
    AddBeneficiaryRoutingModule,
    BsDatepickerModule.forRoot(),
  ],
  declarations: [
    AddBeneficiaryComponent,
    Step1Component,
    Step2Component,
    Step3Component,
  ],
  providers: [AddBeneficiaryService],
})
export class AddBeneficiaryModule {}
