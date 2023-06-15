import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AccountPreferences } from './account-preferences.component'

const routes: Routes = [
  {
    path: '',
    component: AccountPreferences,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes), BsDatepickerModule.forRoot()],
  exports: [RouterModule],
})
export class AccountPreferencesRoutingModule {}
