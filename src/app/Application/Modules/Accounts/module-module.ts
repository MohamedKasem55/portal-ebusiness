import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {RouterModule} from '@angular/router'
import {NgSelectModule} from '@ng-select/ng-select'
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker'
import {ModalModule} from 'ngx-bootstrap/modal'
import {AuthenticationService} from '../../../core/security/authentication.service'
import {AppSharedModule} from '../../../core/shared/shared.module'
import {AuthGuardCreateChequebook} from '../ChequebookManagement/CreateChequebook/auth-guard.service'
import {SharedModule} from '../shared/shared.module'
import {AddChequeBookStep1} from './accounts-cheque-book/accounts-cheque-book-step1.component'
import {AddChequeBookStep2} from './accounts-cheque-book/accounts-cheque-book-step2.component'
import {ChequeBookAdd} from './accounts-cheque-book/accounts-cheque-book-step2.service'
import {AddChequeBookStep3} from './accounts-cheque-book/accounts-cheque-book-step3.component'
import {AccountsChequeBookService} from './accounts-cheque-book/accounts-cheque-book.service'
import {CurrentAccountsService} from './accounts-current-account/accounts-current-account.service'
import {AccountsPosSearchCriteria} from './accounts-pos/accounts-pos-search-criteria.component'
import {AccountsPosSearchCriteriaRequest} from './accounts-pos/accounts-pos-search-criteria.service'
import {AccountsPosSearchPanel} from './accounts-pos/accounts-pos-search-panel.component'
import {AccountsPosSearchPanelRequest} from './accounts-pos/accounts-pos-search-panel.service'
import {routes} from './module-routes'
import {RequestStatementComponent} from './RequestStatement/request-statement.component'
import {Step1Component as RequestStatementStep1Component} from './RequestStatement/Steps/Step1/step1.component'
import {Step2Component as RequestStatementStep2Component} from './RequestStatement/Steps/Step2/step2.component'
import {Step3Component as RequestStatementStep3Component} from './RequestStatement/Steps/Step3/step3.component'
import {AccountsCaAccountService} from './Services/accounts-ca-account.service'
import {AccountFormData} from './Services/accounts-form-data.service'
import {AccountsList} from './Services/accounts-list-data.service'

// Services
import {FormDataService} from './Services/shared-form-data.service'
import {OpenAdditionalAccountComponent} from './open-additional-account/open-additional-account.component'
import {ArrayOfObjects} from "../../Components/common/Pipes/arrayOfObjects-pipe";

@NgModule({
    declarations: [
        AddChequeBookStep1,
        AddChequeBookStep2,
        AddChequeBookStep3,
        AccountsPosSearchPanel,
        AccountsPosSearchCriteria,
        OpenAdditionalAccountComponent,
        RequestStatementComponent,
        RequestStatementStep1Component,
        RequestStatementStep2Component,
        RequestStatementStep3Component,
        ArrayOfObjects
    ],
    imports: [
        CommonModule,
        AppSharedModule,
        RouterModule.forChild(routes),
        ModalModule.forRoot(),
        BsDatepickerModule.forRoot(),
        SharedModule,
        NgSelectModule,

    ],
    providers: [
        AccountFormData,
        AccountsList,
        CurrentAccountsService,
        FormDataService,
        AccountsPosSearchPanelRequest,
        AccountsPosSearchCriteriaRequest,
        AccountsChequeBookService,
        ChequeBookAdd,
        ArrayOfObjects,
        AuthGuardCreateChequebook,
        AuthenticationService,

        AccountsCaAccountService,
    ],
    exports: [AddChequeBookStep1, AddChequeBookStep2, AddChequeBookStep3],
})
export class ModuleImpl {
    public static routes: any = routes
}
