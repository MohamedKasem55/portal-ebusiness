import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { CardinquiresRoutingModule } from './cardinquires-routing.module'
import { CardinquiresComponent } from './cardinquires.component'

@NgModule({
  declarations: [CardinquiresComponent],
  imports: [
    CommonModule,
    CardinquiresRoutingModule,
    AppSharedModule,
    BsDatepickerModule.forRoot(),
  ],
})
export class CardinquiresModule {}
