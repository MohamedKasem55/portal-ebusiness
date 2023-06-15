import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { ModalModule } from 'ngx-bootstrap/modal'
import { LetterGuaranteeFileUploadComponent } from './components/letter-guarantee-list-file-upload/letter-guarantee-file-upload.component'
import { LetterGuaranteeFileUploadService } from './components/letter-guarantee-list-file-upload/letter-guarantee-file-upload.service'
import { AppSharedModuleWithoutValidator } from '../../../core/shared/shared-without-validator.module'
import { routes } from './application-agreement.routes'
import { PyrollAgreementListComponent } from './components/payroll-agreement-list/payroll-agreement-list.component'
import { PayrollAgreementListService } from './components/payroll-agreement-list/payroll-agreement-list.service'
import { LetterGuaranteeListComponent } from './components/letter-guarantee-list/letter-guarantee-list.component'
import { LetterGuaranteeListService } from './components/letter-guarantee-list/letter-guarantee-list.service'
import { PayrollAgreementFileUploadComponent } from './components/payroll-agreement-file-upload/payroll-agreement-file-upload.component'
import { PayrollAgreementFileUploadService } from './components/payroll-agreement-file-upload/payroll-agreement-file-upload.service';
import {AppAgreementComponent} from "./components/app-agreement/app-agreement.component";
import {AppAgreementFileUploadComponent} from "./components/app-agreement-file-upload/app-agreement-file-upload.component";


@NgModule({
  declarations: [
    LetterGuaranteeListComponent,
    LetterGuaranteeFileUploadComponent,
    PyrollAgreementListComponent,
    PayrollAgreementFileUploadComponent,
    AppAgreementComponent,
    AppAgreementFileUploadComponent,
  ],
  imports: [
    CommonModule,
    AppSharedModuleWithoutValidator,
    RouterModule.forChild(routes),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ],
  exports: [
    LetterGuaranteeListComponent,
    LetterGuaranteeFileUploadComponent,
    PyrollAgreementListComponent,
    PayrollAgreementFileUploadComponent,
  ],
  providers: [
    LetterGuaranteeListService,
    LetterGuaranteeFileUploadService,
    PayrollAgreementListService,
    PayrollAgreementFileUploadService,
  ],
})
export class ApplicationAgreementModule {
  public static routes: any = routes
}
