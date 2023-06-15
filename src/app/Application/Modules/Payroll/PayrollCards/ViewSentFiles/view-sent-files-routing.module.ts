import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ViewSentFilesComponent } from './view-sent-files.component'

const routes: Routes = [
  {
    path: '',
    component: ViewSentFilesComponent,
  },
  {
    path: 'view-uploaded-files',
    loadChildren: () =>
      import(
        'app/Application/Modules/Payroll/PayrollCards/ViewSentFiles/ViewUploadedFile/view-uploaded-files.module'
      ).then((m) => m.ViewUploadedFilesModule),
  },
  {
    path: 'view-card-payments',
    loadChildren: () =>
      import(
        'app/Application/Modules/Payroll/PayrollCards/ViewSentFiles/ViewCardPayments/view-card-payments.module'
      ).then((m) => m.ViewCardPaymentsModule),
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewSentFilesRoutingModule {}
