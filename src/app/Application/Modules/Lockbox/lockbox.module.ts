import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { LockboxstatementModule } from './lockboxstatement/lockboxstatement.module'
import { CdmTerminalModule } from './cdmterminal/cdm-terminal.module'
import { RouterModule } from '@angular/router'
import { routes } from './lockbox-routing.module'
import { CdmAccountsModule } from './cdmaccounts/cdm-accounts.module'

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class LockboxModule {}
