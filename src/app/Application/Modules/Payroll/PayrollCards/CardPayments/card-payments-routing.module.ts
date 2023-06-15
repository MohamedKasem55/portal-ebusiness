import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AddCardPaymentsComponent } from './card-payments-add.component'
import { ListCardPaymentsComponent } from './card-payments-list.component'
import { CardPaymentsComponent } from './card-payments.component'

const routes: Routes = [
  {
    path: '',
    component: CardPaymentsComponent,
  },
  {
    path: 'addCardPayments',
    component: AddCardPaymentsComponent,
  },
  {
    path: 'listCardPayments',
    component: ListCardPaymentsComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardPaymentsRoutingModule {}
