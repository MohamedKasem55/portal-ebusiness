import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AppSharedModule } from '../../../../core/shared/shared.module'

import { LockboxstatementRoutingModule } from './lockboxstatement-routing.module'
import { LokbxstatementComponent } from './lokbxstatement/lokbxstatement.component'

@NgModule({
  declarations: [LokbxstatementComponent],
  imports: [AppSharedModule, CommonModule, LockboxstatementRoutingModule],
})
export class LockboxstatementModule {}
