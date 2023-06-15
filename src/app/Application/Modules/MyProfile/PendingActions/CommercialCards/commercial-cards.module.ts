import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { CommercialCardsRoutingModule } from './commercial-cards-routing.module'
import { CommercialCardsComponent } from './commercial-cards.component'
import { CommercialCardsTableComponent } from './components/common/commercial-cards-table.component'
import { Step1Component } from './components/Step1/step1.component'
import { Step2Component } from './components/Step2/step2.component'
import { Step3Component } from './components/Step3/step3.component'
import { CommercialCardsService } from './commercial-cards.service'
import { CommercialCardsGuard } from './commercial-cards.guard'
import { CommonModule } from '@angular/common'
import { SharedModule } from 'app/Application/Modules/shared/shared.module'
import { PendingActionsModule } from '../pending-actions.module'

@NgModule({
  imports: [
    AppSharedModule,
    CommercialCardsRoutingModule,
    CommonModule,
    SharedModule,
    PendingActionsModule,
  ],
  declarations: [
    CommercialCardsTableComponent,
    CommercialCardsComponent,
    Step1Component,
    Step2Component,
    Step3Component,
  ],
  providers: [CommercialCardsService, CommercialCardsGuard],
})
export class CommercialCardsModule {}
