import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { DownloadStatementComponent } from './download-statement.component'
import { DownloadStatementRoutingModule } from './download-statement.routing.module'

@NgModule({
  imports: [AppSharedModule, FormsModule, DownloadStatementRoutingModule],
  declarations: [DownloadStatementComponent],
  providers: [],
})
export class DownloadStatementtModule {}
