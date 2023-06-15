import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DownloadMolFileComponent } from './download-mol-file.component'

const routes: Routes = [
  {
    path: '',
    component: DownloadMolFileComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModuleRoutingModule {}
