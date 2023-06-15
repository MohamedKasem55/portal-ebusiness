import { NgModule } from '@angular/core'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { CommonModule } from '@angular/common'
import { CdmTerminalsRoutingModule } from './cdm-terminals.routing.module'
import { LockboxTerminalsListComponent } from './list/lockbox-terminals-list.component'
import { LockboxTerminalsListService } from './list/lockbox-terminals-list.service'
import { LockboxTerminalsListGuard } from './list/lockbox-terminals-list.guard'
import { LockboxTerminalsDetailsComponent } from './details/lockbox-terminals-details.component'
import { LockboxTerminalsDetailsService } from './details/lockbox-terminals-details.service'
import { LockboxTerminalsDetailsGuard } from './details/lockbox-terminals-details.guard'

@NgModule({
  imports: [AppSharedModule, CommonModule, CdmTerminalsRoutingModule],
  declarations: [
    LockboxTerminalsListComponent,
    LockboxTerminalsDetailsComponent,
  ],
  providers: [
    LockboxTerminalsListService,
    LockboxTerminalsListGuard,
    LockboxTerminalsDetailsService,
    LockboxTerminalsDetailsGuard,
  ],
})
export class CdmTerminalsModule {}
