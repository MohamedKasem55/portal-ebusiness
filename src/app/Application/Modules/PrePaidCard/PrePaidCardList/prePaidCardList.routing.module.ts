import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ViewCardCredentialsComponent } from '../../ViewCardCredentials/view-card-credentials.component'
import { PrePaidCardListComponent } from './prePaidCardList.component'

const routes: Routes = [
  {
    path: '',
    component: PrePaidCardListComponent,
  },
  {
    path: '/',
    component: PrePaidCardListComponent,
  },
  {
    path: 'viewCardCredentials',
    component: ViewCardCredentialsComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrePaidCardsListRoutingModule {}
