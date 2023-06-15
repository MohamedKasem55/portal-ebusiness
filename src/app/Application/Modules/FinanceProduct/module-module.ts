import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../core/shared/shared.module'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { FinanceProductRoutingModule } from './finance-product-module-routes'
import { FinanceProductDetailsGuard } from './Details/finance-product-details.guard'
import { FinanceProductNewRequestGuard } from './pos/NewRequest/finance-product-new-request.guard'
import { ModalModule } from 'ngx-bootstrap/modal'
import { FinanceProductCodeService } from './finance-product-code.service'

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BsDatepickerModule.forRoot(),
    AppSharedModule,
    FinanceProductRoutingModule,
    ModalModule.forRoot(),
  ],

  providers: [
    FinanceProductDetailsGuard,
    FinanceProductNewRequestGuard,
    FinanceProductCodeService,
  ],
  exports: [],
})
export class FinanceModule {}
