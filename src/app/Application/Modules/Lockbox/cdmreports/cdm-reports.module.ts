import { LockboxReportsListService } from './list/lockbox-reports-list.service'
import { LockboxCashOutListService } from './cashOut/lockbox-cashOut-list.service'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { NgModule } from '@angular/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { LockboxTransactionsListComponent } from './transactions/lockbox-transactions-list.component'
import { LockboxTransactionsListService } from './transactions/lockbox-transactions-list.service'
import { LockboxCashOutListComponent } from './cashOut/lockbox-cashOut-list.component'
import { ChartsModule } from 'ng2-charts'
import { ModalModule } from 'ngx-bootstrap/modal'
import { LockboxReportsListComponent } from './list/lockbox-reports-list.component'
import { routes } from './cdm-reports.routes'

@NgModule({
  imports: [
    CommonModule,
    AppSharedModule,
    ChartsModule,
    RouterModule.forChild(routes),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ],
  providers: [
    // injectable and services classes
    LockboxReportsListService,
    LockboxTransactionsListService,
    LockboxCashOutListService,
  ],
  declarations: [
    // model and components classes definitions
    LockboxReportsListComponent,
    LockboxTransactionsListComponent,
    LockboxCashOutListComponent,
  ],
  exports: [],
})
export class CdmReportsModule {
  public static routes: any = routes
}
