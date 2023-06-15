import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FinanceProductsComponent } from './pages/finance-products/finance-products.component';
import { RequestRequiredDocsComponent } from './pages/request-required-docs/request-required-docs.component'
import { ResultComponent } from 'app/Application/Modules/FinanceProduct/new-request/pages/result/result.component'
import { BranchesComponent } from 'app/Application/Modules/FinanceProduct/new-request/pages/branches/branches.component'
import { ExistApplicationComponent } from 'app/Application/Modules/FinanceProduct/new-request/pages/exist-application/exist-application.component'

const routes: Routes = [
  {path:'',component:FinanceProductsComponent},
  {path:'required-docs',component:RequestRequiredDocsComponent},
  { path: 'result', component: ResultComponent },
  { path: 'branches', component: BranchesComponent },
  { path: 'existing-user', component: ExistApplicationComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewRequestRoutingModule { }
