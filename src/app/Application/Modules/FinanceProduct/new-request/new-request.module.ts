import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewRequestRoutingModule } from './new-request-routing.module';
import { FinanceProductsComponent } from './pages/finance-products/finance-products.component';
import { SharedModule } from '../shared/shared.module';
import { RequestRequiredDocsComponent } from './pages/request-required-docs/request-required-docs.component'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { FinanceProductNewRequestService } from '../pos/NewRequest/finance-product-new-request.service'
import { ResultComponent } from 'app/Application/Modules/FinanceProduct/new-request/pages/result/result.component'
import { TranslateModule } from '@ngx-translate/core'
import { BranchesComponent } from 'app/Application/Modules/FinanceProduct/new-request/pages/branches/branches.component'
import { ExistApplicationComponent } from 'app/Application/Modules/FinanceProduct/new-request/pages/exist-application/exist-application.component'
import {FinanceProductDetailsService} from "../Details/finance-product-details.service";


@NgModule({
  declarations: [
    FinanceProductsComponent,
    RequestRequiredDocsComponent,
    ResultComponent,
    BranchesComponent,
    ExistApplicationComponent,
  ],
  imports: [
    AppSharedModule,
    CommonModule,
    NewRequestRoutingModule,
    SharedModule,
    TranslateModule,

  ],
  exports: [ResultComponent],
  providers:[
    FinanceProductNewRequestService,
    FinanceProductDetailsService
  ]
})
export class NewRequestModule { }
