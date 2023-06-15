import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AskComponent } from './Ask/ask.component'

export const routes: Routes = [
  {
    path: 'tooltip',
    component: AskComponent,
  },
  {
    path: 'askAlRajhi',
    component: AskComponent,
  },
  {
    path: 'faq',
    component: AskComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpRoutingModule {}
