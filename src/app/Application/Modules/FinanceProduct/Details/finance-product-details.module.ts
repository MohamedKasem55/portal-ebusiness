import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { CurrentFinanceComponent } from './CurrentFinance/current-finance.component'
import { FinanceProductDetailsRoutingModule } from './finance-product-details-routing.module'
import { FinanceProductDetailsComponent } from './finance-product-details.component'
import { FinanceProductDetailsService } from './finance-product-details.service'
import { InstallmentsDetails } from './InstallmentsDetails/installments-details.component'
import { LoanExecutionComponent } from './LoanExecution/loan-execution.component'
import { ApplicationStatusComponent } from './LoanExecution/ApplicationStatus/application-status.component'
import { ContractComponent } from './LoanExecution/Contract/contract.component'
import { PromissoryNoteComponent } from './LoanExecution/PromissoryNote/promissory-note.component'
import { FinishComponent } from './LoanExecution/Finish/finish.component'
import { SellCommodityComponent } from './LoanExecution/SellCommodity/sell-commodity.component'
import { RequestedFinance } from './RequestedFinance/requested-finance.component'
import { IvrComponent } from './LoanExecution/IVR/ivr.component'
import { IvrSuccessComponent } from './LoanExecution/IVRSuccess/ivr-success.component'
import { FinalOfferComponent } from './LoanExecution/FinalOffer/final-offer.component'
import {NewRequestModule} from "../new-request/new-request.module";


@NgModule({
    imports: [
        AppSharedModule,
        BsDatepickerModule.forRoot(),
        FinanceProductDetailsRoutingModule,
        NewRequestModule,
    ],
  declarations: [
    FinanceProductDetailsComponent,
    LoanExecutionComponent,
    ApplicationStatusComponent,
    ContractComponent,
    PromissoryNoteComponent,
    FinishComponent,
    SellCommodityComponent,
    CurrentFinanceComponent,
    InstallmentsDetails,
    RequestedFinance,
    FinalOfferComponent,
    IvrComponent,
    IvrSuccessComponent
  ],
  providers: [FinanceProductDetailsService],
})
export class FinanceProductDetailsModule {}
