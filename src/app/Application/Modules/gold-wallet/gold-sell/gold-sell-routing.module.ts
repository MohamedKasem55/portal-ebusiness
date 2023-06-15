import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GoldSellComponent} from "./gold-sell.component";

const routes: Routes = [
  {
    path: '',
    component: GoldSellComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoldSellRoutingModule { }
