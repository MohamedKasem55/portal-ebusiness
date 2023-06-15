import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { SharedModule } from '../../../shared/shared.module'
import { CardInquiriesRoutingModule } from './card-inquiries-routing.module'
import { CardInquiriesComponent } from './card-inquiries.component'
import { CardInquiriesService } from './card-inquiries.service'

@NgModule({
  imports: [
    AppSharedModule,
    CardInquiriesRoutingModule,
    BsDatepickerModule.forRoot(),
    SharedModule,
  ],
  declarations: [CardInquiriesComponent],
  providers: [CardInquiriesService],
})
export class CardInquiriesModule {}
