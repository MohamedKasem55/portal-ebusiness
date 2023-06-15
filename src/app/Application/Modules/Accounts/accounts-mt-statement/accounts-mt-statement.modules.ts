import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { AccountsMtStatementComponent } from './accounts-mt-statement.component'
import { AccountsMtStatementRoutingModule } from './accounts-mt-statement.routing.module'
import { AccountsMtStatementService } from './accounts-mt-statement.service'

@NgModule({
  imports: [AppSharedModule, FormsModule, AccountsMtStatementRoutingModule],
  declarations: [AccountsMtStatementComponent],
  providers: [AccountsMtStatementService],
})
export class AccountsMtStatementModule {}
