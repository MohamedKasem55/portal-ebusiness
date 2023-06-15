import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../core/shared/shared.module'
import { TermsConditionsRoutingModule } from './terms-conditions-routing.module'
import { TermsConditionsComponent } from './terms-conditions.component'
import { TermsConditionsService } from './terms-conditions.service'

@NgModule({
  imports: [AppSharedModule, TermsConditionsRoutingModule],
  declarations: [TermsConditionsComponent],
  providers: [TermsConditionsService],
})
export class TermsConditionsModule {}
