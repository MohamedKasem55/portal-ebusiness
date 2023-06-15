import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { CardOpeartionsService } from './card-opeartions.service'
import { CardOperationsComponent } from './card-operations.component'
import { CardoperationsRoutingModule } from './cardoperations-routing.module'
import { CardOperationsTableComponent } from './components/common/card-operations-table.component'
import { Step1Component } from './components/Step1/step1.component'
import { Step2Component } from './components/Step2/step2.component'
import { Step3Component } from './components/Step3/step3.component'
import { CardOperationsEntityService } from './card-opeartions-entity.service'
import { CardOperationFormComponent } from './components/common/card-operation-form.component'
import { SharedModule } from '../../shared/shared.module'

@NgModule({
  imports: [
    CommonModule,
    CardoperationsRoutingModule,
    AppSharedModule,
    SharedModule,
  ],
  declarations: [
    CardOperationsComponent,
    CardOperationsTableComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    CardOperationFormComponent,
  ],
  providers: [CardOpeartionsService, CardOperationsEntityService],
})
export class CardoperationsModule {}
