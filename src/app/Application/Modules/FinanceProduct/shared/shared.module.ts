import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { SharedRoutingModule } from './shared-routing.module'
import { AppSharedModule } from '../../../../core/shared/shared.module'
import { SmeCardComponent } from 'app/Application/Modules/FinanceProduct/shared/sme-card/sme-card.component'
import { SmeCardMediaComponent } from 'app/Application/Modules/FinanceProduct/shared/sme-card-media/sme-card-media.component'
import { SmePillComponent } from 'app/Application/Modules/FinanceProduct/shared/sme-pill/sme-pill.component'
import { SmeCheckComponent } from 'app/Application/Modules/FinanceProduct/shared/sme-check/sme-check.component'
import { SmeProgressComponent } from 'app/Application/Modules/FinanceProduct/shared/sme-progress/sme-progress.component'
import { SmeRangeSliderComponent } from 'app/Application/Modules/FinanceProduct/shared/sme-range-slider/sme-range-slider.component'
import { SmeBreadcrumbComponent } from 'app/Application/Modules/FinanceProduct/shared/sme-breadcrumb/sme-breadcrumb.component'

@NgModule({
  declarations: [
    SmeCardComponent,
    SmeCardMediaComponent,
    SmeBreadcrumbComponent,
      SmePillComponent,
      SmeCheckComponent,
      SmeProgressComponent,
      SmeRangeSliderComponent,
  ],
  exports: [
    SmeCardComponent,
    SmeCardMediaComponent,
      SmePillComponent,
      SmeCheckComponent,
      SmeProgressComponent,
      SmeRangeSliderComponent,
      SmeBreadcrumbComponent
  ],
  imports: [CommonModule, SharedRoutingModule, AppSharedModule,],
})
export class SharedModule {}
