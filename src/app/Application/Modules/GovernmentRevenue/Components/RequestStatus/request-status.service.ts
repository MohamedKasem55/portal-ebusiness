import { DatePipe } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Observable } from 'rxjs'
import { DomSanitizer } from '@angular/platform-browser'
import { AbstractListDynamicService } from 'app/Application/Modules/Common/Services/Abstract/abstract-list-dynamic.service'
import { ConfigResourceService } from 'app/core/config/config.resource.local'
import { StatusPipe } from 'app/Application/Components/common/Pipes/status-pipe'
import { LevelFormatPipe } from 'app/Application/Components/common/Pipes/getLevels-pipe'
import { ResponseGovRevenueRequestList } from '../../Model/gov-request-list'
import { DateFormatPipe } from 'app/Application/Components/common/Pipes/date-format-pipe'
import { AmountCurrencyPipe } from 'app/Application/Components/common/Pipes/amount-currency.pipe'
import { ModelPipe } from 'app/Application/Components/common/Pipes/model-pipe'
import { NgbDateCustomParserFormatter } from 'app/core/alt-calendar/date-custom-parse-formatter'

@Injectable()
export class RequestStatusService extends AbstractListDynamicService {
  combosData: any = {}
  hijriDate: NgbDateCustomParserFormatter

  constructor(
    protected translate: TranslateService,
    protected dateService: DatePipe,
    protected http: HttpClient,
    public config: ConfigResourceService,
    private injector: Injector,
    @Inject(LOCALE_ID) private locale: string,
    public sanitizer: DomSanitizer,
  ) {
    super(translate, http, config)
    this.hijriDate = new NgbDateCustomParserFormatter();
  }

  //----------------------------------------------------------------------

  /**
   * Returns search form fields definitions
   */
  public getFieldsConfigForSearchForm(): any[] {
    const _fieldsConfigForSearchForm: any[] = []

    _fieldsConfigForSearchForm.push({
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
    })

    _fieldsConfigForSearchForm.push({
      key: 'batchName',
      title: 'batchName',
      translate: 'bulkUploadFile.batchName',
      type: 'text',
      required: false,
      default: '',
      validators: [],
      widget: 'text',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: false,
      translate_rendered_text: true,
      widget_options_in_separated_lines: false,
    })

    _fieldsConfigForSearchForm.push({
      key: 'accounDeducction',
      title: 'accounDeducction',
      translate: 'bulkUploadFile.accountNumber',
      type: 'select',
      required: false,
      default: '',
      validators: [],
      widget: 'select',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: false,
      select_combo_key: 'govRevenueAccountsList',
    })

    _fieldsConfigForSearchForm.push({
      key: 'beneficiaryBank',
      title: 'beneficiaryBank',
      translate: 'bulkUploadFile.beneficiaryBank',
      type: 'select',
      required: false,
      default: '',
      validators: [],
      widget: 'select',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: false,
      select_combo_key: 'govRevenueBankCode',
    })

    _fieldsConfigForSearchForm.push({
      key: 'letterNumber',
      title: 'letterNumber',
      translate: 'letterNumber',
      type: 'text',
      required: false,
      default: '',
      validators: [],
      widget: 'text',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: false,
      translate_rendered_text: true,
      widget_options_in_separated_lines: false,
      inputPattern: 'noSpecials',
    })

    _fieldsConfigForSearchForm.push({
      key: 'letterDate',
      title: 'letterDate',
      translate: 'letterDate',
      type: 'date',
      required: false,
      default: null,
      validators: [],
      widget: 'datepicker-ar',
      widget_datepicker_min_date: false,
      widget_datepicker_max_date: false,
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: false,
      translate_rendered_text: true,
      widget_options_in_separated_lines: false,
    })

    _fieldsConfigForSearchForm.push({
      key: 'letterDateFrom',
      title: 'letterDateFrom',
      translate: 'bulkUploadFile.letterPeriodFrom',
      type: 'date',
      required: false,
      default: null,
      validators: [],
      widget: 'datepicker-ar',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_datepicker_min_date: false,
      widget_datepicker_max_date: 'letterDateTo',
      widget_container_init_row: false,
      widget_container_end_row: false,
      translate_rendered_text: true,
      widget_options_in_separated_lines: false,
    })

    _fieldsConfigForSearchForm.push({
      key: 'letterDateTo',
      title: 'letterDateTo',
      translate: 'bulkUploadFile.letterPeriodTo',
      type: 'date',
      required: false,
      default: null,
      validators: [],
      widget: 'datepicker-ar',
      widget_datepicker_min_date: 'letterDateFrom',
      widget_datepicker_max_date: false,
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: false,
      translate_rendered_text: true,
      widget_options_in_separated_lines: false,
    })

    _fieldsConfigForSearchForm.push({
      key: 'closingDate',
      title: 'closingDate',
      translate: 'bulkUploadFile.finClosingYear',
      type: 'text',
      required: false,
      default: '',
      validators: [],
      widget: 'text',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: false,
      translate_rendered_text: true,
      widget_options_in_separated_lines: false,
    })

    _fieldsConfigForSearchForm.push({
      key: 'status',
      title: 'status',
      translate: 'status',
      type: 'select',
      required: false,
      default: null,
      validators: [],
      widget: 'select',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: false,
      translate_rendered_text: true,
      widget_options_in_separated_lines: false,
      select_combo_key: 'status',
    })

    return _fieldsConfigForSearchForm
  }

  /**
   * Returns list fields definitions for results
   */
  public getFieldsConfigForList(): any[] {
    const _fieldsConfigForList: any[] = [
      {
        key: 'batchName',
        propName: 'batchName',
        propValue: (row, service, combosData) => {
          return (row.batchName ? row.batchName : this.injector.get(TranslateService).instant('governmentRevenue.request_status.individualPayment'))
        },
        translate: 'governmentRevenue.bulkUploadFile.batchName',
        link_to_detail: true,
        parent_div_class: 'col-xs-6',
        export: true,
        export_column_width: 'auto',
        append_next_column: false,
        column_width: 200,
      },
      {
        key: 'letterNumber',
        propName: 'letterNumber',
        propValue: (row, service, combosData) => row.letterNumber,
        translate: 'governmentRevenue.bulkUploadFile.letterNumber',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        export_column_width: 'auto',
        append_next_column: true,
      },
      {
        key: 'letterValueDate',
        propName: 'letterValueDate',
        propValue: (row, service, combosData) => {
          return this.dateService.transform(row.letterValueDate, 'dd/MM/yyyy')
        },
        translate: 'governmentRevenue.bulkUploadFile.letterDate',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        export_column_width: 'auto',
        append_next_column: false,
      },

      {
        key: 'letterPeriodFrom',
        propName: 'letterPeriodFrom',
        propValue: (row, service, combosData) => {
          return this.dateService.transform(row.letterPeriodFrom, 'dd/MM/yyyy')
        },
        translate: 'governmentRevenue.bulkUploadFile.periodFrom',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        export_column_width: 'auto',
        append_next_column: true
      },
      {
        key: 'letterPeriodTo',
        propName: 'letterPeriodTo',
        propValue: (row, service, combosData) => {
          return this.dateService.transform(row.letterPeriodTo, 'dd/MM/yyyy')
        },
        translate: 'governmentRevenue.bulkUploadFile.periodTo',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        export_column_width: 'auto',
        append_next_column: false,
      },

      {
        key: 'beneficiaryBank',
        propName: 'beneficiaryBank',
        propValue: (row, service, combosData) => row.beneficiaryBank,
        translate: 'governmentRevenue.bulkUploadFile.beneficiaryBank',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        export_column_width: 'auto',
        append_next_column: true
      },
      {
        key: 'finClosingYear',
        propName: 'finClosingYear',
        propValue: (row, service, combosData) => row.finClosingYear,
        translate: 'governmentRevenue.bulkUploadFile.closingDate',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        export_column_width: 'auto',
        append_next_column: false,
      },

      {
        key: 'totalAmount',
        propName: 'totalAmount',
        propValue: (row, service, combosData) => {
          row.totalCurrency = JSON.parse(
            JSON.stringify(
              new AmountCurrencyPipe(this.injector, this.locale).transform(
                row.totalAmount,
                null,
              ) +
                ' ' +
                new ModelPipe(this.injector).transform(
                  'currencyIso',
                  row.account.currency,
                ),
            ),
          )
          return row.totalCurrency
        },
        translate: 'governmentRevenue.totalAmount',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        export_column_width: 'auto',
        append_next_column: true
      },
      {
        key: 'recordCount',
        propName: 'recordCount',
        propValue: (row, service, combosData) => row.recordCount,
        translate: 'governmentRevenue.bulkUploadFile.numRecords',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        export_column_width: 'auto',
        append_next_column: false,
      },

      {
        key: 'fullAccountNumber',
        propName: 'fullAccountNumber',
        propValue: (row, service, combosData) => {
          row.fullAccountNumber = row.account.fullAccountNumber
          return row.fullAccountNumber
        },
        translate: 'governmentRevenue.bulkUploadFile.accountName',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        export_column_width: 'auto',
        append_next_column: true,
        column_width: 200,
      },
      {
        key: 'alias',
        propName: 'alias',
        propValue: (row, service, combosData) => {
          row.alias = row.account.alias
          return row.alias
        },
        translate: 'governmentRevenue.bulkUploadFile.nickName',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        export_column_width: 'auto',
        append_next_column: false,
      },

      {
        key: 'initiationBy',
        propName: 'initiationBy',
        propValue: (row, service, combosData) => row.initiationBy,
        translate: 'governmentRevenue.bulkUploadFile.initiatedBy',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        export_column_width: 'auto',
        append_next_column: true
      },
      {
        key: 'initiationDate',
        propName: 'initiationDate',
        propValue: (row, service, combosData) => {
          return this.dateService.transform(row.initiationDate, 'dd/MM/yyyy')
        },
        translate: 'governmentRevenue.bulkUploadFile.initiateDate',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        export_column_width: 'auto',
        append_next_column: false,
      },

      {
        key: 'curstatus',
        propName: 'securityDetails',
        propValue: (row, service, combosData) => {
          return new LevelFormatPipe(this.injector).transform(
            row.securityDetails,
            'status',
          )
        },
        translate: 'public.curstatus',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: false,
        export_column_width: 'auto',
        append_next_column: true
      },
      {
        key: 'nextStatus',
        propName: 'securityDetails',
        propValue: (row, service, combosData) => {
          return new LevelFormatPipe(this.injector).transform(
            row.securityDetails,
            'nextStatus',
          )
        },
        translate: 'myProfile.pending_actions.nextStatus',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: false,
        export_column_width: 'auto',
        append_next_column: false,
      },

      {
        key: 'status',
        propName: 'status',
        propValue: (row, service, combosData) => {
          return new StatusPipe(this.injector).transform(row.status)
        },
        translate: 'public.status',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        export_column_width: 'auto',
        append_next_column: false
      },

    ]

    return _fieldsConfigForList
  }

  //----------------------------------------------------------------------

  public isSelectItemsAllowed(): boolean {
    return false
  }

  //----------------------------------------------------------------------


  public getInitValues(): Observable<any> {
    return this.http.get(
      this.servicesUrl + '/governmentRevenue/newPayment/init',
    )
  }
  //----------------------------------------------------------------------

  protected createDataRequest(
    criteria: any,
    order: string,
    orderType: string,
    page: number,
    rows: number,
  ): Observable<any> {
    const params = {
      search: criteria.search ? true : false,
      accountNumber: criteria.accounDeducction,
      batchName: criteria.batchName,
      beneficiaryBank: criteria.beneficiaryBank,
      finClosingYear: criteria.closingDate,
      letterNumber: criteria.letterNumber,
      letterPeriodFrom: this.hijriDate.formatToRrequest(criteria.letterDateFrom),
      letterPeriodTo: this.hijriDate.formatToRrequest(criteria.letterDateTo),
      letterValueDate: this.hijriDate.formatToRrequest(criteria.letterDate),
      status: criteria.status
    }

    return this.http.post<ResponseGovRevenueRequestList>(
      this.servicesUrl + '/governmentRevenue/requestStatus/list',
      params,
    )
  }

  protected getOutputFromRequestedData(_body: ResponseGovRevenueRequestList) {
    return {
      data: {
        items: _body.batchList,
        size: _body.batchList.length,
        total: _body.batchList.length,
      },
      size: _body.batchList.length,
      total: _body.batchList.length,
    }
  }

  public getExportHeader() {
    return this.translate.instant('governmentRevenue.requestStatus')
  }

  public showExportButtons() {
    return true
  }

}
