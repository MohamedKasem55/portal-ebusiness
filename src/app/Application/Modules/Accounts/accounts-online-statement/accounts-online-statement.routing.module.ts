import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AccountsOnlineStatementComponent } from './accounts-online-statement.component'

const routes: Routes = [
  {
    path: '',
    component: AccountsOnlineStatementComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes), BsDatepickerModule.forRoot()],
  exports: [RouterModule],
})
export class AccountsOnlineStatementRoutingModule {}
