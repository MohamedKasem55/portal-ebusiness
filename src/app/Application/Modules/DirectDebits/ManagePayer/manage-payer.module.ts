import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { AddPayerStep1Component } from './AddPayer/add-payer-step1.component'
import { AddPayerStep2Component } from './AddPayer/add-payer-step2.component'
import { AddPayerStep3Component } from './AddPayer/add-payer-step3.component'
import { AddPayerComponent } from './AddPayer/add-payer.component'
import { DeletePayerStep2Component } from './DeletePayer/delete-payer-step2.component'
import { DeletePayerStep3Component } from './DeletePayer/delete-payer-step3.component'
import { DeletePayerComponent } from './DeletePayer/delete-payer.component'
import { ManagePayerRoutingModule } from './manage-payer-routing.module'
import { ManagePayerComponent } from './manage-payer.component'
import { ModifyPayerStep1Component } from './ModifyPayer/modify-payer-step1.component'
import { ModifyPayerStep2Component } from './ModifyPayer/modify-payer-step2.component'
import { ModifyPayerStep3Component } from './ModifyPayer/modify-payer-step3.component'
import { ModifyPayerComponent } from './ModifyPayer/modify-payer.component'

import { ManagePayerCompanyService } from './manage-payer-company.service'
import { ManagePayerService } from './manage-payer.service'
import { PayerShareService } from './payer-share.service'
import { StaticService } from '../../Common/Services/static.service'

@NgModule({
  imports: [AppSharedModule, ManagePayerRoutingModule],
  declarations: [
    ManagePayerComponent,
    AddPayerComponent,
    AddPayerStep1Component,
    AddPayerStep2Component,
    AddPayerStep3Component,
    ModifyPayerComponent,
    ModifyPayerStep1Component,
    ModifyPayerStep2Component,
    ModifyPayerStep3Component,
    DeletePayerComponent,
    DeletePayerStep2Component,
    DeletePayerStep3Component,
  ],
  providers: [
    StaticService,
    ManagePayerCompanyService,
    PayerShareService,
    ManagePayerService,
  ],
})
export class ManagePayerModule {}
