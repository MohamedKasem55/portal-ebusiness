import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DownloadTemplatesComponent } from '../../../../Modules/Payroll/PayrollCards/DownloadTemplates/download-templates.component'

const routes: Routes = [
  {
    path: '',
    component: DownloadTemplatesComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DownloadTemplatesRoutingModule {}
