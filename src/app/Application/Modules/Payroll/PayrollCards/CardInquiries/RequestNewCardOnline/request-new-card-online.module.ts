import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../../../core/shared/shared.module'
import { SharedModule } from '../../../../shared/shared.module'
import { Step1Component } from './components/Step1/step1.component'
import { Step2Component } from './components/Step2/step2.component'
import { Step3Component } from './components/Step3/step3.component'
import { RequestNewCardOnlineRoutingModule } from './request-new-card-online-routing.module'
import { RequestNewCardOnlineComponent } from './request-new-card-online.component'
import { RequestNewCardOnlineService } from './request-new-card-online.service'

@NgModule({
  imports: [AppSharedModule, RequestNewCardOnlineRoutingModule, SharedModule],
  declarations: [
    RequestNewCardOnlineComponent,
    Step1Component,
    Step2Component,
    Step3Component,
  ],
  providers: [RequestNewCardOnlineService],
})
export class RequestNewCardOnlineModule {}
