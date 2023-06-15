import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PrepaidCardsGuard } from './prepaid-cards.guard'
import { PrepaidCardsRoutingModule } from './prepaid-cards-routing.module'
import { PrepaidCardsService } from './prepaid-cards.service'
import { PrepaidCardsTableComponent } from './components/common/prepaid-cards-table.component'
import { PrepaidCardsComponent } from './prepaid-cards.component'
import { Step1Component } from './components/step1/step1.component'
import { Step2Component } from './components/step2/step2.component'
import { Step3Component } from './components/step3/step3.component'
import { PendingActionsModule } from '../pending-actions.module'
import { AppSharedModule } from 'app/core/shared/shared.module'

@NgModule({
  imports: [
    CommonModule,
    PrepaidCardsRoutingModule,
    PendingActionsModule,
    AppSharedModule,
  ],
  declarations: [
    PrepaidCardsTableComponent,
    PrepaidCardsComponent,
    Step1Component,
    Step2Component,
    Step3Component,
  ],
  providers: [PrepaidCardsGuard, PrepaidCardsService],
})
export class PrepaidCardsModule {}
