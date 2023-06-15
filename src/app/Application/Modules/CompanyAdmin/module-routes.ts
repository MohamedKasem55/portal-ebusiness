import {Routes} from '@angular/router'
import {AuthGuardBeneficiaryList} from '../AramcoPayments/BeneficiaryList/auth-guard-beneficiary-list.service'
import {AuthGuardCompanyadminPospay} from './auth-guard-companyadmin-pospay.service'
import {AuthGuardCompanyadmin} from './auth-guard-companyadmin.service'
import {AuthGuardLQM} from './auth-guard-lqm.service'
import {CompanyAdminUserManagementDeleteUserComponent} from './CompanyUser/delete/company-admin-user-management-delete-user.component'
import {CompanyAdminUserManagementDetailsUserComponent} from './CompanyUser/details/company-admin-user-management-details-user.component'
import {CompanyAdminUserManagementEditComponent} from './CompanyUser/edit/company-admin-user-management-edit.component'
import {CompanyAdminUserManagementListComponent} from './CompanyUser/list/company-admin-user-management-list.component'
import {AuthGuardAddBeneficiary} from './Component/add-aramco-beneficiary/auth-guard-add-beneficiary.service'
import {DeleteComponent} from './Component/aramco-beneficiry/delete/delete.component'
import {DetailComponent} from './Component/aramco-beneficiry/details/detail.component'
import {ListComponent} from './Component/aramco-beneficiry/list.component'
import {AramcoOptionsComponent} from './Component/aramco-options.component'
import {BeneficiaryOriginatorComponent} from './Component/beneficiary-originator/beneficiary-originator.component'
import {ConfirmChangesComponent} from './Component/beneficiary-originator/confirm-changes.component'
import {CompanyAdminAccounts} from './Component/company-admin-account.component'
import {CompanyAdminTokenEditStatus} from './Component/company-admin-token-edit-status.component'
import {CompanyAdminTokenManagment} from './Component/company-admin-token-managment.component'
import {NationalAddressComponent} from './Component/national-address/national-address.component'
import {CompanyAdminPositivePayChequeAccountsComponent} from './Component/positive-pay-cheque-accounts/positive-pay-cheque-accounts.component'
import {AccountRulesComponent} from './workflow/account-rules/account-rules.component'
import {WorkflowOptionsComponent} from './workflow/options.component'
import {AuthGuardAccountRules} from './Guards/account-rules.guard'
import {AuthGuardGovRevenue} from './Guards/gov-revenue.guard'
import {LiquidityManagementComponent} from './liquidity-management/liquidity-management.component'
import {NonAccountComponent} from './workflow/nonacccount/nonacccount.component'
import {CompanyAdminUserManagementAddComponent} from './CompanyUser/add/company-admin-user-management-add.component'
import {UpdateCRNComponent} from './Component/update-crn/update-crn.component'
import {AliasManagementComponent} from './Component/alias-management/alias-management.component'
import {CustomPropertiesComponent} from './Component/custom-properties/custom-properties.component'
import {WorkflowDeleteNonFinancialRequestStatusComponent} from './workflow/request-status/delete/workflow-delete-non-financial-request-status.component'
import {WorkflowReinitiateNonFinancialRequestStatusComponent} from './workflow/request-status/re-initiate/workflow-reinitiate-non-financial-request-status.component'
import {WorkflowRequestStatusComponent} from './workflow/request-status/workflow-request-status.component'
import {WorkflowDetailsNonFinancialRequestStatusComponent} from './workflow/request-status/details/workflow-details-non-financial-request-status.component'
import {CompanyAdminUserManagementDetailsUserDeleteOneStepComponent} from './CompanyUser/details/deleteOneStep/company-admin-user-management-details-user-deleteOneStep.component'
import {AccountRulesSearchComponent} from './workflow/account-rules/search/account-rules-search.component'
import {AccountRulesReinitiateComponent} from './workflow/request-status/re-initiate/account-rules.component'
import { RepresentedGuard } from './Represented/represented.guard'
import { RmInformationComponent } from './Component/rm-information/rm-information.component'
import { EtradeComponent } from './Component/workflow/etrade/etrade.component';
import { NewSoftTokenComponent } from './NewSoftToken/new-soft-token.component'
import { AuthGuardCompanyadminNewSoftToken } from './auth-guard-companyadmin-newSoftToken'
import {AccountVerifyListComponent} from "./Component/saudi-payments/account-verification/account-verify-list/account-verify-list.component";
import {AccountVerifyNewComponent} from "./Component/saudi-payments/account-verification/account-verify-new/account-verify-new.component";
import {AccountVerifyDetailsComponent} from "./Component/saudi-payments/account-verification/account-verify-details/account-verify-details.component";

export const routes: Routes = [
    {
        path: 'manage/user',
        canLoad: [AuthGuardCompanyadmin],
        component: CompanyAdminUserManagementListComponent,
    },
    {
        path: 'account',
        canLoad: [AuthGuardCompanyadmin],
        component: CompanyAdminAccounts,
    },
    {
        path: 'PositivePayChequeAccounts',
        canLoad: [AuthGuardCompanyadminPospay],
        component: CompanyAdminPositivePayChequeAccountsComponent,
    },
    {
        path: 'user/details',
        canLoad: [AuthGuardCompanyadmin],
        component: CompanyAdminUserManagementDetailsUserComponent,
    },
    {
        path: 'user/edit',
        canLoad: [AuthGuardCompanyadmin],
        component: CompanyAdminUserManagementEditComponent,
    },
    {
        path: 'user/add',
        canLoad: [AuthGuardCompanyadmin],
        component: CompanyAdminUserManagementAddComponent,
    },
    {
        path: 'user/delete',
        canLoad: [AuthGuardCompanyadmin],
        component: CompanyAdminUserManagementDeleteUserComponent,
    },
    {
        path: 'user/requeststatus',
        loadChildren: () => import('./CompanyUser/RequestStatus/request-status.module').then((m) => m.RequestStatusModule)
    },

    {
        path: 'alerts',
        loadChildren: () => import('./alerts/alerts.module').then((m) => m.AlertsModule)
    },
    {
        path: 'token/managment',
        canLoad: [AuthGuardCompanyadmin],
        component: CompanyAdminTokenManagment,
    },
    {
        path: 'token/managment/edit/:tockenSerial',
        canLoad: [AuthGuardCompanyadmin],
        component: CompanyAdminTokenEditStatus,
    },
    {
        path: 'token/managment/request',
        canLoad: [AuthGuardCompanyadminNewSoftToken],
        component: NewSoftTokenComponent,
    },

    {path: 'nationalAddress', component: NationalAddressComponent},

    {
        path: 'pos',
        loadChildren: () =>
            import('../PoSManagement/module-module').then((m) => m.PoSModuleImpl),
    },

    {
        path: 'aramco',
        canLoad: [AuthGuardBeneficiaryList],
        component: AramcoOptionsComponent,
    },
    {
        path: 'aramco/beneficiaryList',
        canLoad: [AuthGuardBeneficiaryList],
        component: ListComponent,
    },
    {path: 'aramco/beneficiaryList/details', component: DetailComponent},
    {path: 'aramco/beneficiaryList/delete', component: DeleteComponent},

    {
        path: 'aramco/add-beneficiary',
        canLoad: [AuthGuardAddBeneficiary],
        loadChildren: () =>
            import('./Component/add-aramco-beneficiary/add-beneficiary.module').then(
                (m) => m.AddBeneficiaryModule,
            ),
    },
    {
        path: 'workflow',
        component: WorkflowOptionsComponent
    },
    {
        path: 'workflow/accountRulesSearch',
        canLoad: [AuthGuardAccountRules],
        component: AccountRulesSearchComponent,
    },
    {
        path: 'workflow/accountRules',
        canLoad: [AuthGuardAccountRules],
        component: AccountRulesComponent,
    },
    {
        path: 'workflow/eTrade',
        //canLoad: [AuthGuardAccountRules],
        component: EtradeComponent,
    },
    {
        path: 'workflow/nonAccountRules',
        canLoad: [AuthGuardAccountRules],
        component: NonAccountComponent,
    },
    {
        path: 'workflow/requestStatus',
        canLoad: [AuthGuardAccountRules],
        component: WorkflowRequestStatusComponent,
    },
    {
        path: 'workflow/requestStatus/account-reinitiate',
        canLoad: [AuthGuardAccountRules],
        component: AccountRulesReinitiateComponent,
    },
    {
        path: 'workflow/requestStatus/delete-non-financial',
        canLoad: [AuthGuardAccountRules],
        component: WorkflowDeleteNonFinancialRequestStatusComponent,
    },
    {
        path: 'workflow/requestStatus/reInitiate-non-financial',
        canLoad: [AuthGuardAccountRules],
        component: WorkflowReinitiateNonFinancialRequestStatusComponent,
    },
    {
        path: 'workflow/requestStatus/details-non-financial',
        canLoad: [AuthGuardAccountRules],
        component: WorkflowDetailsNonFinancialRequestStatusComponent,
    },
    {
        path: 'workflow/requestStatus/details-deleteOneStep',
        canLoad: [AuthGuardAccountRules],
        component: CompanyAdminUserManagementDetailsUserDeleteOneStepComponent,
    },
    {
        path: 'accounts/beneficiary-originators',
        canLoad: [AuthGuardGovRevenue],
        component: BeneficiaryOriginatorComponent,
    },
    {
        path: 'accounts/beneficiary-originators/confirm',
        canLoad: [AuthGuardGovRevenue],
        component: ConfirmChangesComponent,
    },
    {
        path: 'liquidityManagement',
        canLoad: [AuthGuardLQM],
        component: LiquidityManagementComponent,
    },
    {
        path: 'updatecr',
        canLoad: [AuthGuardLQM],
        component: UpdateCRNComponent,
    },
    {
        path: 'alias-management',
        canLoad: [AuthGuardCompanyadmin],
        component: AliasManagementComponent,
    },
    {
        path: 'custom-properties',
        canLoad: [AuthGuardLQM],
        component: CustomPropertiesComponent,
    },
    {
        path: 'rm-information',
        canLoad: [AuthGuardLQM],
        component: RmInformationComponent,
    },
    {
        path: 'saudi-payments/account-verification/list',
        component: AccountVerifyListComponent
    },
    {
      path: 'saudi-payments/account-verification/new',
      component: AccountVerifyNewComponent
    },
    {
        path: 'saudi-payments/account-verification/details',
        component: AccountVerifyDetailsComponent
    },
  {
    path: 'represented',
    canLoad: [RepresentedGuard],
    loadChildren: () =>
      import('./Represented/module-module').then(
        (m) => m.RepresentedModule,
      ),
  },
]
