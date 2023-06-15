import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { InvoiceHUBTableComponent } from './common/invoiceHUB-table.component'
import { Step1Component } from './components/Step1/step1.component'
import { Step2Component } from './components/Step2/step2.component'
import { Step3Component } from './components/Step3/step3.component'
import { InvoiceHubGuard } from './invoice-hub.guard'
import { InvoiceHUBRoutingModule } from './invoiceHUB-routing.module'
import { InvoiceHUBComponent } from './invoiceHUB.component'
import { InvoiceHUBService } from './invoiceHUB.service'
import { CommonModule } from '@angular/common'
import { SharedModule } from 'app/Application/Modules/shared/shared.module'
import { PendingActionsModule } from '../pending-actions.module'

@NgModule({
  imports: [
    AppSharedModule,
    InvoiceHUBRoutingModule,
    CommonModule,
    SharedModule,
    PendingActionsModule,
  ],
  declarations: [
    InvoiceHUBTableComponent,
    InvoiceHUBComponent,
    Step1Component,
    Step2Component,
    Step3Component,
  ],
  providers: [InvoiceHUBService, InvoiceHubGuard],
})
export class InvoiceHUBModule {}
