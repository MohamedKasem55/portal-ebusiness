import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { HajjUmrahRoutingModule } from './Hajj-Umrah-routing.module'
import { HajjUmrahComponent } from './Hajj-Umrah.component'
import { HajjUmrahTableComponent } from './components/common/Hajj-Umrah-table.component'
import { HajjUmrahAllocationsTableComponent } from './components/common/Hajj-Umrah-Allocations-table.component'
import { Step1Component } from './components/Step1/step1.component'
import { Step2Component } from './components/Step2/step2.component'
import { Step3Component } from './components/Step3/step3.component'
import { HajjUmrahService } from './Hajj-Umrah.service'
import { HajjUmrahGuard } from './Hajj-umrah.guard'
import { StaticService } from '../../../../Modules/Common/Services/static.service'
import { SharedModule } from '../../../shared/shared.module'
import { CommonModule } from '@angular/common'
import { PendingActionsModule } from '../pending-actions.module'

@NgModule({
  imports: [
    AppSharedModule,
    SharedModule,
    HajjUmrahRoutingModule,
    CommonModule,
    PendingActionsModule,
  ],
  declarations: [
    HajjUmrahTableComponent,
    HajjUmrahAllocationsTableComponent,
    HajjUmrahComponent,
    Step1Component,
    Step2Component,
    Step3Component,
  ],
  providers: [HajjUmrahService, HajjUmrahGuard, StaticService],
})
export class HajjUmrahModule {}
