import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { AccountsCurrentAccountComponent } from './accounts-current-account.component'
import { CurrentAccountsService } from './accounts-current-account.service'
import { AccountsCurrentAccountRoutingModule } from './accounts-current-routing.module'

@NgModule({
  imports: [
    AppSharedModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    AccountsCurrentAccountRoutingModule,
  ],
  declarations: [AccountsCurrentAccountComponent],
  providers: [CurrentAccountsService],
})
export class CurrentAccountsModule {}
