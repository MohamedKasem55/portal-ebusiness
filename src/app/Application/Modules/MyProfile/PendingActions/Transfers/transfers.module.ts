import { PendingActionsModule } from './../pending-actions.module'
import { WorkflowDetailsPopupComponent } from '../Component/workflow-details-popup/workflow-details-popup.component'
import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { TransferInternationalTableComponent } from './common/transfer-international-table.component'
import { TransferLocalTableComponent } from './common/transfer-local-table.component'
import { TransferWithinTableComponent } from './common/transfer-within-table.component'
import { Step1Component } from './components/Step1/step1.component'
import { Step2Component } from './components/Step2/step2.component'
import { Step3Component } from './components/Step3/step3.component'
import { TransfersRoutingModule } from './transfers-routing.module'
import { TransfersComponent } from './transfers.component'
import { TransfersGuard } from './transfers.guard'
import { TransfersService } from './transfers.service'
import { SharedModule } from '../../../shared/shared.module'
import { TransferCommonTableComponent } from './common/transfer-common-table.component'
import {TooltipModule} from "ngx-bootstrap/tooltip";
import { TransferOwnTableComponent } from './common/transfer-own-table/transfer-own-table.component';

@NgModule({
    imports: [
        CommonModule,
        AppSharedModule,
        TransfersRoutingModule,
        SharedModule,
        PendingActionsModule,
        TooltipModule,
    ],
  declarations: [
    TransferInternationalTableComponent,
    TransferLocalTableComponent,
    TransferWithinTableComponent,
    TransferCommonTableComponent,
    TransfersComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    TransferOwnTableComponent,
  ],
  providers: [TransfersService, TransfersGuard],
})
export class TransfersModule {}
