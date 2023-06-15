import { CommonModule } from '@angular/common'
import { ReqStatusRoutingModule } from './req-status-routing.module'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { ReqStatusComponent } from './req-status/req-status.component'
import { ReinitiateComponent } from './reinitiate/reinitiate.component'
import { NgModule } from '@angular/core'
import { Reinistep1Component } from './reinitiate/reinistep1/reinistep1.component'
import { Reinistep2Component } from './reinitiate/reinistep2/reinistep2.component'
import { Reinistep3Component } from './reinitiate/reinistep3/reinistep3.component'
import { ReinitiateService } from './reinitiate/reinitiate.service'

@NgModule({
  declarations: [
    ReqStatusComponent,
    ReinitiateComponent,
    Reinistep1Component,
    Reinistep2Component,
    Reinistep3Component,
  ],
  imports: [CommonModule, AppSharedModule, ReqStatusRoutingModule],
  providers: [ReinitiateService],
})
export class ReqStatusModule {}
