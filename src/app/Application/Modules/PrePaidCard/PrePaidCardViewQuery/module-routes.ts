import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { ViewCardCredentialsComponent } from '../../ViewCardCredentials/view-card-credentials.component'
import { PrePaidCardViewQueryComponent } from './prePaidCardViewQuery.component'

export const routes: Routes = [
  {
    path: '',
    component: PrePaidCardViewQueryComponent,
  },
  {
    path: '/',
    component: PrePaidCardViewQueryComponent,
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
export class RoutingModule {}
