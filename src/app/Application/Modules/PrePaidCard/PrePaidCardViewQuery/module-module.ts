import { ViewCardCredentialsModule } from './../../ViewCardCredentials/view-card-credentials.module';
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RoutingModule } from './module-routes'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { ChartsModule } from 'ng2-charts'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { PrePaidCardViewQueryComponent } from './prePaidCardViewQuery.component'
import { AuthGuardViewQueryCards } from './auth-guard.service'
import { PrePaidCardDetailService } from './prePaidCardDetail.service'
import { StatementsListComponent } from './statements/statements-list.component'
import { DropdownActionsComponent } from './dropdown-actions/dropdown-actions.component'
import { StatementsListService } from './statements/statements-list.service'

@NgModule({
  declarations: [
    PrePaidCardViewQueryComponent,
    StatementsListComponent,
    DropdownActionsComponent,
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    ChartsModule,
    ViewCardCredentialsModule,
    BsDatepickerModule.forRoot(),
    RoutingModule,
  ],
  providers: [
    AuthGuardViewQueryCards,
    PrePaidCardDetailService,
    StatementsListService,
  ],
  exports: [PrePaidCardViewQueryComponent, StatementsListComponent],
})
export class PrePaidCardViewQueryModule {}
