import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DownloadTemplateComponent } from './downloadTemplate.component'

const routes: Routes = [{ path: '', component: DownloadTemplateComponent }]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DownloadTempRoutingModule {}
