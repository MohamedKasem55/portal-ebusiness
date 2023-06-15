import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { ModalModule } from 'ngx-bootstrap/modal'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { RepresentedService } from './represented.service'
import { RepresentedComponent } from './represented.component'
import { RepresentedRoutingModule } from './represented-module-routes'
import { RepresentedDetailsComponent } from './Detailes/represented-details.component'
import { RepresentedInformationDetailsComponent } from './Detailes/InformationDetails/information-details.component'
import { RepresentedPowerSelectionComponent } from './Detailes/PowerSelection/power-selection.component'
import { AccountsComponent } from './Detailes/Accounts/accounts.component'
import { FinishComponent } from './Detailes/Finish/finish.component'
import { RepresentedDeleteComponent } from './Detailes/Delete/delete.component'

@NgModule({
  imports: [
    CommonModule,
    BsDatepickerModule.forRoot(),
    AppSharedModule,
    ModalModule.forRoot(),
    RepresentedRoutingModule,
  ],
  declarations: [
    RepresentedComponent,
    RepresentedDetailsComponent,
    RepresentedInformationDetailsComponent,
    RepresentedPowerSelectionComponent,
    AccountsComponent,
    FinishComponent,
    RepresentedDeleteComponent
  ],
  providers: [
    RepresentedService,
  ],
  exports: [],
})
export class RepresentedModule {
}
