import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { ProcessedFileComponent } from './processed-file/processed-file.component'

const routes: Routes = [{ path: '', component: ProcessedFileComponent }]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProcessedFileRoutingModule {}
