import { AfterViewInit, Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { forkJoin, Observable, Subscription } from 'rxjs'
import { GovernmentRevenueTransferPaymentsService } from '../../government-revenue-transfer-payments.service'
import { AbstractAppComponent } from '../../../../../Common/Components/Abstract/abstract-app.component'
import { AuthenticationService } from '../../../../../../../core/security/authentication.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { StaticService } from '../../../../../Common/Services/static.service'
import { HijraFullDateTransformPipe } from 'app/Application/Components/common/Pipes/hijra-tranform-full-date-pipe'
import { NgbDateCustomParserFormatter } from 'app/core/alt-calendar/date-custom-parse-formatter'
import { isDate } from 'ngx-bootstrap/chronos'

@Component({
  templateUrl: './step1.component.html',
})
export class Step1Component
  extends AbstractAppComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('searchPanel', { static: true }) searchPanel: any
  step = 1
  searchForm: FormGroup
  searchFormData: any
  fieldsConfigForSearchForm: any[] = []
  translate_prefix = 'governmentRevenue.bulkUploadFile'

  combosKeys: any[] = ['govRevenueBankCode']
  hijriDate: NgbDateCustomParserFormatter
  fromAmount = false;
  toAmount = false;

  combosData: any = {
    accountsList: [],
    banksList: [],
    statusList: [],
    conmpanyUsersList: [],
  }

  sharedData: any = {
    govRevTransPayTableSelected: [],
    govRevFileTransPayTableSelected: [],
  }

  govRevTransPayPagedResults: any = {}
  govRevTransPayTableDisplaySize = 20

  govRevFileTransPayPagedResults: any = {}
  govRevFileTransPayTableDisplaySize = 20

  hasGovRevenueGroupPrivilege: boolean = false

  hasGovRevenueBulkUploadGroupPrivilege: boolean = false

  constructor(
    private service: GovernmentRevenueTransferPaymentsService,
    public translate: TranslateService,
    private router: Router,
    private authentication: AuthenticationService,
    public fb: FormBuilder,
    public staticService: StaticService,
    public injector: Injector,
  ) {
    super(translate)
    this.searchForm = this.fb.group({})
  }

  ngOnInit(): void {
    super.ngOnInit()

    setTimeout(() => {
      this.sharedData['isDetailActivated'] = false
    }, 200)

    this.hasGovRevenueGroupPrivilege = this.authentication.activateOption(
      'GovernmentRevenueMenu',
      ['GOVERNMENTREVENUE_PRIVILEGE'],
      ['GovRevenueGroup'],
    )

    this.hasGovRevenueBulkUploadGroupPrivilege =
      this.authentication.activateOption(
        'GovernmentRevenueMenu',
        ['GOVERNMENTREVENUE_PRIVILEGE'],
        ['GovRevenueBulkUploadGroup'],
      )

    this.govRevTransPayPagedResults.items = []
    this.govRevTransPayPagedResults.size = 0
    this.govRevTransPayPagedResults.total = 0

    this.govRevFileTransPayPagedResults.items = []
    this.govRevFileTransPayPagedResults.size = 0
    this.govRevFileTransPayPagedResults.total = 0

    this.onSetPageGovRevTransPay(null)

    this.onSetPageGovRevFileTransPay(null)
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  loadStatusList() {
    // load combos data

    // ----------------------------
    this.combosData.statusList = [
      {
        key: 'P',
        value: 'status.pending',
      },
      {
        key: 'A',
        value: 'status.aprove',
      },
      {
        key: 'R',
        value: 'status.rejected',
      },
    ]
  }

  refreshData() {
    super.refreshData()
    this.loadStatusList()

    // ----------------------------
    this.subscriptions.push(
      forkJoin([
        this.service.getPendingGovernmentRevenueFilterInit(),
        this.staticService.getAllCombosAsArrays(this.combosKeys),
      ]).subscribe((results: any[]) => {
        // ----------------------------
        const result = results[0]
        const resultC = results[1]
        // ----------------------------
        if (!result.error) {
          const accountsList = []
          const conmpanyUsersList = []
          result.listInitiateAccountDTO.forEach((account) => {
            accountsList.push({
              key: account.accountPk,
              value: account.ibanNumber,
            })
          })
          result.companyUsersLst.forEach((user) => {
            conmpanyUsersList.push({
              key: user.key,
              value: user.value,
            })
          })

          this.combosData.accountsList = accountsList
          this.combosData.conmpanyUsersList = conmpanyUsersList
        }
        // ----------------------------
        if (resultC === null) {
          //this.onError(resultC);
        } else {
          const data: Object = resultC
          for (let i = 0; i < this.combosKeys.length; i++) {
            this.combosData[this.combosKeys[i]] = data[this.combosKeys[i]]
          }
          this.combosData.banksList = this.combosData.govRevenueBankCode
        }
        // ----------------------------
        this.fieldsConfigForSearchForm = this.getFieldsConfigForSearchForm()
      }),
    )
  }
  ngAfterViewInit() {
    super.ngAfterViewInit()
    if (this.searchPanel) {
      this.searchPanel.isCollapsedContent = true
    }
  }
  // ---------------------------------------------------------

  public getFieldsConfigForSearchForm(): any[] {
    return [
      {
        key: 'search',
        title: 'search',
        translate: 'search',
        type: 'hidden',
        required: false,
        default: true,
        validators: [],
        widget: '',
        widget_container_class: 'hidden',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'batchName',
        title: 'batchName',
        translate: 'batchName',
        type: 'text',
        required: false,
        default: null,
        disabled: false,
        validators: [],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'accountPk',
        title: 'accountNumber',
        translate: 'accountNumber',
        type: 'select',
        required: false,
        default: null,
        disabled: false,
        validators: [],
        select_combo_key: 'accountsList',
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'beneficiaryBank',
        title: 'beneficiaryBank',
        translate: 'beneficiaryBank',
        type: 'select',
        required: false,
        default: null,
        disabled: false,
        select_combo_key: 'banksList',
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'letterNumber',
        title: 'letterNumber',
        translate: 'letterNumber',
        type: 'text',
        required: false,
        default: '',
        disabled: false,
        validators: [],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
        inputPattern: 'noSpecials',
      },
      {
        key: 'letterValueDate',
        title: 'letterDate',
        translate: 'letterDate',
        type: 'date',
        required: false,
        default: null,
        validators: [],
        widget: 'datepicker-ar',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
        widget_datepicker_min_date:false,
        widget_datepicker_max_date:false,
      },
      {
        key: 'letterDateFrom',
        title: 'letterPeriodFrom',
        translate: 'letterPeriodFrom',
        type: 'date',
        required: false,
        default: null,
        validators: [],
        widget: 'datepicker-ar',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
        widget_datepicker_max_date: 'letterDateTo',
        widget_datepicker_min_date:false,
      },
      {
        key: 'letterDateTo',
        title: 'letterPeriodTo',
        translate: 'letterPeriodTo',
        type: 'date',
        required: false,
        default: null,
        validators: [],
        widget: 'datepicker-ar',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
        widget_datepicker_min_date: 'letterDateFrom',
        widget_datepicker_max_date:false,
      },
      {
        key: 'closingDateFinYear',
        title: 'finClosingYear',
        translate: 'finClosingYear',
        type: 'text',
        required: false,
        default: '',
        disabled: false,
        validators: [],
        maxlength: 35,
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'status',
        title: 'status',
        translate: 'status',
        type: 'select',
        required: false,
        default: '',
        disabled: false,
        validators: [],
        select_combo_key: 'statusList',
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
        translate_rendered_text: true,
      },
      {
        key: 'initiationDateFrom',
        title: 'initiationDateFrom',
        translate: 'initiationDateFrom',
        type: 'date',
        required: false,
        default: '',
        validators: [],
        widget: 'datepicker',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
        widget_datepicker_min_date: false,
        widget_datepicker_max_date: 'initiationDateTo',
        widget_event_on_change: ($event, field, combosData, formModel) => {
          const dateValue = formModel.controls[field['key']].value
          const dateFrom = formModel.controls['initiationDateFrom'] ? formModel.controls['initiationDateFrom'].value : null
          const dateTo = formModel.controls['initiationDateTo'] ? formModel.controls['initiationDateTo'].value : null
          if (isDate(dateFrom) && isDate(dateTo)) {
              dateFrom.setHours(0, 0, 0, 0)
              dateTo.setHours(0, 0, 0, 0)
              if (dateTo < dateFrom) {
                  formModel.controls['initiationDateFrom'].setValue(dateValue);
                  formModel.controls['initiationDateTo'].setValue(dateValue);
                  formModel.controls['initiationDateFrom'].updateValueAndValidity();
                  formModel.controls['initiationDateTo'].updateValueAndValidity();
              }
          }
      },
      },
      {
        key: 'initiationDateTo',
        title: 'initiationDateTo',
        translate: 'initiationDateTo',
        type: 'date',
        required: false,
        default: '',
        validators: [],
        widget: 'datepicker',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_datepicker_min_date: 'initiationDateFrom',
        widget_datepicker_max_date: false,
        widget_container_init_row: false,
        widget_container_end_row: false,
        widget_event_on_change: ($event, field, combosData, formModel) => {
          const dateValue = formModel.controls[field['key']].value
          const dateFrom = formModel.controls['initiationDateFrom'] ? formModel.controls['initiationDateFrom'].value : null
          const dateTo = formModel.controls['initiationDateTo'] ? formModel.controls['initiationDateTo'].value : null
          if (isDate(dateFrom) && isDate(dateTo)) {
              dateFrom.setHours(0, 0, 0, 0)
              dateTo.setHours(0, 0, 0, 0)
              if (dateTo < dateFrom) {
                  formModel.controls['initiationDateFrom'].setValue(dateValue);
                  formModel.controls['initiationDateTo'].setValue(dateValue);
                  formModel.controls['initiationDateFrom'].updateValueAndValidity();
                  formModel.controls['initiationDateTo'].updateValueAndValidity();
              }
          }
      },
      },
      {
        key: 'initiatedBy',
        title: 'initiatedBy',
        translate: 'initiatedBy',
        type: 'select',
        required: false,
        default: '',
        disabled: false,
        validators: [],
        select_combo_key: 'conmpanyUsersList',
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'totalAmountFrom',
        title: 'totalAmountFrom',
        translate: 'totalAmountFrom',
        type: 'text',
        required: false,
        default: '',
        disabled: false,
        validators: [],
        fieldLimitMax:'totalAmountTo',
        widget: '',
        inputPattern: 'onlyPositiveDecimalNumbers',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'totalAmountTo',
        title: 'totalAmountTo',
        translate: 'totalAmountTo',
        type: 'text',
        required: false,
        default: '',
        disabled: false,
        validators: [],
        fieldLimitMin: 'totalAmountFrom',
        widget: '',
        inputPattern: 'onlyPositiveDecimalNumbers',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,

      },
    ]
  }

  public onSearchFormReady($event): void {
    // console.log($event)
    // $event.form.reset();
  }

  public search(): void {
    this.onSetPageGovRevTransPay(null)

    this.onSetPageGovRevFileTransPay(null)
  }

  public reset(): void {
    this.searchForm.reset()

    this.search()
  }

  // ---------------------------------------------------------

  onSetPageGovRevTransPay(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }

    if (!this.hasGovRevenueGroupPrivilege) {
      return false
    }

    const filterData = this.searchForm.getRawValue()

    this.subscriptions.push(
      this.service
        .getPendingGovernmentRevenueTransferPayments(
          filterData,
          pageInfo.offset + 1,
          this.govRevTransPayTableDisplaySize,
        )
        .subscribe((result) => {
          if (!result.error) {
            this.govRevTransPayPagedResults = result.govRevPrevious
          }
        }),
    )
  }

  onSetPageGovRevFileTransPay(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }

    if (!this.hasGovRevenueBulkUploadGroupPrivilege) {
      return false
    }

    const filterData = this.searchForm.getRawValue()

    this.subscriptions.push(
      this.service
        .getPendingGovernmentRevenueFileTransferPayments(
          filterData,
          pageInfo.offset + 1,
          this.govRevFileTransPayTableDisplaySize,
        )
        .subscribe((result) => {
          if (!result.error) {
            this.govRevFileTransPayPagedResults =
              result.pendingGovRevenueFileList
          }
        }),
    )
  }

  // ---------------------------------------------------------

  onChangeDisplaySizeGovRevTransPay(event) {
    this.govRevTransPayTableDisplaySize = event
    this.onSetPageGovRevTransPay(null)
  }

  onChangeDisplaySizeGovRevFileTransPay(event) {
    this.govRevFileTransPayTableDisplaySize = event
    this.onSetPageGovRevFileTransPay(null)
  }

  // ---------------------------------------------------------

  onSelectGovRevTransPay({ selected }) {
    this.sharedData.govRevTransPayTableSelected.splice(
      0,
      this.sharedData.govRevTransPayTableSelected.length,
    )
    this.sharedData.govRevTransPayTableSelected.push(...selected)
  }

  onSelectGovRevFileTransPay({ selected }) {
    this.sharedData.govRevFileTransPayTableSelected.splice(
      0,
      this.sharedData.govRevFileTransPayTableSelected.length,
    )
    this.sharedData.govRevFileTransPayTableSelected.push(...selected)
  }

  // ---------------------------------------------------------

  onDetailGovRevTransPay(item) {
    this.sharedData.govRevTransPayTableSelected = []
    this.sharedData.govRevFileTransPayTableSelected = []
    this.sharedData.govRevTransPayTableSelected.push(item)

    this.router.navigate([
      '/myprofile/pending/government-revenue-transfer-payments/detail',
    ])
  }

  onDetailGovRevFileTransPay(item) {
    this.sharedData.govRevTransPayTableSelected = []
    this.sharedData.govRevFileTransPayTableSelected = []
    this.sharedData.govRevFileTransPayTableSelected.push(item)

    this.router.navigate([
      '/myprofile/pending/government-revenue-transfer-payments/file-detail',
    ])
  }

  // ---------------------------------------------------------

  valid() {
    return true
  }
}
