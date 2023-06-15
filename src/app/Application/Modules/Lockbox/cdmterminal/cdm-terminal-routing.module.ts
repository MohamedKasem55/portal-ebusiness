import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { CdmterminalComponent } from './cdmterminal.component'
import { TerminaldetailsComponent } from '../terminaldetails/terminaldetails.component'

const routes: Routes = [
  {
    path: '',
    component: CdmterminalComponent,
  },
  { path: 'terminaldetails', component: TerminaldetailsComponent },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CdmTerminalRoutingModule {}
