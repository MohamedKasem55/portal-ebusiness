import { CommonModule, CurrencyPipe } from '@angular/common'
import { NgModule } from '@angular/core'
import { StaticService } from 'app/Application/Modules/HajjUmrahCards/static.service'
import { SharedModule } from 'app/Application/Modules/shared/shared.module'
import { AppSharedModule } from '../../../../../core/shared/shared.module'
import { PendingActionsModule } from '../pending-actions.module'
import { NewSoftTokenRoutingModule } from './new-soft-token-routing.module'
import { NewSoftTokenComponent } from './new-soft-token.component'
import { NewSoftTokenGuard } from './new-soft-token.guard'
import { NewSoftTokenService } from './new-soft-token.service'

@NgModule({
  imports: [
    AppSharedModule,
    NewSoftTokenRoutingModule,
    CommonModule,
    SharedModule,
    PendingActionsModule,
  ],
  declarations: [
    NewSoftTokenComponent
  ],
  providers: [NewSoftTokenService, NewSoftTokenGuard, CurrencyPipe, StaticService],
})
export class NewSoftTokenModule {}
