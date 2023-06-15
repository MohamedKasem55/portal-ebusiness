import {CommonModule, DatePipe} from '@angular/common'
import {Inject, NgModule, PLATFORM_ID} from '@angular/core'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {RouterModule} from '@angular/router'
import {NgbModule} from '@ng-bootstrap/ng-bootstrap'
import {NgSelectModule} from '@ng-select/ng-select'
import {TranslateModule} from '@ngx-translate/core'
import {NgxDatatableModule} from '@swimlane/ngx-datatable'
import {GoogleChartsModule} from 'angular-google-charts'
import {QRCodeModule} from 'angularx-qrcode'
import {ArbDesignComponentModule} from 'arb-design'
import {defineLocale} from 'ngx-bootstrap/chronos'
import {CollapseModule} from 'ngx-bootstrap/collapse'
import {BsDatepickerModule, DatepickerModule} from 'ngx-bootstrap/datepicker'
import {BsDropdownModule} from 'ngx-bootstrap/dropdown'
import {arLocale, enGbLocale} from 'ngx-bootstrap/locale'
import {ModalModule} from 'ngx-bootstrap/modal'
import {PopoverModule} from 'ngx-bootstrap/popover'
import {TabsModule} from 'ngx-bootstrap/tabs'
import {OrderModule, OrderPipe} from 'ngx-order-pipe'
import {AutofocusDirective} from '../../Application/Components/common/autofocus.directive'
import {CurrencyService} from '../../Application/Components/common/currency.service'
import {DecimalPrecisionDirective} from '../../Application/Components/common/decimal-precision.directive'
import {InputPattern} from '../../Application/Components/common/input.directive'
import {ModelService} from '../../Application/Components/common/model.service'
import {AmountCurrencyPipe} from '../../Application/Components/common/Pipes/amount-currency.pipe'
import {BaseAmountPipe} from '../../Application/Components/common/Pipes/base-amount.pipe'
import {BillCodePipe} from '../../Application/Components/common/Pipes/bill-code-pipe'
import {DateFormatPipe} from '../../Application/Components/common/Pipes/date-format-pipe'
import {LevelFormatPipe} from '../../Application/Components/common/Pipes/getLevels-pipe'
import {HijraDateFormatPipe} from '../../Application/Components/common/Pipes/hijra-date-format-pipe'
import {TranslateDatePipe} from '../../Application/Components/common/Pipes/hijra-date-pipe'
import {HijraFullDateTransformPipe} from '../../Application/Components/common/Pipes/hijra-tranform-full-date-pipe'
import {KeyValuePipe} from '../../Application/Components/common/Pipes/key-value-pipe'
import {ModelPipe} from '../../Application/Components/common/Pipes/model-pipe'
import {OperationPipe} from '../../Application/Components/common/Pipes/operation.pipe'
import {QuarterPipe} from '../../Application/Components/common/Pipes/quarter.pipe'
import {StatusPipe} from '../../Application/Components/common/Pipes/status-pipe'
import {TerminalstatusPipe} from '../../Application/Components/common/Pipes/terminalstatus.pipe'
import {ValuesPipe} from '../../Application/Components/common/Pipes/values-pipe'
import {VatAmountPipe} from '../../Application/Components/common/Pipes/vat-amount.pipe'
import {DashboardMenuService} from '../../Application/Components/dashboard-layout/dashboard-menu-service'
import {DashboardService} from '../../Application/Components/dashboard-layout/dashboard-service'
import {SecuredAuthentication} from '../../Application/Components/secured-authentication/secured-authentication.component'
import {CompanyAdminUserManagementEditFormComponent} from '../../Application/Modules/Common/Components/CompanyAdmin/CompanyUser/UserForm/company-admin-user-management-edit-form.component'
import {CompanyAdminUserManagementEditFormService} from '../../Application/Modules/Common/Components/CompanyAdmin/CompanyUser/UserForm/company-admin-user-management-edit-form.service'
import {DynamicSimpleExtrasFormFieldsComponent} from '../../Application/Modules/Common/Components/DynamicFormFields/dynamic-simple-extras-form-fields.component'
import {PendingActionsUtilityComponent} from '../../Application/Modules/Common/Components/PendingActions/pending-actions-utility.component'
import {PendingActionsUtilityStep0Component} from '../../Application/Modules/Common/Components/PendingActions/Steps/Step0/pending-actions-utility-step0.component'
import {PendingActionsUtilityStep1Component} from '../../Application/Modules/Common/Components/PendingActions/Steps/Step1/pending-actions-utility-step1.component'
import {PendingActionsUtilityStep2Component} from '../../Application/Modules/Common/Components/PendingActions/Steps/Step2/pending-actions-utility-step2.component'
import {PendingActionsUtilityStep3Component} from '../../Application/Modules/Common/Components/PendingActions/Steps/Step3/pending-actions-utility-step3.component'
import {SearchCompanyUtilityComponent} from '../../Application/Modules/Common/Components/SearchCompany/search-company-utility.component'
import {SearchCompanyUtilityService} from '../../Application/Modules/Common/Components/SearchCompany/search-company-utility.service'
import {TreeViewConfiguratorUtilityComponent} from '../../Application/Modules/Common/Components/TreeView/Configurator/tree-view-configurator-utility.component'
import {TreeViewUtilityComponent} from '../../Application/Modules/Common/Components/TreeView/tree-view-utility.component'
import {StaticService} from '../../Application/Modules/Common/Services/static.service'
import {CompanyAdminUserManagementListService} from '../../Application/Modules/CompanyAdmin/CompanyUser/list/company-admin-user-management-list.service'
import {CompanyAdminUserManagementSelectedDataService} from '../../Application/Modules/CompanyAdmin/CompanyUser/list/company-admin-user-management-selected-data.service'
import {NgbdDatepickerCalendars} from '../alt-calendar/datepicker-calendars'
import {AuthorizationLevelPopUpComponent} from '../authorizationPopUp/authorization-popup.component'
import {AuthorizationLevelTableComponent} from '../authorizationTable/authorization-table.component'
import {ArbCalendarComponent} from '../calendar/calendar-component'
import {CalendarService} from '../calendar/calendar.service'
import {TableExportComponent} from '../export/table-export.component'
import {DatatableMobileComponent} from '../responsive/datatable-mobile.component'
import {DataTablePagerComponent} from '../responsive/pager-mobile.component'
import {PaymentPipe} from './../../Application/Components/common/Pipes/paymenttype-pipe'
import {HiddenAccountPipe} from '../../Application/Components/common/Pipes/account-hidden'
import {HiddenCardNumberPipe} from '../../Application/Components/common/Pipes/card-number-hidden'
import {CardPaymentTypePipe} from '../../Application/Components/common/Pipes/card-payment-type'
import {CKEditorModule} from 'ckeditor4-angular'
import {CardBalancePercentagePipe} from '../../Application/Components/common/Pipes/card-balance-percentage-pipe'
import {InitiatorWizardAddComponent} from '../../Application/Modules/Common/Components/InitiatorWizardComponent/InitiatorWizardAddComponent/initiator-wizard-add.component'
import {InitiatorWizardModifyComponent} from '../../Application/Modules/Common/Components/InitiatorWizardComponent/InitiatorWizardModifyComponent/initiator-wizard-modify.component'
import {InitiatorWizardDeleteComponent} from '../../Application/Modules/Common/Components/InitiatorWizardComponent/InitiatorWizardDeleteComponent/initiator-wizard-delete.component'
import {PrepaidCardOperationTypePipe} from 'app/Application/Components/common/Pipes/prepaid-card-operation-type'
import {PrePaidCardPaymentService} from 'app/Application/Modules/PrePaidCard/PrePaidCardPayment/prePaidCardPayment.service'
import {DynamicSearchableTableComponent} from '../../Application/Modules/Common/Components/DynamicSearchableTable/dynamic-searchable-table.component'
import {BusinessCardStatusPipe} from 'app/Application/Components/common/Pipes/business-card-status.pipe'
import {InternalCampaignBannerComponent} from 'app/Application/Modules/Home/Component/campaign-banner/internal-campaign-banner.component'
import {CustomDropdownMenuComponent} from 'app/Application/Components/common/custom-dropdown-menu/custom-dropdown-menu.component'
import {LastLogonDateTimePipe} from 'app/Application/Components/common/Pipes/lastLogonDateTime-pipe'
import {CarouselModule} from 'ngx-bootstrap/carousel'
import {CardStatusConverterPipe} from 'app/Application/Components/common/Pipes/card-status-converter.pipe'
import {BlockCopyPasteDirective} from '../../Application/Components/common/preventCopyPaste'
import {TranslateValidationPipe} from '../../Application/Components/common/Pipes/translate-validation-pipe'
import {MaskMobileNumber} from "../../Application/Components/common/Pipes/maskMobileNumber-pipe";
import {AmountFormatDirective} from "../../Application/Components/common/amount-format.directive";
import {ChartsModule} from "ng2-charts";
import {CollapseCardComponent} from "../../Application/Modules/Common/Components/collapse-card/collapse-card.component";
import {SelectAccountComponent} from "../../Application/Modules/Common/Components/select-account/select-account.component";
import {QueryParamsManipulationService} from "../../Application/Components/common/services/query-params-manipulation.service";
import {TypeOperationStatusConverterPipe} from 'app/Application/Components/common/Pipes/type-operation.pipe'
import {DigitsLetterFormatterPipe} from "../../Application/Components/common/Pipes/digits-letter-formatter.pipe";
import {DoughnutChartComponent} from "../../Application/Modules/Common/Components/charts/doughnut-chart/doughnut-chart.component";
import {BarChartComponent} from "../../Application/Modules/Common/Components/charts/bar-chart/bar-chart";
import {RetryActionComponent} from "../../Application/Modules/Common/Components/retry-action/retry-action.component";
import {CardViewComponent} from "../../Application/Modules/Common/Components/card-view/card-view.component";
import {LineChartComponent} from "../../Application/Modules/Common/Components/charts/line-chart/line-chart.component";
import {BaseChartComponent} from "../../Application/Modules/Common/Components/charts/base-chart/base-chart.component";
import {SheetImporterComponent} from "../../Application/Components/common/sheet-importer/sheet-importer.component";
import { IgnoreGMTPipe } from 'app/Application/Components/common/Pipes/ignore-gmt.pipe'
import {CountDownProgressComponent} from "../../Application/Components/common/count-down-progress/count-down-progress.component";

defineLocale('ar', arLocale)
defineLocale('en', enGbLocale)

@NgModule({
  declarations: [
    ValuesPipe,
    TableExportComponent,
    DataTablePagerComponent,
    AuthorizationLevelTableComponent,
    AuthorizationLevelPopUpComponent,
    BillCodePipe,
    ModelPipe,
    AmountCurrencyPipe,
    BaseAmountPipe,
    VatAmountPipe,
    SecuredAuthentication,
    AutofocusDirective,
    InputPattern,
    KeyValuePipe,
    StatusPipe,
    TerminalstatusPipe,
    TranslateDatePipe,
    HijraDateFormatPipe,
    DateFormatPipe,
    HijraFullDateTransformPipe,
    NgbdDatepickerCalendars,
    ArbCalendarComponent,
    LevelFormatPipe,
    DynamicSimpleExtrasFormFieldsComponent,
    CompanyAdminUserManagementEditFormComponent,
    PendingActionsUtilityComponent,
    PendingActionsUtilityStep0Component,
    PendingActionsUtilityStep1Component,
    PendingActionsUtilityStep2Component,
    PendingActionsUtilityStep3Component,
    SearchCompanyUtilityComponent,
    TreeViewUtilityComponent,
    TreeViewConfiguratorUtilityComponent,
    OperationPipe,
    QuarterPipe,
    DecimalPrecisionDirective,
    BlockCopyPasteDirective,
    PaymentPipe,
    InternalCampaignBannerComponent,
    CustomDropdownMenuComponent,
    LastLogonDateTimePipe,
    HiddenAccountPipe,
    HiddenCardNumberPipe,
    CardPaymentTypePipe,
    CardBalancePercentagePipe,
    InitiatorWizardAddComponent,
    InitiatorWizardModifyComponent,
    InitiatorWizardDeleteComponent,
    DynamicSearchableTableComponent,
    BusinessCardStatusPipe,
    CardStatusConverterPipe,
    PrepaidCardOperationTypePipe,
    TranslateValidationPipe,
    TypeOperationStatusConverterPipe,
    AmountFormatDirective,
    MaskMobileNumber,
    BarChartComponent,
    DoughnutChartComponent,
    CollapseCardComponent,
    SelectAccountComponent,
    DigitsLetterFormatterPipe,
    RetryActionComponent,
    IgnoreGMTPipe,
    CardViewComponent,
    LineChartComponent,
    BaseChartComponent,
    SheetImporterComponent,
    CountDownProgressComponent
  ],
  imports: [
    TranslateModule,
    CommonModule,
    RouterModule,
    FormsModule,
    NgSelectModule,
    NgbModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    CollapseModule.forRoot(),
    TabsModule.forRoot(),
    BsDropdownModule.forRoot(),
    DatepickerModule.forRoot(),
    PopoverModule.forRoot(),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    QRCodeModule,
    OrderModule,
    ArbDesignComponentModule,
    GoogleChartsModule.forRoot(),
    CarouselModule.forRoot(),
    CKEditorModule,
    ChartsModule,
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    TranslateModule,
    NgxDatatableModule,
    CollapseModule,
    TabsModule,
    ValuesPipe,
    OrderPipe,
    BsDropdownModule,
    DatepickerModule,
    ModalModule,
    PopoverModule,
    ArbDesignComponentModule,
    TableExportComponent,
    DataTablePagerComponent,
    AuthorizationLevelTableComponent,
    AuthorizationLevelPopUpComponent,
    BillCodePipe,
    ModelPipe,
    AmountCurrencyPipe,
    BaseAmountPipe,
    VatAmountPipe,
    SecuredAuthentication,
    KeyValuePipe,
    AutofocusDirective,
    InputPattern,
    StatusPipe,
    TerminalstatusPipe,
    TranslateDatePipe,
    HijraDateFormatPipe,
    DateFormatPipe,
    LevelFormatPipe,
    HijraFullDateTransformPipe,
    NgbdDatepickerCalendars,
    ArbCalendarComponent,
    NgbModule,
    DynamicSimpleExtrasFormFieldsComponent,
    CompanyAdminUserManagementEditFormComponent,
    PendingActionsUtilityComponent,
    PendingActionsUtilityStep0Component,
    PendingActionsUtilityStep1Component,
    PendingActionsUtilityStep2Component,
    PendingActionsUtilityStep3Component,
    SearchCompanyUtilityComponent,
    TreeViewUtilityComponent,
    QuarterPipe,
    OperationPipe,
    TreeViewConfiguratorUtilityComponent,
    DecimalPrecisionDirective,
    BlockCopyPasteDirective,
    PaymentPipe,
    InternalCampaignBannerComponent,
    CustomDropdownMenuComponent,
    LastLogonDateTimePipe,
    HiddenAccountPipe,
    HiddenCardNumberPipe,
    CardPaymentTypePipe,
    CardBalancePercentagePipe,
    InitiatorWizardAddComponent,
    InitiatorWizardModifyComponent,
    InitiatorWizardDeleteComponent,
    DynamicSearchableTableComponent,
    BusinessCardStatusPipe,
    PrepaidCardOperationTypePipe,
    CardStatusConverterPipe,
    TranslateValidationPipe,
    TypeOperationStatusConverterPipe,
    AmountFormatDirective,
    MaskMobileNumber,
    BarChartComponent,
    DoughnutChartComponent,
    CollapseCardComponent,
    SelectAccountComponent,
    DigitsLetterFormatterPipe,
    RetryActionComponent,
    IgnoreGMTPipe,
    CardViewComponent,
    LineChartComponent,
    BaseChartComponent,
    SheetImporterComponent,
    CountDownProgressComponent
  ],
  providers: [
    ModelService,
    DashboardService,
    DashboardMenuService,
    CurrencyService,
    DatePipe,
    DateFormatPipe,
    CalendarService,
    StaticService,
    SearchCompanyUtilityService,
    CompanyAdminUserManagementSelectedDataService,
    CompanyAdminUserManagementListService,
    StatusPipe,
    LevelFormatPipe,
    CompanyAdminUserManagementEditFormService,
    PrePaidCardPaymentService,
    TranslateValidationPipe,
    IgnoreGMTPipe,
    QueryParamsManipulationService
  ],
})
export class AppSharedModuleWithoutValidator {
  constructor(@Inject(PLATFORM_ID) protected _platformId) {
    DatatableMobileComponent.platformId = _platformId
  }
}
