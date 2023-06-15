import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../core/shared/shared.module'
import { CardDetailsComponent } from './CardDetails/card-details.component'
import { FinishComponent } from './Finish/finish.component'
import { MRCCRoutingModule } from './mrcc-routing.module'
import { MRCCComponent } from './mrcc.component'
import { MRCCService } from './mrcc.service'
import { FinanceProductCodeService } from '../FinanceProduct/finance-product-code.service'




@NgModule({
  imports: [
    AppSharedModule,
    BsDatepickerModule.forRoot(),
    MRCCRoutingModule,
  ],
  declarations: [
    MRCCComponent,
    CardDetailsComponent,
    FinishComponent,
  ],
  providers: [MRCCService,FinanceProductCodeService],
})
export class ModuleImpl { }
