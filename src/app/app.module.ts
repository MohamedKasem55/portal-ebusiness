import {DatePipe, DecimalPipe, HashLocationStrategy, LocationStrategy, registerLocaleData,} from '@angular/common'
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule,} from '@angular/common/http'
import localeAr from '@angular/common/locales/ar'
import localeArCaExtra from '@angular/common/locales/extra/ar-SA'
import {ErrorHandler, Injector, NgModule} from '@angular/core'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {BrowserModule, DomSanitizer} from '@angular/platform-browser'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {ServiceWorkerModule} from '@angular/service-worker'
import {NgbModule} from '@ng-bootstrap/ng-bootstrap'
import {NgSelectModule} from '@ng-select/ng-select'
import {ConfigLoader, ConfigModule} from '@ngx-config/core'
import {TranslateLoader, TranslateModule, TranslateService,} from '@ngx-translate/core'
import {NgxDatatableModule} from '@swimlane/ngx-datatable'
import {QRCodeModule} from 'angularx-qrcode'
import {ArbMenuComponentModule} from 'arb-menu'
import {SimpleMQ} from 'ng2-simple-mq'
import {AngularTourModule} from './core/tour/ng-tour.module'
import {CollapseModule} from 'ngx-bootstrap/collapse'
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker'
import {BsDropdownModule} from 'ngx-bootstrap/dropdown'
import {ModalModule} from 'ngx-bootstrap/modal'
import {PopoverModule} from 'ngx-bootstrap/popover'
import {NgxIbanModule} from 'ngx-iban'
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule,} from 'ngx-perfect-scrollbar'
import {NgxWebstorageModule} from 'ngx-webstorage'
import {VirtualAccountModule} from './Application/Modules/virtual-account/virtual-account.module'
import {AppComponent} from './app.component'
import {AppRoutingModule} from './app.routes'
import {AppState} from './app.state'
import {AsideToggleDirective} from './Application/Components/common/aside.directive'
import {BreadcrumbsComponent} from './Application/Components/common/breadcrumb.component'
import {NAV_DROPDOWN_DIRECTIVES} from './Application/Components/common/nav-dropdown.directive'
import {SIDEBAR_TOGGLE_DIRECTIVES} from './Application/Components/common/sidebar.directive'
import {DashboardLayoutComponent} from './Application/Components/dashboard-layout/dashboard-layout.component'
import {AccountPreferenceGuard} from './Application/Modules/Accounts/guard/account-preference.guard'
import {SelectedDataService} from './Application/Modules/Accounts/Services/selected-data-service'
import {AuthGuardAramcoPayments} from './Application/Modules/AramcoPayments/auth-guard-aramco-payments.service'
import {AuthGuardDirectDebits} from './Application/Modules/DirectDebits/auth-guard-direct-debits.service'
import {AuthGuardPayroll} from './Application/Modules/Payroll/auth-guard-payroll.service'
import {configFactoryLocal} from './core/config/config.loader.local'
import {ConfigResourceService} from './core/config/config.resource.local'
import {CryptoService} from './core/crypto/crypto.service'
import {CustomErrorHandler} from './core/error/error.handler'
import {AuthInterceptor} from './core/http/auth.interceptor'
import {ContenttypeInterceptor} from './core/http/contenttype.interceptor'
import {CriptInterceptor} from './core/http/cript.interceptor'
import {DeleteInterceptor} from './core/http/delete.interceptor'
import {FireWallInterceptor} from './core/http/firewall.interceptor'
import {LanguageInterceptor} from './core/http/language.interceptor'
import {LoadingInterceptor} from './core/http/loading.interceptor'
import {HttpLoaderFactory} from './core/location/change.language.component'
import {LogService} from './core/log/log.service'
import {AuthGuard} from './core/security/auth.guard'
import {AuthenticationService} from './core/security/authentication.service'
import {CampaignBannerComponent} from './core/security/login-rev/components/campaign-banner/campaign-banner.component'
import {ContactUsModalComponent} from './core/security/login-rev/components/contact-us-modal/contact-us-modal.component'
import {SecurityTipsComponent} from './core/security/login-rev/components/security-tips/security-tips.component'
import {UserResourcesComponent} from './core/security/login-rev/components/user-resources/user-resources.component'
import {LoginRevComponent} from './core/security/login-rev/login-rev.component'
import {AuthGuardTerms} from './core/security/terms-conditions/auth.guard-terms'
import {TermsConditionsComponent} from './core/security/terms-conditions/terms-conditions.component'
import {AppSharedModule} from './core/shared/shared.module'
import {StorageService} from './core/storage/storage.service'
import {GlobalState} from './global.state'
import {SimpleModalComponent} from './core/modal/simple-modal/simple-modal.component'
import {VATCompany} from './Application/Components/vat-company/vat-company.component'
import {RedirectPageComponent} from './core/redirect-page/redirect-page.component';
import {ModelPipe} from "./Application/Components/common/Pipes/model-pipe";
import {FreeSmsAlertComponent} from './Application/Components/free-sms-alert/free-sms-alert.component';
import {DisclaimerService} from "./Application/Components/common/disclaimer.service";
import {CompanyAdminAlertsService} from "./Application/Modules/CompanyAdmin/Services/company-admin-alert.service";
import {EtradeModule} from './Application/Modules/Etrade/etrade.module';
import {CashManagementProductsComponent} from './core/security/login-rev/components/cash-management-products/cash-management-products.component';
import {CashManagementProductsInnerWrapperComponent} from './Application/Components/cash-management-products-inner-wrapper/cash-management-products-inner-wrapper.component';
import {CashManagementCardComponent} from './core/security/login-rev/components/cash-management-products/cash-management-card/cash-management-card.component';
import {CustomPropertiesService} from "./Application/Modules/CompanyAdmin/Services/custom-properties.service";
import {CommercialCardsService} from "./Application/Modules/CommercialCards/commercial-cards.service";
import {RequestToPayComponent} from "./Application/Components/request-to-pay/request-to-pay.component";
import { UpdatePrivilegeInterceptor } from './core/http/update-privilege.interceptor'
import { UpdatePrivilegeService } from './core/service/update-privilege.service'
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    wheelPropagation: true,
}
registerLocaleData(localeAr, 'ar', localeArCaExtra)
registerLocaleData(localeAr, 'ar-SA', localeArCaExtra)

@NgModule({
    imports: [
        NgxIbanModule,
        QRCodeModule,
        AppSharedModule,
        BrowserModule,

        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        NgxWebstorageModule.forRoot(),
        NgSelectModule,
        NgxDatatableModule,
        BrowserAnimationsModule,
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        NgbModule,
        CollapseModule.forRoot(),
        BsDropdownModule.forRoot(),

        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,

                deps: [HttpClient],
            },
        }),
        AppRoutingModule,
        ConfigModule.forRoot({
            provide: ConfigLoader,
            useFactory: configFactoryLocal,
            deps: [HttpClient],
        }),
        ServiceWorkerModule.register('./ngsw-worker.js', {
            enabled: false, // environment.production,
        }),
        BsDatepickerModule.forRoot(),
        ArbMenuComponentModule,
        PerfectScrollbarModule,
        VirtualAccountModule,
        EtradeModule,
        AngularTourModule.forRoot()
    ],
  declarations: [
    AppComponent,
    LoginRevComponent,
    ContactUsModalComponent,
    CampaignBannerComponent,
    UserResourcesComponent,
    SecurityTipsComponent,
    TermsConditionsComponent,
    DashboardLayoutComponent,
    NAV_DROPDOWN_DIRECTIVES,
    BreadcrumbsComponent,
    SIDEBAR_TOGGLE_DIRECTIVES,
    AsideToggleDirective,
    SimpleModalComponent,
    VATCompany,
    RedirectPageComponent,
    FreeSmsAlertComponent,
    CashManagementProductsComponent,
    CashManagementProductsInnerWrapperComponent,
    CashManagementCardComponent,
    RequestToPayComponent,
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    {
      provide:HTTP_INTERCEPTORS,
      useClass:UpdatePrivilegeInterceptor,
      multi:true, 
      deps:[SimpleMQ]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
      deps: [Injector],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LanguageInterceptor,
      multi: true,
      deps: [Injector],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ContenttypeInterceptor,
      multi: true,
      deps: [SimpleMQ],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DeleteInterceptor,
      multi: true,
      deps: [],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CriptInterceptor,
      multi: true,
      deps: [CryptoService, StorageService, SimpleMQ, Injector],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
      deps: [SimpleMQ, Injector],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FireWallInterceptor,
      multi: true,
      deps: [SimpleMQ, DomSanitizer],
    },
    AppState,
    GlobalState,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    {
      provide: ErrorHandler,
      useClass: CustomErrorHandler,
    },  LogService,
        StorageService,
        SimpleMQ,
        ConfigResourceService,
        AuthGuard,
        AuthGuardTerms,
        AuthGuardPayroll,
        AuthGuardAramcoPayments,
        AuthenticationService,
        SelectedDataService,
        CryptoService,
        AccountPreferenceGuard,
        AuthGuardDirectDebits,
        CommercialCardsService,
        DecimalPipe,
        DatePipe,
        TranslateService,
        CommercialCardsService,
        CustomPropertiesService,
        ModelPipe,
        DisclaimerService,
        CompanyAdminAlertsService,
        UpdatePrivilegeService
    ],

    exports: [ContactUsModalComponent, CampaignBannerComponent],
    entryComponents: [ContactUsModalComponent],
    bootstrap: [AppComponent],
})
export class AppModule {
}
