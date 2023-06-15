import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { SharedModule } from '../../../shared/shared.module'
import { CardOperationsRoutingModule } from './card-operations-routing.module'
import { CardOperationsStep1Component } from './card-operations-step1.component'
import { CardOperationsStep2Component } from './card-operations-step2.component'
import { CardOperationsStep3Component } from './card-operations-step3.component'
import { CardOperationsStep4Component } from './card-operations-step4.component'
import { CardOperationsComponent } from './card-operations.component'
import { CardOperationsService } from './card-operations.service'

@NgModule({
  imports: [AppSharedModule, CardOperationsRoutingModule, SharedModule],
  declarations: [
    CardOperationsComponent,
    CardOperationsStep1Component,
    CardOperationsStep2Component,
    CardOperationsStep3Component,
    CardOperationsStep4Component,
  ],
  providers: [CardOperationsService],
})
export class CardOperationsModule {}
