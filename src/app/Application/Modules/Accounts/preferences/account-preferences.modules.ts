import { NgModule, Injectable } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { AccountPreferences } from './account-preferences.component'
import { AccountPreferencesRoutingModule } from './account-preferences.routing.module'

@NgModule({
  imports: [AppSharedModule, FormsModule, AccountPreferencesRoutingModule],
  declarations: [AccountPreferences],
  providers: [AccountPreferencesModule],
})
export class AccountPreferencesModule {}
