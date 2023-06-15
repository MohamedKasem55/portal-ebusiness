import {NgModule} from '@angular/core'
import {PreloadAllModules, RouterModule, Routes} from '@angular/router'
import {DashboardLayoutComponent} from './Application/Components/dashboard-layout/dashboard-layout.component'
import {AuthGuardAramcoPayments} from './Application/Modules/AramcoPayments/auth-guard-aramco-payments.service'
import {AuthGuardDirectDebits} from './Application/Modules/DirectDebits/auth-guard-direct-debits.service'
import {AuthGuardPayroll} from './Application/Modules/Payroll/auth-guard-payroll.service'
import {AuthGuard} from './core/security/auth.guard'
import {LoginRevComponent} from './core/security/login-rev/login-rev.component'
import {AuthGuardTerms} from './core/security/terms-conditions/auth.guard-terms'
import {TermsConditionsComponent} from './core/security/terms-conditions/terms-conditions.component'
import {RedirectPageComponent} from "./core/redirect-page/redirect-page.component";
import {CashManagementProductsComponent} from "./core/security/login-rev/components/cash-management-products/cash-management-products.component";
import {CashManagementProductsInnerWrapperComponent} from "./Application/Components/cash-management-products-inner-wrapper/cash-management-products-inner-wrapper.component";

export const routes: Routes = [
  {
    path: 'redirect',
    component: RedirectPageComponent,
  },
  {
    path: 'login',
    data: ['login'],
    component: LoginRevComponent,
  },
  {
    path: 'terms-conditions',
    canActivate: [AuthGuardTerms],
    component: TermsConditionsComponent,
  },
  {
    path: 'cash-management-products',
    component: CashManagementProductsComponent,
  },
  {
    path: 'change-password',
    canActivate: [AuthGuardTerms],
    component: TermsConditionsComponent,
  },
  {
    path: 'terms-and-conditions',
    loadChildren: () =>
      import(
        './Application/Modules/TermsAndConditions/terms-conditions.module'
      ).then((m) => m.TermsConditionsModule),
  },

  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Home',
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./Application/Modules/Home/home.module').then(
            (m) => m.HomeModule,
          ),
      },
      {
        path: 'myprofile',
        data: ['My Profile'],
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./Application/Modules/MyProfile/module-module').then(
            (m) => m.ModuleImpl,
          ),
      },
      {
        path: 'companyadmin',
        data: ['Company Admin'],
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./Application/Modules/CompanyAdmin/module-module').then(
            (m) => m.ModuleImpl,
          ),
      },
      {
        path: 'accounts',
        data: ['Accounts'],
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./Application/Modules/Accounts/module-module').then(
            (m) => m.ModuleImpl,
          ),
      },
      {
        path: 'beneficiaries',
        data: ['Beneficiaries'],
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./Application/Modules/Beneficiaries/module-module').then(
            (m) => m.ModuleImpl,
          ),
      },
      {
        path: 'transfers',
        data: ['transfers'],
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./Application/Modules/Transfers/module-module').then(
            (m) => m.ModuleImpl,
          ),
      },
      {
        path: 'payments',
        data: ['payments'],
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./Application/Modules/Payments/payments.module').then(
            (m) => m.PaymentsModule,
          ),
      },
      {
        path: 'bulk-payment',
        data: ['bulk-payment'],
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./Application/Modules/bulk-payment/bulk-payment.module').then(
            (m) => m.BulkPaymentModule,
          ),
      },
      {
        path: 'hajjandumrahcards',
        data: ['Hajj UmrahCards'],
        canActivate: [AuthGuard],
        loadChildren: () =>
          import(
            './Application/Modules/HajjUmrahCards/hajj-umrah-cards.module'
          ).then((m) => m.HajjUmrahCardsModule),
      },
      {
        path: 'aramcoPayments',
        data: ['Aramco Payments'],
        canLoad: [AuthGuardAramcoPayments],
        loadChildren: () =>
          import('./Application/Modules/AramcoPayments/module-module').then(
            (m) => m.ModuleImpl,
          ),
      },
      {
        path: 'cashManagement',
        data: ['Cash Management'],
        canActivate: [AuthGuard],
        loadChildren: () =>
          import(
            './Application/Modules/CashManagement/cash-management.module'
          ).then((m) => m.CashManagementModule),
      },
      {
        path: 'invoiceHUB',
        data: ['Invoice HUB'],
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./Application/Modules/InvoiceHUB/module-module').then(
            (m) => m.ModuleImpl,
          ),
      },
      {
        path: 'credit-cards',
        data: ['Credit cards'],
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./Application/Modules/CreditCards/credit-cards.module').then(
            (m) => m.CreditCardsModule,
          ),
      },
      {
        path: 'debit-cards',
        loadChildren: () =>
          import('./Application/Modules/DebitCards/debit-cards.module').then(
            (m) => m.DebitCardsModule,
          ),
      },
      {
        path: 'payroll',
        canLoad: [AuthGuardPayroll],
        loadChildren: () =>
          import('./Application/Modules/Payroll/payroll.module').then(
            (m) => m.PayrollModule,
          ),
      },
      {
        path: 'wpspayroll',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./Application/Modules/WPSPayroll/wpspayroll.module').then(
            (m) => m.WPSPayrollModule,
          ),
      },
      {
        path: 'virtual-account',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import(
            './Application/Modules/virtual-account/virtual-account.module'
          ).then((m) => m.VirtualAccountModule),
      },
      {
        path: 'etrade',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import(
            './Application/Modules/Etrade/etrade.module'
          ).then((m) => m.EtradeModule),
      },
      {
        path: 'direct-debits',
        canLoad: [AuthGuardDirectDebits],
        loadChildren: () =>
          import('./Application/Modules/DirectDebits/module-module').then(
            (m) => m.ModuleImpl,
          ),
      },
      {
        path: 'wmspayroll',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./Application/Modules/WMSPayroll/wmspayroll.module').then(
            (m) => m.WMSPayrollModule,
          ),
      },
      {
        path: 'fees',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./Application/Modules/Fees/fees.module').then(
            (m) => m.FeesModule,
          ),
      },
      {
        path: 'preferences',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./Application/Modules/Preferences/preferences.module').then(
            (m) => m.PreferencesModule,
          ),
      },
      {
        path: 'government-revenue',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import(
            './Application/Modules/GovernmentRevenue/government-revenue.module'
          ).then((m) => m.GovernmentRevenueModule),
      },
      {
        path: 'terms-and-conditions',
        loadChildren: () =>
          import(
            './Application/Modules/TermsAndConditions/terms-conditions.module'
          ).then((m) => m.TermsConditionsModule),
      },
      {
        path: 'help',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./Application/Modules/Help/help.module').then(
            (m) => m.HelpModule,
          ),
      },
      {
        path: 'sadadOLP',
        data: ['Sadad OLP'],
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./Application/Modules/sadad-olp/sadadOLP.module').then(
            (m) => m.SadadOLPModule,
          ),
      },
      {
        path: 'dividend-distribution',
        data: ['Dividend Distribution'],
        canActivate: [AuthGuard],
        loadChildren: () =>
          import(
            './Application/Modules/DividendDistribution/dividend-distribution.module'
          ).then((m) => m.DividendDistributionModule),
      },
      {
        path: 'lockbox',
        data: ['Lock Box'],
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./Application/Modules/Lockbox/lockbox.module').then(
            (m) => m.LockboxModule,
          ),
      },
      {
        path: 'posstatement',
        data: ['Pos statement'],
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./Application/Modules/PoSStatement/module-module').then(
            (m) => m.PoSModuleImpl,
          ),
      },
      {
        path: 'app_and_agreement',
        data: ['app_and_agreement'],
        canActivate: [AuthGuard],
        loadChildren: () =>
          import(
            './Application/Modules/ApplicationAgreement/application-agreement.module'
          ).then((m) => m.ApplicationAgreementModule),
      },
      {
        path: 'businessCards',
        data: ['commercial-cards'],
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./Application/Modules/CommercialCards/module-module').then(
            (m) => m.ModuleImpl,
          ),
      },
      {
        path: 'prepaid-card',
        data: ['Prepaid-card'],
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./Application/Modules/PrePaidCard/module-module').then(
            (m) => m.ModuleImpl,
          ),
      },
      {
        path: 'newProduct',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./Application/Modules/NewProduct/newProduct.module').then(
            (m) => m.NewProductModule,
          ),
      },
      {
        path: 'financeProduct',
        data: ['FinanceProduct'],
        canLoad: [],
        loadChildren: () =>
          import('./Application/Modules/FinanceProduct/module-module').then(
            (m) => m.FinanceModule,
          ),
      },
      {
        path: 'business-hub',
        canActivate: [AuthGuard],
        loadChildren: () =>
            import('./Application/Modules/business-hub/business-hub.module').then(
                (m) => m.BusinessHubModule,
            ),
      },
      {
        path: 'mrcc',
        data: ['MRCC'],
        canLoad: [],
        loadChildren: () =>
          import('./Application/Modules/MRCC/mrcc.module').then(
            (m) => m.ModuleImpl,
          ),
      },
      {
        path: 'customizeReport',
        data: ['MRCC'],
        canLoad: [],
        loadChildren: () =>
          import('./Application/Modules/CustmizReport/customizeReport.module').then(
            (m) => m.CustomizeReportModule,
          ),
      },
      {
        path: 'cash-management-products-in',
        component: CashManagementProductsInnerWrapperComponent,
      }, {
        path: 'gold-wallet',
        data: ['Gold Wallet'],
        loadChildren: () =>
            import('./Application/Modules/gold-wallet/gold-wallet.module').then(
                (m) => m.GoldWalletModule,
            ),
      },
      {
        path: 'merchant-portal',
        loadChildren:()=>  import('./Application/Modules/external-application/external-application.module').then(
            (m) => m.ExternalApplicationModule,
        ),
      },
      {
        data: [''],
        path: '**',
        redirectTo: '/',
      },
    ],
  },
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      enableTracing: false
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
