import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { CdmTerminalRoutingModule } from './cdm-terminal-routing.module'
import { CdmterminalComponent } from './cdmterminal.component'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { TerminaldetailsComponent } from '../terminaldetails/terminaldetails.component'

@NgModule({
  declarations: [CdmterminalComponent, TerminaldetailsComponent],
  imports: [AppSharedModule, CommonModule, CdmTerminalRoutingModule],
})
export class CdmTerminalModule {}
