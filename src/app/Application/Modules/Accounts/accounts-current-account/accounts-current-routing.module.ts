import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AccountsCurrentAccountComponent } from './accounts-current-account.component'

const routes: Routes = [
  {
    path: '',
    component: AccountsCurrentAccountComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountsCurrentAccountRoutingModule {}
