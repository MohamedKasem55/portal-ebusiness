import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
// General Component of Beneficiaries
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { ModalModule } from 'ngx-bootstrap/modal'
// Directive to validate IBAN
import { AppSharedModule } from '../../../core/shared/shared.module'
import { AccountPreferenceGuard } from '../Accounts/guard/account-preference.guard'
// Alrajhi Beneficiary
import { AddStep2AlrajhiBeneficiary } from './Component/add-alrajhi-beneficiary/add-step2-alrajhi-beneficiary.component'
import { AddStep3AlrajhiBeneficiary } from './Component/add-alrajhi-beneficiary/add-step3-alrajhi-beneficiary.component'
import { AddBeneficiaryLastStep } from './Component/add-beneficiary-last-step.component'
import { AddBeneficiaryStep1 } from './Component/add-beneficiary-step1'
// International Beneficiary
import { AddStep2InternationalBeneficiary } from './Component/add-international-beneficiary/add-step2-international-beneficiary.component'
import { AddStep3InternationalBeneficiary } from './Component/add-international-beneficiary/add-step3-international-beneficiary.component'
// Local Beneficiary
import { AddStep2LocalBeneficiary } from './Component/add-local-beneficiary/add-step2-local-beneficiary.component'
import { AddStep3LocalBeneficiary } from './Component/add-local-beneficiary/add-step3-local-beneficiary.component'
// Beneficiaries list
import { BeneficiariesListComponent } from './Component/beneficiaries-list/beneficiaries-list.component'
import { BeneficiariesOptions } from './Component/beneficiaries-options.component'
import { RequestStatusComponent } from './Component/beneficiaries-request-status.component'
import { BeneficiaryDetailsComponent } from './Component/beneficiary-details.component'
import { BeneficiaryAddAnyGuard } from './Guard/beneficiary-add-any.guard'
import { BeneficiaryAddIntGuard } from './Guard/beneficiary-add-int.guard'
import { BeneficiaryListGuard } from './Guard/beneficiary-list.guard'
import { BeneficiaryMenuGuard } from './Guard/beneficiary-menu.guard'
import { BeneficiaryRequestStatusGuard } from './Guard/beneficiary-request-status.guard'
import { routes } from './module-routes'
import { RequestReactivateStep1Component } from './reactivate/request-reactivate-step1.component'
import { RequestReactivateStep2Component } from './reactivate/request-reactivate-step2.component'
import { RequestReactivateStep3Component } from './reactivate/request-reactivate-step3.component'
import { RequestReactivateComponent } from './reactivate/request-reactivate.component'
import { RequestReactivateService } from './reactivate/request-reactivate.service'
// Services
import { BeneficiariesFormData } from './Services/beneficiaries-form-data.service'
import { BeneficiariesGlobalService } from './Services/beneficiaries-global.service'
import { GetHostStaticData } from './Services/beneficiaries-host-static-data.service'
import { BeneficiariesListService } from './Services/beneficiaries-list.service'
import { RequestBeneficiariesService } from './Services/beneficiaries-request.service'
import { ValidateAccount } from './Services/beneficiaries-validate-account.service'
import { GetFormFieldsBeneficiariesList } from './Services/get-form-fields-beneficiaries-list.service'
import { FormDataService } from './Services/shared-form-data.service'
import { DetailsComponent } from './Component/details.component'
import { AddInternationalBeneficiaryService } from './Services/add-international-beneficiaries.service'

@NgModule({
  declarations: [
    BeneficiariesOptions,
    AddBeneficiaryStep1,
    AddStep2AlrajhiBeneficiary,
    AddStep3AlrajhiBeneficiary,
    AddStep2LocalBeneficiary,
    AddStep3LocalBeneficiary,
    AddStep2InternationalBeneficiary,
    AddStep3InternationalBeneficiary,
    AddBeneficiaryLastStep,
    BeneficiariesListComponent,
    BeneficiaryDetailsComponent,
    RequestStatusComponent,
    RequestReactivateComponent,
    RequestReactivateStep1Component,
    RequestReactivateStep2Component,
    RequestReactivateStep3Component,
    DetailsComponent,
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    RouterModule.forChild(routes),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ],
  providers: [
    GetFormFieldsBeneficiariesList,
    BeneficiariesGlobalService,
    FormDataService,
    BeneficiariesFormData,
    ValidateAccount,
    GetHostStaticData,
    BeneficiariesListService,
    RequestBeneficiariesService,
    RequestReactivateService,
    BeneficiaryAddAnyGuard,
    BeneficiaryAddIntGuard,
    BeneficiaryMenuGuard,
    BeneficiaryListGuard,
    BeneficiaryRequestStatusGuard,
    AccountPreferenceGuard,
    AddInternationalBeneficiaryService,
  ],
  exports: [
    BeneficiariesOptions,
    AddBeneficiaryStep1,
    AddStep2AlrajhiBeneficiary,
    AddStep3AlrajhiBeneficiary,
    AddStep2LocalBeneficiary,
    AddStep3LocalBeneficiary,
    AddBeneficiaryLastStep,
    BeneficiariesListComponent,
    RequestStatusComponent,
  ],
})
export class ModuleImpl {
  public static routes: any = routes
}
