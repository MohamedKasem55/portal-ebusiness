import { Routes } from '@angular/router'
import { LetterGuaranteeFileUploadComponent } from './components/letter-guarantee-list-file-upload/letter-guarantee-file-upload.component'
import { LetterGuaranteeFileUploadGuard } from './components/letter-guarantee-list-file-upload/letter-guarantee-file-upload.guard'
import { LetterGuaranteeListComponent } from './components/letter-guarantee-list/letter-guarantee-list.component'
import { LetterGuaranteeListGuard } from './components/letter-guarantee-list/letter-guarantee-list.guard'
import { PayrollAgreementFileUploadComponent } from './components/payroll-agreement-file-upload/payroll-agreement-file-upload.component'
import { PayrollAgreementFileUploadGuard } from './components/payroll-agreement-file-upload/payroll-agreement-file-upload.guard'
import { PyrollAgreementListComponent } from './components/payroll-agreement-list/payroll-agreement-list.component'
import {AppAgreementComponent} from "./components/app-agreement/app-agreement.component";
import {AppAgreementFileUploadComponent} from "./components/app-agreement-file-upload/app-agreement-file-upload.component";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'download-templates',
    pathMatch: 'full',
  },
  {
    path: 'lg-application',
    canLoad: [LetterGuaranteeListGuard],
    component: LetterGuaranteeListComponent,
  },
  {
    path: 'lg-application/file-upload',
    canLoad: [LetterGuaranteeFileUploadGuard],
    component: LetterGuaranteeFileUploadComponent,
  },
  {
    path: 'payroll-agreement',
    canLoad: [PyrollAgreementListComponent],
    component: PyrollAgreementListComponent,
  },
  {
    path: 'payroll-agreement/file-upload',
    canLoad: [PayrollAgreementFileUploadGuard],
    component: PayrollAgreementFileUploadComponent,
  },
  {
    path: 'app-agreement/:agreementId',
    pathMatch: 'prefix',
    component: AppAgreementComponent,
  },
  {
    path: 'app-agreement/file-upload/:agreementId',
    pathMatch: 'prefix',
    component: AppAgreementFileUploadComponent,
  }
]
