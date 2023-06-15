import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { ReconciliationRoutingModule } from './reconciliation-routing.module'
import { ReconciliationComponent } from './reconciliation.component'
import { ReconciliationService } from './reconciliation.service'

@NgModule({
  imports: [
    AppSharedModule,
    ReconciliationRoutingModule,
    BsDatepickerModule.forRoot(),
  ],
  declarations: [ReconciliationComponent],
  providers: [ReconciliationService],
})
export class ReconciliationModule {}
