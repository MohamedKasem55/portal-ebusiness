import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { AppSharedModule } from '../../../core/shared/shared.module'
import { routes } from './hajj-umrah-cards-routing.module'

// import { CardAllocationRequestComponent } from './cardAllocationRequest/card-allocation-request.component';
import { CardinquiresModule } from './CardInquires/cardinquires.module'
import { AllocationreqModule } from './CardAllocationRequest/allocationreq.module'
import { CardoperationsModule } from './CardOperations/cardoperations.module'
import { RequeststatusModule } from './RequestStatus/requeststatus.module'
import { CardReportsModule } from './Reports/card.reports.module'
import { StaticService } from './static.service'
import { HajjUmrahOptionsComponent } from './hajj-umrah-options.component'

@NgModule({
  declarations: [HajjUmrahOptionsComponent],
  imports: [
    CommonModule,
    AppSharedModule,
    CardinquiresModule,
    AllocationreqModule,
    CardoperationsModule,
    RequeststatusModule,
    CardReportsModule,
    // CardAllocationRequestComponent,
    RouterModule.forChild(routes),
  ],
  providers: [StaticService],
})
export class HajjUmrahCardsModule {}
