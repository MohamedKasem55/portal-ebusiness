import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { ModalModule } from 'ngx-bootstrap/modal'
import { AppSharedModule } from '../../../core/shared/shared.module'
import { StaticService } from '../../Modules/Common/Services/static.service'
import { CreditCardActivationComponent } from './components/activation/credit-card-activation.component'
import { CreditCardActivationGuard } from './components/activation/credit-card-activation.guard'
import { CreditCardActivationService } from './components/activation/credit-card-activation.service'
import { CreditCardActivationFormComponent } from './components/activation/Steps/Common/credit-card-activation-form.component'
import { CreditCardActivationStep1Component } from './components/activation/Steps/Step1/credit-card-activation-step1.component'
import { CreditCardActivationStep2Component } from './components/activation/Steps/Step2/credit-card-activation-step2.component'
import { CreditCardActivationStep3Component } from './components/activation/Steps/Step3/credit-card-activation-step3.component'
import { CreditCardCancellationComponent } from './components/cancellation/credit-card-cancellation.component'
import { CreditCardCancellationGuard } from './components/cancellation/credit-card-cancellation.guard'
import { CreditCardCancellationService } from './components/cancellation/credit-card-cancellation.service'
import { CreditCardCancellationFormComponent } from './components/cancellation/Steps/Common/credit-card-cancellation-form.component'
import { CreditCardCancellationStep1Component } from './components/cancellation/Steps/Step1/credit-card-cancellation-step1.component'
import { CreditCardCancellationStep2Component } from './components/cancellation/Steps/Step2/credit-card-cancellation-step2.component'
import { CreditCardCancellationStep3Component } from './components/cancellation/Steps/Step3/credit-card-cancellation-step3.component'
import { CreditCardsDetailsChangeMailingAddressComponent } from './components/details-change-mailing-address/credit-cards-details-change-mailing-address.component'
import { CreditCardsDetailsChangeMailingAddressService } from './components/details-change-mailing-address/credit-cards-details-change-mailing-address.service'
import { CreditCardsDetailsChangeMailingAddressFormComponent } from './components/details-change-mailing-address/Steps/Common/credit-cards-details-change-mailing-address-form.component'
import { CreditCardsDetailsChangeMailingAddressStep1Component } from './components/details-change-mailing-address/Steps/Step1/credit-cards-details-change-mailing-address-step1.component'
import { CreditCardsDetailsChangeMailingAddressStep2Component } from './components/details-change-mailing-address/Steps/Step2/credit-cards-details-change-mailing-address-step2.component'
import { CreditCardsDetailsChangeMailingAddressStep3Component } from './components/details-change-mailing-address/Steps/Step3/credit-cards-details-change-mailing-address-step3.component'
import { CreditCardsDetailsPaymentsInAdvanceComponent } from './components/details-payments-in-advance/credit-cards-details-payments-in-advance.component'
import { CreditCardsDetailsPaymentsInAdvanceService } from './components/details-payments-in-advance/credit-cards-details-payments-in-advance.service'
import { CreditCardsDetailsPaymentsInAdvanceFormComponent } from './components/details-payments-in-advance/Steps/Common/credit-cards-details-payments-in-advance-form.component'
import { CreditCardsDetailsPaymentsInAdvanceStep1Component } from './components/details-payments-in-advance/Steps/Step1/credit-cards-details-payments-in-advance-step1.component'
import { CreditCardsDetailsPaymentsInAdvanceStep2Component } from './components/details-payments-in-advance/Steps/Step2/credit-cards-details-payments-in-advance-step2.component'
import { CreditCardsDetailsPaymentsInAdvanceStep3Component } from './components/details-payments-in-advance/Steps/Step3/credit-cards-details-payments-in-advance-step3.component'
import { CreditCardsDetailsStatementsComponent } from './components/details-statements/credit-cards-details-statements.component'
import { CreditCardsDetailsStatementsService } from './components/details-statements/credit-cards-details-statements.service'
import { CreditCardsDetailsTransactionsComponent } from './components/details-transactions/credit-cards-details-transactions.component'
import { CreditCardsDetailsTransactionsService } from './components/details-transactions/credit-cards-details-transactions.service'
import { CreditCardDetailsComponent } from './components/details/credit-card-details.component'
import { CreditCardDetailsService } from './components/details/credit-card-details.service'
import { CreditCardListComponent } from './components/list/credit-card-list.component'
import { CreditCardListService } from './components/list/credit-card-list.service'
import { CreditCardsGuard } from './credit-cards.guard'
import { routes } from './credit-cards.routes'

@NgModule({
  imports: [
    CommonModule,
    AppSharedModule,
    RouterModule.forChild(routes),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ],
  providers: [
    // injectable and services classes
    CreditCardsGuard,
    StaticService,
    CreditCardDetailsService,
    CreditCardListService,
    CreditCardsDetailsStatementsService,
    CreditCardsDetailsTransactionsService,
    CreditCardActivationGuard,
    CreditCardActivationService,
    CreditCardCancellationGuard,
    CreditCardCancellationService,
    CreditCardsDetailsPaymentsInAdvanceService,
    CreditCardsDetailsChangeMailingAddressService,
  ],
  declarations: [
    // model and components classes definitions
    CreditCardListComponent,
    CreditCardDetailsComponent,
    CreditCardsDetailsStatementsComponent,
    CreditCardsDetailsTransactionsComponent,
    CreditCardActivationComponent,
    CreditCardActivationFormComponent,
    CreditCardActivationStep1Component,
    CreditCardActivationStep2Component,
    CreditCardActivationStep3Component,
    CreditCardCancellationComponent,
    CreditCardCancellationFormComponent,
    CreditCardCancellationStep1Component,
    CreditCardCancellationStep2Component,
    CreditCardCancellationStep3Component,
    CreditCardsDetailsPaymentsInAdvanceComponent,
    CreditCardsDetailsPaymentsInAdvanceFormComponent,
    CreditCardsDetailsPaymentsInAdvanceStep1Component,
    CreditCardsDetailsPaymentsInAdvanceStep2Component,
    CreditCardsDetailsPaymentsInAdvanceStep3Component,
    CreditCardsDetailsChangeMailingAddressComponent,
    CreditCardsDetailsChangeMailingAddressFormComponent,
    CreditCardsDetailsChangeMailingAddressStep1Component,
    CreditCardsDetailsChangeMailingAddressStep2Component,
    CreditCardsDetailsChangeMailingAddressStep3Component,
  ],
  exports: [
    CreditCardListComponent,
    CreditCardDetailsComponent,
    CreditCardsDetailsStatementsComponent,
    CreditCardsDetailsTransactionsComponent,
    CreditCardActivationComponent,
    CreditCardActivationFormComponent,
    CreditCardActivationStep1Component,
    CreditCardActivationStep2Component,
    CreditCardActivationStep3Component,
    CreditCardCancellationComponent,
    CreditCardCancellationFormComponent,
    CreditCardCancellationStep1Component,
    CreditCardCancellationStep2Component,
    CreditCardCancellationStep3Component,
    CreditCardsDetailsPaymentsInAdvanceComponent,
    CreditCardsDetailsPaymentsInAdvanceFormComponent,
    CreditCardsDetailsPaymentsInAdvanceStep1Component,
    CreditCardsDetailsPaymentsInAdvanceStep2Component,
    CreditCardsDetailsPaymentsInAdvanceStep3Component,
    CreditCardsDetailsChangeMailingAddressComponent,
    CreditCardsDetailsChangeMailingAddressFormComponent,
    CreditCardsDetailsChangeMailingAddressStep1Component,
    CreditCardsDetailsChangeMailingAddressStep2Component,
    CreditCardsDetailsChangeMailingAddressStep3Component,
  ],
})
export class CreditCardsModule {
  public static routes: any = routes
}
