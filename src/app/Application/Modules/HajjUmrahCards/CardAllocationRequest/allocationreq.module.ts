import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { ModalModule } from 'ngx-bootstrap/modal'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { AllocationreqRoutingModule } from './allocationreq-routing.module'
import { CardAllocationRequestComponent } from './card-allocation-request.component'
import { CardallReqService } from './cardall-req.service'
import { Step1Component } from './Steps/step1/step1.component'
import { Step2Component } from './Steps/step2/step2.component'
import { Step3Component } from './Steps/step3/step3.component'
import { Step4Component } from './Steps/step4/step4.component'

@NgModule({
  declarations: [
    CardAllocationRequestComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    AllocationreqRoutingModule,
    ModalModule,
    BsDatepickerModule,
  ],
  providers: [CardallReqService],
})
export class AllocationreqModule {}
