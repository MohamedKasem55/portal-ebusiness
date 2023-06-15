import { NgModule, Injectable } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { AccountsOnlineStatementComponent } from './accounts-online-statement.component'
import { AccountsOnlineStatementRoutingModule } from './accounts-online-statement.routing.module'

@NgModule({
  imports: [
    AppSharedModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    AccountsOnlineStatementRoutingModule,
  ],
  declarations: [AccountsOnlineStatementComponent],
  providers: [AccountsOnlineStatementModule],
})
export class AccountsOnlineStatementModule {}
