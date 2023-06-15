import { Inject, NgModule, PLATFORM_ID } from '@angular/core'
import { CustomFormsModule } from 'ngx-custom-validators'
import { DatatableMobileComponent } from '../responsive/datatable-mobile.component'
import { AppSharedModuleWithoutValidator } from './shared-without-validator.module'

@NgModule({
  imports: [AppSharedModuleWithoutValidator, CustomFormsModule],
  exports: [AppSharedModuleWithoutValidator, CustomFormsModule],
})
export class AppSharedModule {
  constructor(@Inject(PLATFORM_ID) protected _platformId) {
    DatatableMobileComponent.platformId = _platformId
  }
}
