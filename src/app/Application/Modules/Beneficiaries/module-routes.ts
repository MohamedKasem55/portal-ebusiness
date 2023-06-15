import { Routes } from '@angular/router/router'
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
import { BeneficiariesListComponent } from './Component/beneficiaries-list/beneficiaries-list.component'
import { BeneficiariesOptions } from './Component/beneficiaries-options.component'
import { RequestStatusComponent } from './Component/beneficiaries-request-status.component'
import { BeneficiaryAddAnyGuard } from './Guard/beneficiary-add-any.guard'
import { BeneficiaryAddIntGuard } from './Guard/beneficiary-add-int.guard'
import { BeneficiaryListGuard } from './Guard/beneficiary-list.guard'
import { BeneficiaryMenuGuard } from './Guard/beneficiary-menu.guard'
import { BeneficiaryRequestStatusGuard } from './Guard/beneficiary-request-status.guard'
import { RequestReactivateComponent } from './reactivate/request-reactivate.component'

export const routes: Routes = [
  {
    path: 'beneficiariesOptions',
    canLoad: [BeneficiaryMenuGuard],
    component: BeneficiariesOptions,
  },
  {
    path: 'AddBeneficiaries',
    canLoad: [BeneficiaryAddAnyGuard],
    component: AddBeneficiaryStep1,
  },
  {
    path: 'AlrajhiBeneficiary/AddStep2',
    canLoad: [BeneficiaryAddAnyGuard],
    component: AddStep2AlrajhiBeneficiary,
  },
  {
    path: 'AlrajhiBeneficiary/AddStep3',
    canLoad: [BeneficiaryAddAnyGuard],
    component: AddStep3AlrajhiBeneficiary,
  },
  {
    path: 'LocalBeneficiary/AddStep2',
    canLoad: [BeneficiaryAddAnyGuard],
    component: AddStep2LocalBeneficiary,
  },
  {
    path: 'LocalBeneficiary/AddStep3',
    canLoad: [BeneficiaryAddAnyGuard],
    component: AddStep3LocalBeneficiary,
  },
  {
    path: 'InternationalBeneficiary/AddStep2',
    canLoad: [BeneficiaryAddIntGuard],
    component: AddStep2InternationalBeneficiary,
  },
  {
    path: 'InternationalBeneficiary/AddStep3',
    canLoad: [BeneficiaryAddIntGuard],
    component: AddStep3InternationalBeneficiary,
  },
  {
    path: 'AddBeneficiariesLastStep',
    canLoad: [BeneficiaryAddAnyGuard],
    component: AddBeneficiaryLastStep,
  },
  {
    path: 'beneficiaryList',
    canLoad: [BeneficiaryListGuard],
    component: BeneficiariesListComponent,
  },
  {
    path: 'beneficiaryList/:action',
    canLoad: [BeneficiaryListGuard],
    component: BeneficiariesListComponent,
  },
  {
    path: 'requestStatus',
    canLoad: [BeneficiaryRequestStatusGuard],
    component: RequestStatusComponent,
  },
  {
    path: 'requestStatus/activate',
    canLoad: [BeneficiaryRequestStatusGuard],
    component: RequestReactivateComponent,
  },
]
