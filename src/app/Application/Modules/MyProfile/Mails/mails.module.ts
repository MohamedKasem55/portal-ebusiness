import { NgModule } from '@angular/core'
import { CKEditorModule } from 'ckeditor4-angular'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { DeleteMailComponent } from './Component/delete-mail.component'
import { ListMailsComponent } from './Component/list-mails-component'
import { MailComponent } from './Component/mail.component'
import { MailsRoutingModule } from './mails-routing.module'
import { MailsGuard } from './mails.guard'
import { MailsService } from './Services/mails.service'

@NgModule({
  declarations: [ListMailsComponent, MailComponent, DeleteMailComponent],
  imports: [AppSharedModule, MailsRoutingModule, CKEditorModule],
  providers: [MailsService, MailsGuard],
})
export class MailsModule {}
