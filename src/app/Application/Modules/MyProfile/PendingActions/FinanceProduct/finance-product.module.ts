import { NgModule } from '@angular/core'
import { AppSharedModule } from 'app/core/shared/shared.module'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { FinanceProductRoutingModule } from './finance-product-routing.module'
import { FinanceProductComponent } from './finance-product.component'
import { FinanceProductService } from './finance-product.service'
import { FinanceProductStep1Component } from './FinanceProductStep1/finance-product-step1.component'
import { FinanceProductStep3Component } from './FinanceProductStep3/finance-product-step3.component'

@NgModule({
  imports: [
    AppSharedModule,
    BsDatepickerModule.forRoot(),
    FinanceProductRoutingModule,
  ],
  declarations: [
    FinanceProductComponent,
    FinanceProductStep1Component,
    FinanceProductStep3Component,
  ],
  providers: [FinanceProductService],
})
export class FinanceProductModule {}
