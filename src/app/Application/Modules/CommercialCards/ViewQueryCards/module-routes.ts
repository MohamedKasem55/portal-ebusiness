import { ViewCardCredentialsComponent } from './../../ViewCardCredentials/view-card-credentials.component';
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { ViewQueryCardsComponent } from './viewQueryCards.component'

export const routes: Routes = [
  {
    path: '',
    component: ViewQueryCardsComponent,
  },
  {
    path: '/',
    component: ViewQueryCardsComponent,
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
