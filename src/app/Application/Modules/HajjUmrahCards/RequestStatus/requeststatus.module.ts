import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { ModelPipe } from '../../../Components/common/Pipes/model-pipe'
import { CardAllocationRequestComponent } from './components/allocation/card-allocation-request.component'
import { CardAllocationRequestService } from './components/allocation/card-allocation-request.service'
import { CardAllocationReactivateEntityService } from './components/allocation/reactivate/card-allocation-reactivate-entity.service'
import { CardAllocationReactivateComponent } from './components/allocation/reactivate/card-allocation-reactivate.component'
import { CardAllocationReactivateFormComponent } from './components/allocation/reactivate/common/card-allocation-form.component'
import { Step1Component as CardAllocationReactivateStep1Component } from './components/allocation/reactivate/Steps/Step1/step1.component'
import { Step2Component as CardAllocationReactivateStep2Component } from './components/allocation/reactivate/Steps/Step2/step2.component'
import { Step3Component as CardAllocationReactivateStep3Component } from './components/allocation/reactivate/Steps/Step3/step3.component'
import { CardOperationsRequestComponent } from './components/operations/card-operations-request.component'
import { CardOperationsRequestService } from './components/operations/card-operations-request.service'
import { CardOperationsReactivateEntityService } from './components/operations/reactivate/card-operations-reactivate-entity.service'
import { CardOperationsReactivateComponent } from './components/operations/reactivate/card-operations-reactivate.component'
import { CardOperationReactivateFormComponent } from './components/operations/reactivate/common/card-operation-form.component'
import { Step1Component as CardOperationReactivateStep1Component } from './components/operations/reactivate/Steps/Step1/step1.component'
import { Step2Component as CardOperationReactivateStep2Component } from './components/operations/reactivate/Steps/Step2/step2.component'
import { Step3Component as CardOperationReactivateStep3Component } from './components/operations/reactivate/Steps/Step3/step3.component'
import { RequestStatusComponent } from './request-status.component'
import { RequeststatusRoutingModule } from './requeststatus-routing.module'

@NgModule({
  declarations: [
    RequestStatusComponent,
    CardAllocationRequestComponent,
    CardOperationsRequestComponent,
    CardOperationsReactivateComponent,
    CardOperationReactivateFormComponent,
    CardOperationReactivateStep1Component,
    CardOperationReactivateStep2Component,
    CardOperationReactivateStep3Component,
    CardAllocationReactivateComponent,
    CardAllocationReactivateFormComponent,
    CardAllocationReactivateStep1Component,
    CardAllocationReactivateStep2Component,
    CardAllocationReactivateStep3Component,
  ],
  providers: [
    CardAllocationRequestService,
    CardOperationsRequestService,
    CardOperationsReactivateEntityService,
    CardAllocationReactivateEntityService,
    ModelPipe,
  ],
  imports: [
    BsDatepickerModule.forRoot(),
    CommonModule,
    AppSharedModule,
    RequeststatusRoutingModule,
  ],
})
export class RequeststatusModule {}
