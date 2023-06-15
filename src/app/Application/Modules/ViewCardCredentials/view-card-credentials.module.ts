import { ViewCardCredentialsComponent } from './view-card-credentials.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppSharedModule } from 'app/core/shared/shared.module';
import { SharedModule } from '../shared/shared.module';
import { ViewCardCredentialsService } from '../Common/Services/viewCardCredentials/view-card-credentials.service';
import { AppSharedModuleWithoutValidator } from 'app/core/shared/shared-without-validator.module';

@NgModule({
  imports: [
    CommonModule,
    AppSharedModule,
    SharedModule,
    AppSharedModuleWithoutValidator
  ],
  declarations: [ViewCardCredentialsComponent],
  providers: [ViewCardCredentialsService],
  exports: [ViewCardCredentialsComponent],
})
export class ViewCardCredentialsModule { }
