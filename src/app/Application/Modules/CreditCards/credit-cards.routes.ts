import { Routes } from '@angular/router'
import { CreditCardActivationComponent } from './components/activation/credit-card-activation.component'
import { CreditCardActivationGuard } from './components/activation/credit-card-activation.guard'
import { CreditCardDetailsComponent } from './components/details/credit-card-details.component'
import { CreditCardListComponent } from './components/list/credit-card-list.component'
import { CreditCardsGuard } from './credit-cards.guard'

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    canLoad: [CreditCardsGuard],
    component: CreditCardListComponent,
  },
  {
    path: 'details',
    canLoad: [CreditCardsGuard],
    component: CreditCardDetailsComponent,
  },
  {
    path: 'activate',
    canLoad: [CreditCardActivationGuard],
    component: CreditCardActivationComponent,
  },
]
