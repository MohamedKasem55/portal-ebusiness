import { Routes } from '@angular/router'
import { AuthGuardCreateChequebook } from '../ChequebookManagement/CreateChequebook/auth-guard.service'
import { AddChequeBookStep1 } from './accounts-cheque-book/accounts-cheque-book-step1.component'
import { AddChequeBookStep2 } from './accounts-cheque-book/accounts-cheque-book-step2.component'
import { AddChequeBookStep3 } from './accounts-cheque-book/accounts-cheque-book-step3.component'
import { AccountsPosSearchCriteria } from './accounts-pos/accounts-pos-search-criteria.component'
//import { AccountsPosSearchCriteria } from "../PoSStatement/PoSStatmentByterminal/accounts-pos-search-criteria.component";
import { AccountsPosSearchPanel } from './accounts-pos/accounts-pos-search-panel.component'
import { RequestStatementComponent } from './RequestStatement/request-statement.component'
import { OpenAdditionalAccountComponent } from './open-additional-account/open-additional-account.component'

export const routes: Routes = [
  {
    path: 'customerDocuments',

    loadChildren: () =>
        import('./customer-documents/customer-documents.module').then(
            (m) => m.CustomerDocumentsModule,
        ),
  },
  {
    path: 'currentAccounts',

    loadChildren: () =>
      import('./accounts-current-account/accounts-current.modules').then(
        (m) => m.CurrentAccountsModule,
      ),
  },
  {
    path: 'downloadStatement',
    loadChildren: () =>
      import('./download-statement/download-statement.modules').then(
        (m) => m.DownloadStatementtModule,
      ),
  },
  {
    path: 'onlineStatements',
    loadChildren: () =>
      import(
        './accounts-online-statement/accounts-online-statement.modules'
      ).then((m) => m.AccountsOnlineStatementModule),
  },
  {
    path: 'balanceCertificate',
    loadChildren: () =>
      import('./BalanceCertificate/accounts-balance-certificate.module').then(
        (m) => m.BalanceCertificateModule,
      ),
  },

  {
    path: 'vatInvocie',
    loadChildren: () =>
      import('./vat-invoice/vat-invoice.modules').then(
        (m) => m.VatInvoiceModule,
      ),
  },
  {
    path: 'preferences',
    loadChildren: () =>
      import('./preferences/account-preferences.modules').then(
        (m) => m.AccountPreferencesModule,
      ),
  },
  {
    path: 'monthly-statements',
    loadChildren: () =>
      import(
        './accounts-monthly-statements/accounts-monthly-statements.modules'
      ).then((m) => m.MonthlyStatementsModule),
  },

  { path: 'chequeBookStep1', component: AddChequeBookStep1 },
  { path: 'chequeBookStep2', component: AddChequeBookStep2 },
  { path: 'chequeBookStep3', component: AddChequeBookStep3 },

  {
    path: 'chequebook',
    canLoad: [AuthGuardCreateChequebook],
    loadChildren: () =>
      import('../ChequebookManagement/module-module').then((m) => m.ModuleImpl),
  },
  { path: 'posStatement', component: AccountsPosSearchPanel },
  { path: 'pos2', component: AccountsPosSearchCriteria },

  {
    path: 'requestStatement',
    component: RequestStatementComponent,
  },
  {
    path: 'mtStatement',
    loadChildren: () =>
      import('./accounts-mt-statement/accounts-mt-statement.modules').then(
        (m) => m.AccountsMtStatementModule,
      ),
  },
  {
    path: 'openAdditionalAccount',
    component: OpenAdditionalAccountComponent,
  },
]
