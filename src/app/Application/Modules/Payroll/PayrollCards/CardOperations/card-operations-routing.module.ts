import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CardOperationsStep1Component } from './card-operations-step1.component'
import { CardOperationsStep2Component } from './card-operations-step2.component'
import { CardOperationsStep3Component } from './card-operations-step3.component'
import { CardOperationsStep4Component } from './card-operations-step4.component'
import { CardOperationsComponent } from './card-operations.component'

const routes: Routes = [
  {
    path: '',
    component: CardOperationsComponent,
    children: [
      {
        path: '',
        redirectTo: 'step1',
        pathMatch: 'full',
      },
      {
        path: 'step1',
        component: CardOperationsStep1Component,
      },
      {
        path: 'step2',
        component: CardOperationsStep2Component,
      },
      {
        path: 'step3',
        component: CardOperationsStep3Component,
      },
      {
        path: 'step4',
        component: CardOperationsStep4Component,
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardOperationsRoutingModule {}
