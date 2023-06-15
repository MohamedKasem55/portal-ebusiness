import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { CreditCardListComponent } from './creditCardList.component'
import { CreditCardListRoutingModule } from './creditCardList.routing.module'

@NgModule({
  imports: [AppSharedModule, FormsModule, CreditCardListRoutingModule],
  declarations: [CreditCardListComponent],
})
export class CreditCardListModule {}
