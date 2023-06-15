import { Routes } from '@angular/router'
import { DebitCardsListComponent } from './components/debit-cards-list/debit-cards-list.component'
import { DebitCardApplyComponent } from "./components/debit-card-apply/debit-card-apply.component";
import { ViewCardCredentialsComponent } from '../ViewCardCredentials/view-card-credentials.component';

export const routes: Routes = [
    {
        path: 'list',
        component: DebitCardsListComponent,
    },
    {
        path: 'apply',
        component: DebitCardApplyComponent
    },
    {
        path: 'viewCardCredentials',
        component: ViewCardCredentialsComponent,
    },
]

