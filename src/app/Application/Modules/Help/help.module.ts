import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { NgxDatatableModule } from '@swimlane/ngx-datatable'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { ModalModule } from 'ngx-bootstrap/modal'
import { AppSharedModule } from '../../../core/shared/shared.module'
import { AskComponent } from './Ask/ask.component'
import { AskService } from './Ask/ask.service'
import { HelpRoutingModule, routes } from './help-routing.module'

@NgModule({
  declarations: [AskComponent],
  imports: [
    CommonModule,
    HelpRoutingModule,
    AppSharedModule,
    NgxDatatableModule,
    RouterModule.forChild(routes),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
  ],
  providers: [AskService],
  exports: [AskComponent],
})
export class HelpModule {
  public static routes: any = routes
}
