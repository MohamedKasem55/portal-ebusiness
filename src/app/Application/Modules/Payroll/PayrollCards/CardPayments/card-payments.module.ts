import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { AddCardPaymentsStep1Component } from './card-payments-add-step1.component'
import { AddCardPaymentsStep2Component } from './card-payments-add-step2.component'
import { AddCardPaymentsStep3Component } from './card-payments-add-step3.component'
import { AddCardPaymentsComponent } from './card-payments-add.component'
import { CardPaymentsRoutingModule } from './card-payments-routing.module'
import { CardPaymentsComponent } from './card-payments.component'

import { ListCardPaymentsComponent } from './card-payments-list.component'

// Service
import { SharedModule } from '../../../shared/shared.module'
import { PayrollCardPaymentsService } from './card-payments-service'

@NgModule({
  imports: [AppSharedModule, CardPaymentsRoutingModule, SharedModule],
  declarations: [
    CardPaymentsComponent,
    AddCardPaymentsComponent,
    AddCardPaymentsStep1Component,
    AddCardPaymentsStep2Component,
    AddCardPaymentsStep3Component,
    ListCardPaymentsComponent,
  ],
  providers: [PayrollCardPaymentsService],
})
export class CardPaymentsModule {}
