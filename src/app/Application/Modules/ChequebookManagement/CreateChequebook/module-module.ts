import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { AuthGuardCreateChequebook } from './auth-guard.service'
import { CreateChequebookStep1Component } from './create-chequebook-step1.component'
import { CreateChequebookStep2Component } from './create-chequebook-step2.component'
import { CreateChequebookStep3Component } from './create-chequebook-step3.component'
import { CreateChequebookComponent } from './create-chequebook.component'
import { CreateChequebookService } from './create-chequebook.service'
import { RoutingModule } from './module-routes'

@NgModule({
  declarations: [
    CreateChequebookComponent,
    CreateChequebookStep1Component,
    CreateChequebookStep2Component,
    CreateChequebookStep3Component,
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    BsDatepickerModule.forRoot(),
    RoutingModule,
  ],
  providers: [AuthGuardCreateChequebook, CreateChequebookService],
  exports: [
    CreateChequebookComponent,
    CreateChequebookStep1Component,
    CreateChequebookStep2Component,
    CreateChequebookStep3Component,
  ],
})
export class CreateChequebookModule {}
