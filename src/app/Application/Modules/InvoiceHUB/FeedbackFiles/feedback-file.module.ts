import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { FeedbackFileRoutingModule } from './feedback-file-routing.module'
import { FeedbackFileComponent } from './feedback-file.component'
import { FeedbackFileService } from './feedback-file.service'

@NgModule({
  imports: [
    AppSharedModule,
    FeedbackFileRoutingModule,
    BsDatepickerModule.forRoot(),
  ],
  declarations: [FeedbackFileComponent],
  providers: [FeedbackFileService],
})
export class FeedbackFileModule {}
