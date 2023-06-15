import { SharedModule } from '../shared/shared.module'
import { AppSharedModule } from '../../../core/shared/shared.module'
import { EtradeGuard } from './etrade.guard'
import { EtradeComponent } from './etrade.component'
import { EtradeService } from './etrade.service'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { routes } from './etrade-routing.module'

@NgModule({
  imports: [
    CommonModule,
    AppSharedModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [EtradeComponent],
  providers: [EtradeGuard, EtradeService],

  exports: [EtradeComponent],
})
export class EtradeModule { }
