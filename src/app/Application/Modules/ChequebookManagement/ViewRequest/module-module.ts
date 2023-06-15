import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { AuthGuardViewRequest } from './auth-guard.service'
import { RoutingModule } from './module-routes'
import { ViewRequestComponent } from './view-request.component'
import { ViewRequestService } from './view-request.service'

@NgModule({
  declarations: [ViewRequestComponent],
  imports: [
    CommonModule,
    AppSharedModule,
    BsDatepickerModule.forRoot(),
    RoutingModule,
  ],
  providers: [AuthGuardViewRequest, ViewRequestService],
  exports: [ViewRequestComponent],
})
export class ViewRequestModule {}
