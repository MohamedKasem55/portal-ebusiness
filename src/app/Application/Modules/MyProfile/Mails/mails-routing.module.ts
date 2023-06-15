import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ListMailsComponent } from './Component/list-mails-component'
import { MailComponent, ViewType } from './Component/mail.component'
import { MailsGuard } from './mails.guard'

const routes: Routes = [
  {
    path: '',
    canLoad: [MailsGuard],
    component: ListMailsComponent,
  },
  {
    path: ViewType.DETAIL,
    canLoad: [MailsGuard],
    component: MailComponent,
  },
  {
    path: ViewType.COMPOSE,
    canLoad: [MailsGuard],
    component: MailComponent,
  },
  {
    path: ViewType.REPLY,
    canLoad: [MailsGuard],
    component: MailComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MailsRoutingModule {}
