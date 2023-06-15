import { NgModule } from '@angular/core'
import { AppSharedModuleWithoutValidator } from 'app/core/shared/shared-without-validator.module'
import { AccountsBalanceCertificateComponent } from './accounts-balance-certificate.component'
import { AccountBalanceRoutingModule } from './accounts-balance-certificate.routes'
import { AccountsService } from './accounts-balance-certificate.service'
import { AccountsBalanceCertificateRequestComponent } from './RequestNewCertificate/accounts-balance-certificate-request.component'
import { AccountsRequestService } from './RequestNewCertificate/accounts-balance-certificate-request.service'
import { Step1Component as AccountsBalanceCertificateRequestStep1Component } from './RequestNewCertificate/Steps/Step1/step1.component'
import { Step2Component as AccountsBalanceCertificateRequestStep2Component } from './RequestNewCertificate/Steps/Step2/step2.component'
import { Step3Component as AccountsBalanceCertificateRequestStep3Component } from './RequestNewCertificate/Steps/Step3/step3.component'
import { RequestReactivateStep1Component as BalanceCertificateRequestReactivateStep1Component } from './RequestStatus/reactivate/request-reactivate-step1.component'
import { RequestReactivateStep2Component as BalanceCertificateRequestReactivateStep2Component } from './RequestStatus/reactivate/request-reactivate-step2.component'
import { RequestReactivateStep3Component as BalanceCertificateRequestReactivateStep3Component } from './RequestStatus/reactivate/request-reactivate-step3.component'
import {
  RequestReactivateComponent as BalanceCertificateRequestReactivateComponent,
  RequestReactivateComponent,
} from './RequestStatus/reactivate/request-reactivate.component'
import { RequestReactivateService } from './RequestStatus/reactivate/request-reactivate.service'
import {
  RequestStatusComponent as BalanceCertificateRequestStatusComponent,
  RequestStatusComponent,
} from './RequestStatus/request-status.component'
import { RequestStatusService } from './RequestStatus/request-status.service'
@NgModule({
  declarations: [
    RequestReactivateComponent,
    RequestStatusComponent,
    AccountsBalanceCertificateRequestComponent,
    AccountsBalanceCertificateComponent,
    AccountsBalanceCertificateRequestComponent,
    AccountsBalanceCertificateRequestStep1Component,
    AccountsBalanceCertificateRequestStep2Component,
    AccountsBalanceCertificateRequestStep3Component,
    BalanceCertificateRequestStatusComponent,
    BalanceCertificateRequestReactivateComponent,
    BalanceCertificateRequestReactivateStep1Component,
    BalanceCertificateRequestReactivateStep2Component,
    BalanceCertificateRequestReactivateStep3Component,
  ],
  imports: [AppSharedModuleWithoutValidator, AccountBalanceRoutingModule],
  providers: [
    AccountsService,
    AccountsRequestService,
    RequestStatusService,
    RequestReactivateService,
  ],
  exports: [
    AccountsBalanceCertificateComponent,
    AccountsBalanceCertificateRequestComponent,
    AccountsBalanceCertificateRequestStep1Component,
    AccountsBalanceCertificateRequestStep2Component,
    AccountsBalanceCertificateRequestStep3Component,
    BalanceCertificateRequestStatusComponent,
    BalanceCertificateRequestReactivateComponent,
    BalanceCertificateRequestReactivateStep1Component,
    BalanceCertificateRequestReactivateStep2Component,
    BalanceCertificateRequestReactivateStep3Component,
  ],
})
export class BalanceCertificateModule {}
