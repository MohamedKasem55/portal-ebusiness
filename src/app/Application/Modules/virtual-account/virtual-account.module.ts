import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { routes } from './virtual-account-routing.module'
import { SharedModule } from '../shared/shared.module'
import { AppSharedModule } from '../../../core/shared/shared.module'
import { VirtualAccountGuard } from './virtual-account.guard'
import { VirtualAccountComponent } from './virtual-account.component'
import { VirtualAccountService } from '../../Modules/virtual-account/virtual-account.service'

@NgModule({
  imports: [
    CommonModule,
    AppSharedModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [VirtualAccountComponent],
  providers: [VirtualAccountGuard, VirtualAccountService],

  exports: [VirtualAccountComponent],
})
export class VirtualAccountModule {}
