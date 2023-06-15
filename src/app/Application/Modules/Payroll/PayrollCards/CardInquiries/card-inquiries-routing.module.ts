import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CardInquiriesComponent } from './card-inquiries.component'

const routes: Routes = [
  {
    path: '',
    component: CardInquiriesComponent,
  },
  {
    path: 'request-new-card-online',
    loadChildren: () =>
      import('./RequestNewCardOnline/request-new-card-online.module').then(
        (m) => m.RequestNewCardOnlineModule,
      ),
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardInquiriesRoutingModule {}
