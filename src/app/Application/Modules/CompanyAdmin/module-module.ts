import {AppSharedModuleWithoutValidator} from './../../../core/shared/shared-without-validator.module';
import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {RouterModule} from '@angular/router'
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker'
import {ModalModule} from 'ngx-bootstrap/modal'
import {AppSharedModule} from '../../../core/shared/shared.module'
import {ModelPipe} from '../../Components/common/Pipes/model-pipe'
import {SharedModule} from '../shared/shared.module'
import {CompanyAdminUserManagementDeleteUserComponent} from './CompanyUser/delete/company-admin-user-management-delete-user.component'
import {Step1Component as CompanyAdminUserManagementDeleteStep1Component} from './CompanyUser/delete/Steps/Step1/step1.component'
import {Step2Component as CompanyAdminUserManagementDeleteStep2Component} from './CompanyUser/delete/Steps/Step2/step2.component'
import {Step3Component as CompanyAdminUserManagementDeleteStep3Component} from './CompanyUser/delete/Steps/Step3/step3.component'
import {CompanyAdminUserManagementDetailsUserComponent} from './CompanyUser/details/company-admin-user-management-details-user.component'
import {CompanyAdminUserManagementEditComponent} from './CompanyUser/edit/company-admin-user-management-edit.component'
import {CompanyAdminUserManagementEditService} from './CompanyUser/edit/company-admin-user-management-edit.service'
import {CompanyAdminUserManagementEditStep1Component} from './CompanyUser/edit/Steps/Step1/company-admin-user-management-edit-step1.component'
import {CompanyAdminUserManagementEditStep2Component} from './CompanyUser/edit/Steps/Step2/company-admin-user-management-edit-step2.component'
import {CompanyAdminUserManagementEditStep3Component} from './CompanyUser/edit/Steps/Step3/company-admin-user-management-edit-step3.component'
import {CompanyAdminUserManagementListComponent} from './CompanyUser/list/company-admin-user-management-list.component'
import {CompanyAdminUserManagementListService} from './CompanyUser/list/company-admin-user-management-list.service'
import {CompanyAdminUserManagementSelectedDataService} from './CompanyUser/list/company-admin-user-management-selected-data.service'
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
import {NationalAddressStep1Component} from './Component/national-address/national-address-step1.component'
import {NationalAddressStep2Component} from './Component/national-address/national-address-step2.component'
import {NationalAddressStep3Component} from './Component/national-address/national-address-step3.component'
import {NationalAddressComponent} from './Component/national-address/national-address.component'
import {CompanyAdminPOSAccountsStep1Component} from './Component/pos-accounts/pos-accounts-step1.component'
import {CompanyAdminPOSAccountsStep2Component} from './Component/pos-accounts/pos-accounts-step2.component'
import {CompanyAdminPOSAccountsStep3Component} from './Component/pos-accounts/pos-accounts-step3.component'
import {CompanyAdminPositivePayChequeAccountsStep1Component} from './Component/positive-pay-cheque-accounts/positive-pay-cheque-accounts-step1.component'
import {CompanyAdminPositivePayChequeAccountsStep2Component} from './Component/positive-pay-cheque-accounts/positive-pay-cheque-accounts-step2.component'
import {CompanyAdminPositivePayChequeAccountsStep3Component} from './Component/positive-pay-cheque-accounts/positive-pay-cheque-accounts-step3.component'
import {CompanyAdminPositivePayChequeAccountsComponent} from './Component/positive-pay-cheque-accounts/positive-pay-cheque-accounts.component'
import {AccountRulesStep1Component} from './workflow/account-rules/account-rules-step1.component'
import {AccountRulesStep2Component} from './workflow/account-rules/account-rules-step2.component'
import {AccountRulesStep3Component} from './workflow/account-rules/account-rules-step3.component'
import {WorkflowOptionsComponent} from './workflow/options.component'
import {LiquidityManagementComponent} from './liquidity-management/liquidity-management.component'
import {routes} from './module-routes'
import {BeneficiaryListService} from './Services/aramco-beneficiary/beneficiary-list.service'
import {SharedDataService} from './Services/aramco-beneficiary/shared-data.service'
import {BeneficiaryOriginatorService} from './Services/beneficiary-originator/beneficiary-originator.service'
import {CompanyAdminAccountsService} from './Services/company-admin-account.service'
import {CompanyAdminAlertsService} from './Services/company-admin-alert.service'
import {CompanyAdminTokenManagmentService} from './Services/company-admin-token-managment.service'
import {LiquidityManagementService} from './Services/liquidity-management-list.service'
import {NationalAddressService} from './Services/national-address/national-address.service'
import {CompanyAdminPositivePayChequeAccountsService} from './Services/positive-pay-cheque-accounts/positive-pay-cheque-accounts.service'
import {SelectedUserAlertDataService} from './Services/selected-user-alert-data-service'
import {SelectedUserDesactivateAlertDataService} from './Services/selected-user-desactivate-alert-data-service'
import {SelectedUserRenewalAlertDataService} from './Services/selected-user-renewal-alert-data-service'
import {CompanyAdminWorkflowService} from './Services/workflow.service'
import {AccountRulesService} from './Services/workflow/account-rules/account-rules.service'
import {NonAccountComponent} from './workflow/nonacccount/nonacccount.component'
import {NonAccountStep1Component} from './workflow/nonacccount/Step1/step1.component'
import {NonAccountStep2Component} from './workflow/nonacccount/Step2/step2.component'
import {NonAccountStep3Component} from './workflow/nonacccount/Step3/step3.component'
import {CompanyAdminUserManagementAddComponent} from './CompanyUser/add/company-admin-user-management-add.component'
import {CompanyAdminUserManagementAddStep1Component} from './CompanyUser/add/Steps/Step1/company-admin-user-management-add-step1.component'
import {CompanyAdminUserManagementAddStep2Component} from './CompanyUser/add/Steps/Step2/company-admin-user-management-add-step2.component'
import {CompanyAdminUserManagementAddStep3Component} from './CompanyUser/add/Steps/Step3/company-admin-user-management-add-step3.component'
import {CompanyAdminUserManagementAddStep4Component} from './CompanyUser/add/Steps/Step4/company-admin-user-management-add-step4.component'
import {CompanyAdminUserManagementAddService} from './CompanyUser/add/company-admin-user-management-add.service'
import {AliasManagementComponent} from './Component/alias-management/alias-management.component'
import {AliasManagementStep1Component} from './Component/alias-management/alias-management-step1.component'
import {AliasManagementSte2Component} from './Component/alias-management/alias-management-step2.component'
import {AliasManagementStep3Component} from './Component/alias-management/alias-management-step3.component'
import {AliasManagementUnlinkComponent} from './Component/alias-management/alias-management-unlink.component'
import {AccountsList} from '../Accounts/Services/accounts-list-data.service'
import {AliasManagementService} from './Services/alias-management.service'
import {TransferLocalService} from '../Transfers/Services/transfer-local.service'
import {CustomPropertiesComponent} from './Component/custom-properties/custom-properties.component'
import {UpdateCRNComponent} from './Component/update-crn/update-crn.component'
import {UpdateCrnService} from './Services/update-crn/update-crn.service'
import {WorkflowNonFinancialRequestStatusService} from './Services/workflow/request-status/workflow-non-financial-request-status.service'
import {WorkflowAccountsRequestStatusService} from './Services/workflow/request-status/workflow-accounts-request-status.service'
import {WorkflowDeleteNonFinancialRequestStatusComponent} from './workflow/request-status/delete/workflow-delete-non-financial-request-status.component'
import {WorkflowDeleteNonFinancialRequestStatusService} from './workflow/request-status/delete/workflow-delete-non-financial-request-status.service'
import {WorkflowReInitiateAccountRequestStatusService} from './workflow/request-status/re-initiate/workflow-reInitiate-account-request-status.service'
import {WorkflowReInitiateNonFinancialRequestStatusService} from './workflow/request-status/re-initiate/workflow-reInitiate-non-financial-request-status.service'
import {WorkflowAccountsRequestStatusTableComponent} from './workflow/request-status/common/workflow-accounts-request-status-table.component'
import {WorkflowNonFinancialRequestStatusTableComponent} from './workflow/request-status/common/workflow-non-financial-request-status-table.component'
import {WorkflowRequestStatusComponent} from './workflow/request-status/workflow-request-status.component'
import {WorkflowReinitiateNonFinancialRequestStatusComponent} from './workflow/request-status/re-initiate/workflow-reinitiate-non-financial-request-status.component'
import {TooltipModule} from 'ngx-bootstrap/tooltip'
import {WorkflowDetailsNonFinancialRequestStatusService} from './workflow/request-status/details/workflow-details-non-financial-request-status.service'
import {WorkflowDetailsNonFinancialRequestStatusComponent} from './workflow/request-status/details/workflow-details-non-financial-request-status.component'
import {CompanyAdminUserManagementDetailsUserDeleteOneStepComponent} from './CompanyUser/details/deleteOneStep/company-admin-user-management-details-user-deleteOneStep.component';
import {AccountRulesSearchService} from './workflow/account-rules/search/account-rules-search.service';
import {AccountRulesSearchComponent} from './workflow/account-rules/search/account-rules-search.component';
import {AccountRulesComponent} from './workflow/account-rules/account-rules.component';
import {AccountRulesReinitiateComponent} from './workflow/request-status/re-initiate/account-rules.component';
import {AccountRulesReinitiateStep1Component} from './workflow/request-status/re-initiate/account-rules-step1.component';
import {AccountRulesReinitiateStep2Component} from './workflow/request-status/re-initiate/account-rules-step2.component';
import {AccountRulesReinitiateStep3Component} from './workflow/request-status/re-initiate/account-rules-step3.component';
import {NonFinancialReinitiateStep1Component} from './workflow/request-status/re-initiate/non-financial-reinitiate-step1.component';
import {NonFinancialReinitiateStep2Component} from './workflow/request-status/re-initiate/non-financial-reinitiate-step2.component';
import {NonFinancialReinitiateStep3Component} from './workflow/request-status/re-initiate/non-financial-reinitiate-step3.component';
import { RmInformationComponent } from './Component/rm-information/rm-information.component';
import { EtradeService } from './Services/workflow/etrade/etrade.service';
import { EtradeComponent } from './Component/workflow/etrade/etrade.component';
import { EtradeStep1Component } from './Component/workflow/etrade/etrade-step1.component';
import { EtradeStep2Component } from './Component/workflow/etrade/etrade-step2.component';
import { EtradeStep3Component } from './Component/workflow/etrade/etrade-step3.component';
import { RepresentedGuard } from './Represented/represented.guard';
import { NewSoftTokenComponent } from './NewSoftToken/new-soft-token.component';
import { NewSoftTokenStep1Component } from './NewSoftToken/new-soft-token-step1.component';
import { ManageRequestService } from '../PoSStatement/PoSRequest/manage-request.service';
import { NewSoftTokenStep2Component } from './NewSoftToken/new-soft-token-step2.component';
import { NewSoftTokenStep3Component } from './NewSoftToken/new-soft-token-step3.component';
import { NewSoftTokenService } from './NewSoftToken/new-soft-token.service';

import {AccountVerifyListComponent} from "./Component/saudi-payments/account-verification/account-verify-list/account-verify-list.component";
import {AccountVerifyNewComponent} from "./Component/saudi-payments/account-verification/account-verify-new/account-verify-new.component";
import {AccountBalanceService} from "../Home/Services/account-balance-service";
import {AccountVerifyDetailsComponent} from "./Component/saudi-payments/account-verification/account-verify-details/account-verify-details.component";
import { StaticService } from '../Common/Services/static.service';


@NgModule({
    declarations: [
        CompanyAdminAccounts,
        CompanyAdminTokenManagment,
        NewSoftTokenComponent,
        NewSoftTokenStep1Component,
        NewSoftTokenStep2Component,
        NewSoftTokenStep3Component,
        CompanyAdminTokenEditStatus,
        CompanyAdminUserManagementListComponent,
        CompanyAdminUserManagementDetailsUserComponent,
        CompanyAdminUserManagementDeleteUserComponent,
        CompanyAdminUserManagementAddComponent,
        CompanyAdminUserManagementAddStep1Component,
        CompanyAdminUserManagementAddStep2Component,
        CompanyAdminUserManagementAddStep3Component,
        CompanyAdminUserManagementAddStep4Component,
        CompanyAdminUserManagementEditComponent,
        CompanyAdminUserManagementEditStep1Component,
        CompanyAdminUserManagementEditStep2Component,
        CompanyAdminUserManagementEditStep3Component,
        CompanyAdminUserManagementDeleteStep1Component,
        CompanyAdminUserManagementDeleteStep2Component,
        CompanyAdminUserManagementDeleteStep3Component,
        NationalAddressComponent,
        NationalAddressStep1Component,
        NationalAddressStep2Component,
        NationalAddressStep3Component,
        WorkflowDetailsNonFinancialRequestStatusComponent,
        CompanyAdminUserManagementDetailsUserDeleteOneStepComponent,
        CompanyAdminPositivePayChequeAccountsComponent,
        CompanyAdminPositivePayChequeAccountsStep1Component,
        CompanyAdminPositivePayChequeAccountsStep2Component,
        CompanyAdminPositivePayChequeAccountsStep3Component,

        ListComponent,
        DetailComponent,
        DeleteComponent,

        AramcoOptionsComponent,
        WorkflowOptionsComponent,

        AccountRulesComponent,
        NonAccountComponent,
        NonAccountStep1Component,
        NonAccountStep2Component,
        NonAccountStep3Component,
        AccountRulesSearchComponent,
        AccountRulesStep1Component,
        AccountRulesStep2Component,
        AccountRulesStep3Component,
        BeneficiaryOriginatorComponent,
        ConfirmChangesComponent,
        LiquidityManagementComponent,
        CompanyAdminPOSAccountsStep1Component,
        CompanyAdminPOSAccountsStep2Component,
        CompanyAdminPOSAccountsStep3Component,
        UpdateCRNComponent,
        CustomPropertiesComponent,
        RmInformationComponent,
        AliasManagementComponent,
        AliasManagementStep1Component,
        AliasManagementSte2Component,
        AliasManagementStep3Component,
        AliasManagementUnlinkComponent,
        WorkflowDeleteNonFinancialRequestStatusComponent,
        WorkflowAccountsRequestStatusTableComponent,
        WorkflowNonFinancialRequestStatusTableComponent,
        WorkflowRequestStatusComponent,
        WorkflowReinitiateNonFinancialRequestStatusComponent,
        AccountRulesReinitiateComponent,
        AccountRulesReinitiateStep1Component,
        AccountRulesReinitiateStep2Component,
        AccountRulesReinitiateStep3Component,
        NonFinancialReinitiateStep1Component,
        NonFinancialReinitiateStep2Component,
        NonFinancialReinitiateStep3Component,
        EtradeComponent,
        EtradeStep1Component,
        EtradeStep2Component,
        EtradeStep3Component,
        AccountVerifyListComponent,
        AccountVerifyNewComponent,
        AccountVerifyDetailsComponent
    ],
    imports: [
        CommonModule,
        AppSharedModuleWithoutValidator,
        AppSharedModule,
        SharedModule,
        RouterModule.forChild(routes),
        ModalModule.forRoot(),
        BsDatepickerModule.forRoot(),
        TooltipModule,
    ],
    providers: [
        CompanyAdminAccountsService,
        CompanyAdminTokenManagmentService,
        CompanyAdminUserManagementAddService,
        CompanyAdminUserManagementListService,
        CompanyAdminUserManagementSelectedDataService,
        CompanyAdminUserManagementEditService,
        SelectedUserAlertDataService,
        SelectedUserRenewalAlertDataService,
        SelectedUserDesactivateAlertDataService,
        CompanyAdminAlertsService,
        CompanyAdminPositivePayChequeAccountsService,
        BeneficiaryListService,
        NationalAddressService,
        AuthGuardAddBeneficiary,
        SharedDataService,
        CompanyAdminWorkflowService,
        AccountRulesService,
        AccountRulesSearchService,
        BeneficiaryOriginatorService,
        LiquidityManagementService,
        ModelPipe,
        UpdateCrnService,
        AccountsList,
        AliasManagementService,
        TransferLocalService,
        WorkflowAccountsRequestStatusService,
        WorkflowNonFinancialRequestStatusService,
        WorkflowDeleteNonFinancialRequestStatusService,
        WorkflowDetailsNonFinancialRequestStatusService,
        WorkflowReInitiateAccountRequestStatusService,
        WorkflowReInitiateNonFinancialRequestStatusService,
        NewSoftTokenService,
        ManageRequestService,
        EtradeService,
        RepresentedGuard,
        AccountBalanceService,
        StaticService],
    exports: [
        CompanyAdminAccounts,
        CompanyAdminPositivePayChequeAccountsComponent,
        CompanyAdminPositivePayChequeAccountsStep1Component,
        CompanyAdminPositivePayChequeAccountsStep2Component,
        CompanyAdminPositivePayChequeAccountsStep3Component,
        CompanyAdminTokenManagment,
        NewSoftTokenComponent,
        NewSoftTokenStep1Component,
        NewSoftTokenStep2Component,
        NewSoftTokenStep3Component,
        CompanyAdminTokenEditStatus,
        CompanyAdminUserManagementListComponent,
        CompanyAdminUserManagementDetailsUserComponent,
        CompanyAdminUserManagementDeleteUserComponent,
        CompanyAdminUserManagementAddComponent,
        CompanyAdminUserManagementAddStep1Component,
        CompanyAdminUserManagementAddStep2Component,
        CompanyAdminUserManagementAddStep3Component,
        CompanyAdminUserManagementAddStep4Component,
        CompanyAdminUserManagementEditComponent,
        CompanyAdminUserManagementEditStep1Component,
        CompanyAdminUserManagementEditStep2Component,
        CompanyAdminUserManagementEditStep3Component,
        CompanyAdminUserManagementDeleteStep1Component,
        CompanyAdminUserManagementDeleteStep2Component,
        CompanyAdminUserManagementDeleteStep3Component,
        EtradeComponent,
        EtradeStep1Component,
        EtradeStep2Component,
        EtradeStep3Component,
    ],
})
export class ModuleImpl {
    public static routes: any = routes
}
