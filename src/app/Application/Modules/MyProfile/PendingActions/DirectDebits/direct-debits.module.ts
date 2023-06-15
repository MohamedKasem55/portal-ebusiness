import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { Step1Component } from './components/Step1/step1.component'
import { Step2Component } from './components/Step2/step2.component'
import { Step3Component } from './components/Step3/step3.component'
import { DirectDebitsRoutingModule } from './direct-debits-routing.module'
import { DirectDebitsComponent } from './direct-debits.component'
import { DirectDebitsService } from './direct-debits.service'
import { ExportPADirectDebitComponent } from './components/export/export-pa-direct-debit.component'
import { LevelFormatPipe } from '../../../../Components/common/Pipes/getLevels-pipe'
import { DirectDebidTableComponent } from './components/common/direct-debid-table.component'
import { CommonModule } from '@angular/common'
import { SharedModule } from 'app/Application/Modules/shared/shared.module'
import { PendingActionsModule } from '../pending-actions.module'

@NgModule({
  imports: [
    AppSharedModule,
    DirectDebitsRoutingModule,
    BsDatepickerModule.forRoot(),
    CommonModule,
    SharedModule,
    PendingActionsModule,
  ],
  declarations: [
    DirectDebitsComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    DirectDebidTableComponent,
    ExportPADirectDebitComponent,
  ],
  providers: [DirectDebitsService, LevelFormatPipe],
})
export class DirectDebitsModule {}
