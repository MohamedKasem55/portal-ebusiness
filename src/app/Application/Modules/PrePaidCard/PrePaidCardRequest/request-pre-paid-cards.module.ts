import {NgModule} from '@angular/core'
import {PrePaidCardRequestComponent} from './pre-paid-card-request.component'
import {PrePaidCardRequestStep1Component} from './pre-paid-card-request-step1.component'
import {PrePaidCardRequestStep3Component} from './pre-paid-card-request-step3.component'
import {AuthGuardRequestCards} from './auth-guard.service'
import {AppSharedModule} from 'app/core/shared/shared.module'
import {PrePaidCardRoutes} from './pre-paid-card-routes'
import {PrePaidCardRequestService} from './pre-paid-card-request.service'
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker'
import {PrePaidCardRequestStep2Component} from './pre-paid-card-request-step2.component'
import {PrePaidCardRequestStep4Component} from './pre-paid-card-request-step4.component'

@NgModule({
    declarations: [
        PrePaidCardRequestComponent,
        PrePaidCardRequestStep1Component,
        PrePaidCardRequestStep2Component,
        PrePaidCardRequestStep3Component,
        PrePaidCardRequestStep4Component,
    ],
    imports: [AppSharedModule, PrePaidCardRoutes, BsDatepickerModule],
    providers: [AuthGuardRequestCards, PrePaidCardRequestService],
})
export class RequestPrePaidCardsModule {
}
