import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ChequebookComponent } from './chequebook.component'
import { Step1Component } from './components/Step1/step1.component'
import { Step2Component } from './components/Step2/step2.component'
import { Step3Component } from './components/Step3/step3.component'

const routes: Routes = [
  {
    path: '',
    component: ChequebookComponent,
    children: [
      {
        path: '',
        redirectTo: 'step1',
        pathMatch: 'full',
      },
      {
        path: 'step1',
        component: Step1Component,
      },
      {
        path: 'step2',
        component: Step2Component,
      },
      {
        path: 'step3',
        component: Step3Component,
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChequebookRoutingModule {}
