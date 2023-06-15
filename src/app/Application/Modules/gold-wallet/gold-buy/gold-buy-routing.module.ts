import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GoldBuyComponent} from "./gold-buy.component";

const routes: Routes = [
  {
    path: '',
    component: GoldBuyComponent,

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoldBuyRoutingModule { }
