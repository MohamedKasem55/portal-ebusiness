import { DatePipe } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Observable } from 'rxjs'
import { DomSanitizer } from '@angular/platform-browser'
import { AbstractListDynamicService } from 'app/Application/Modules/Common/Services/Abstract/abstract-list-dynamic.service'
import { ConfigResourceService } from 'app/core/config/config.resource.local'
import { ResponseGovRevenueFileProcessList } from '../../Model/processed-operation-list'
import { DateFormatPipe } from 'app/Application/Components/common/Pipes/date-format-pipe'
import { ModelPipe } from 'app/Application/Components/common/Pipes/model-pipe'
import { AmountCurrencyPipe } from 'app/Application/Components/common/Pipes/amount-currency.pipe'
import { FormGroup, Validators } from '@angular/forms'
import { HijraFullDateTransformPipe } from 'app/Application/Components/common/Pipes/hijra-tranform-full-date-pipe'
import { NgbDateCustomParserFormatter } from 'app/core/alt-calendar/date-custom-parse-formatter'
import { isDate } from 'ngx-bootstrap/chronos'

@Injectable()
export class ProcessedOperationService extends AbstractListDynamicService {
  combosData: any = {}
  hijriDate: NgbDateCustomParserFormatter
  fromAmount = false;
  toAmount = false;


  constructor(
    protected translate: TranslateService,
    protected datePipe: DatePipe,
    protected http: HttpClient,
    public config: ConfigResourceService,
    private injector: Injector,
    @Inject(LOCALE_ID) private locale: string,
    public sanitizer: DomSanitizer,
  ) {
    super(translate, http, config)
    this.hijriDate = new NgbDateCustomParserFormatter()
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
      widget: null,
      widget_container_class: 'hidden',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    _fieldsConfigForSearchForm.push({
      key: 'letterNumber',
      title: 'letterNumber',
      translate: 'letterNumber',
      type: 'text',
      required: false,
      default: null,
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
      widget_datepicker_min_date: false,
      widget_datepicker_max_date: 'letterDateTo',
      widget_container_class: 'col-xs-12 col-sm-4',
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
      key: 'beneficiaryName',
      title: 'beneficiaryName',
      translate: 'processed_operations.beneficiaryName',
      type: 'select',
      required: false,
      default: null,
      validators: [],
      widget: 'select',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: false,
      select_combo_key: 'companyDepositors',
    })

    _fieldsConfigForSearchForm.push({
      key: 'depositorName',
      title: 'depositorName',
      translate: 'processed_operations.depositorName',
      type: 'select',
      required: false,
      default: null,
      validators: [],
      widget: 'select',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: false,
      select_combo_key: 'companyDepositors',
    })

    _fieldsConfigForSearchForm.push({
      key: 'beneficiaryBank',
      title: 'beneficiaryBank',
      translate: 'bulkUploadFile.beneficiaryBank',
      type: 'select',
      required: false,
      default: null,
      validators: [],
      widget: 'select',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: false,
      select_combo_key: 'govRevenueBankCode',
    })

    _fieldsConfigForSearchForm.push({
      key: 'batchName',
      title: 'batchName',
      translate: 'bulkUploadFile.batchName',
      type: 'text',
      required: false,
      default: null,
      validators: [],
      widget: 'text',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: false,
      translate_rendered_text: true,
      widget_options_in_separated_lines: false,
    })

    _fieldsConfigForSearchForm.push({
      key: 'debitAccount',
      title: 'debitAccount',
      translate: 'processed_operations.debitAccount',
      type: 'select',
      required: false,
      default: null,
      validators: [],
      widget: 'select',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: false,
      select_combo_key: 'govRevenueAccountsList',
    })

    _fieldsConfigForSearchForm.push({
      key: 'approveDateFrom',
      title: 'approveDateFrom',
      translate: 'processed_operations.approveDateFrom',
      type: 'date',
      required: false,
      default: null,
      validators: [],
      widget: 'datepicker',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: false,
      widget_datepicker_min_date: false,
      widget_datepicker_max_date: 'approveDateTo',
      translate_rendered_text: true,
      widget_options_in_separated_lines: false,
      widget_event_on_change: ($event, field, combosData, formModel) => {
        const dateValue = formModel.controls[field['key']].value
        const dateFrom = formModel.controls['approveDateFrom'] ? formModel.controls['approveDateFrom'].value : null
        const dateTo = formModel.controls['approveDateTo'] ? formModel.controls['approveDateTo'].value : null
        if (isDate(dateFrom) && isDate(dateTo)) {
          dateFrom.setHours(0, 0, 0, 0)
          dateTo.setHours(0, 0, 0, 0)
          if (dateTo < dateFrom) {
            formModel.controls['approveDateFrom'].setValue(dateValue);
            formModel.controls['approveDateTo'].setValue(dateValue);
            formModel.controls['approveDateFrom'].updateValueAndValidity();
            formModel.controls['approveDateTo'].updateValueAndValidity();
          }
        }
      },
    })

    _fieldsConfigForSearchForm.push({
      key: 'approveDateTo',
      title: 'approveDateTo',
      translate: 'processed_operations.approveDateTo',
      type: 'date',
      required: false,
      default: null,
      validators: [],
      widget: 'datepicker',
      widget_datepicker_min_date: 'approveDateFrom',
      widget_datepicker_max_date: false,
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: false,
      translate_rendered_text: true,
      widget_options_in_separated_lines: false,
      widget_event_on_change: ($event, field, combosData, formModel) => {
        const dateValue = formModel.controls[field['key']].value
        const dateFrom = formModel.controls['approveDateFrom'] ? formModel.controls['approveDateFrom'].value : null
        const dateTo = formModel.controls['approveDateTo'] ? formModel.controls['approveDateTo'].value : null
        if (isDate(dateFrom) && isDate(dateTo)) {
          dateFrom.setHours(0, 0, 0, 0)
          dateTo.setHours(0, 0, 0, 0)
          if (dateTo < dateFrom) {
            formModel.controls['approveDateFrom'].setValue(dateValue);
            formModel.controls['approveDateTo'].setValue(dateValue);
            formModel.controls['approveDateFrom'].updateValueAndValidity();
            formModel.controls['approveDateTo'].updateValueAndValidity();
          }
        }
      },
    })

    _fieldsConfigForSearchForm.push({
      key: 'approvedBy',
      title: 'approvedBy',
      translate: 'processed_operations.approvedBy',
      type: 'select',
      required: false,
      default: null,
      validators: [],
      widget: 'select',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: false,
      select_combo_key: 'companyUsersLst',
    })

    _fieldsConfigForSearchForm.push({
      key: 'totalAmountFrom',
      title: 'totalAmountFrom',
      translate: 'bulkUploadFile.totalAmountFrom',
      type: 'text',
      required: false,
      fieldLimitMax: 'totalAmountTo',
      default: null,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-3',
      inputPattern: 'onlyPositiveDecimalNumbers',
      widget_container_init_row: false,
      widget_container_end_row: false,
      translate_rendered_text: true,
      widget_options_in_separated_lines: false,
    })

    _fieldsConfigForSearchForm.push({
      key: 'totalAmountTo',
      title: 'totalAmountTo',
      translate: 'bulkUploadFile.totalAmountTo',
      type: 'text',
      required: false,
      fieldLimitMin: 'totalAmountFrom',
      default: null,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-3',
      inputPattern: 'onlyPositiveDecimalNumbers',
      widget_container_init_row: false,
      widget_container_end_row: false,
      translate_rendered_text: true,
      widget_options_in_separated_lines: false,
    })

    return _fieldsConfigForSearchForm
  }

  /**
   * Returns list fields definitions for results
   */
  public getFieldsConfigForList(): any[] {
    const _fieldsConfigForList: any[] = [
      {
        key: 'letterNumber',
        propName: 'letterNumber',
        propValue: (row, service, combosData) => row.letterNumber,
        translate: 'governmentRevenue.bulkUploadFile.letterNumber',
        link_to_detail: true,
        parent_div_class: 'col-xs-6',
        export: true,
        export_column_width: 'auto',
        append_next_column: true,
      },
      {
        key: 'letterValueDate',
        propName: 'letterValueDate',
        propValue: (row, service, combosData) => {
          return this.datePipe.transform(row.letterValueDate, 'dd/MM/yyyy')
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
          return this.datePipe.transform(row.letterPeriodFrom, 'dd/MM/yyyy')
        },
        translate: 'governmentRevenue.bulkUploadFile.periodFrom',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        export_column_width: 'auto',
        append_next_column: true,
      },
      {
        key: 'letterPeriodTo',
        propName: 'letterPeriodTo',
        propValue: (row, service, combosData) => {
          return this.datePipe.transform(row.letterPeriodTo, 'dd/MM/yyyy')
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
        append_next_column: true,
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
        key: 'totalCurrency',
        propName: 'totalCurrency',
        propValue: (row, service, combosData) => {
          row.totalCurrency = JSON.parse(
            JSON.stringify(
              new AmountCurrencyPipe(this.injector, this.locale).transform(
                (row.detailAmount ? row.detailAmount : row.totalAmount),
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
        translate: 'governmentRevenue.amount',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        export_column_width: 'auto',
        append_next_column: true,
      },
      {
        key: 'detailRecordCount',
        propName: 'detailRecordCount',
        propValue: (row, service, combosData) => (row.detailRecordCount ? row.detailRecordCount : row.recordCount),
        translate: 'governmentRevenue.bulkUploadFile.revenueCount',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        export_column_width: 'auto',
        append_next_column: false,
      },

      {
        key: 'bankReference',
        propName: 'bankReference',
        propValue: (row, service, combosData) => row.bankReference,
        translate: 'governmentRevenue.processed_operations.bankReference',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        export_column_width: 'auto',
        append_next_column: true,
        column_width: 240,
      },
      {
        key: 'fileReference',
        propName: 'fileReference',
        propValue: (row, service, combosData) => row.fileReference,
        translate: 'governmentRevenue.processed_operations.fileReference',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        export_column_width: 'auto',
        append_next_column: false,
      },

      {
        key: 'transactionStatus',
        propName: 'transactionStatus',
        propValue: (row, service, combosData) => {
          if (!row.transactionStatus) {
            return this.injector.get(TranslateService).instant('governmentRevenue.processed_operations.sentTobank')
          } else {
            return new ModelPipe(this.injector).transform(
              'govRevenueTransactionStatus',
              row.transactionStatus,
            )
          }
        },
        translate: 'public.status',
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
        append_next_column: true,
      },
      {
        key: 'initiationDate',
        propName: 'initiationDate',
        propValue: (row, service, combosData) => {
          return this.datePipe.transform(row.initiationDate, 'dd/MM/yyyy')
        },
        translate: 'governmentRevenue.bulkUploadFile.initiateDate',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        export_column_width: 'auto',
        append_next_column: false,
      },

      {
        key: 'approvedBy',
        propName: 'approvedBy',
        propValue: (row, service, combosData) => row.approvedBy,
        translate: 'governmentRevenue.processed_operations.approvedBy',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        export_column_width: 'auto',
        append_next_column: true,
      },
      {
        key: 'approvedDate',
        propName: 'approvedDate',
        propValue: (row, service, combosData) => {
          return this.datePipe.transform(row.approvedDate, 'dd/MM/yyyy')
        },
        translate: 'governmentRevenue.processed_operations.approvedDate',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        export_column_width: 'auto',
        append_next_column: false,
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
      accountNumber: criteria.debitAccount?.accountNumber,
      approvedDateFrom: new DateFormatPipe(
        this.injector,
        this.locale,
      ).transform(criteria.approveDateFrom, 'yyyy-MM-dd'),
      approvedDateTo: new DateFormatPipe(this.injector, this.locale).transform(
        criteria.approveDateTo,
        'yyyy-MM-dd',
      ),
      batchName: criteria.batchName,
      beneficiaryBank: criteria.beneficiaryBank,
      beneficiaryOriginatorSelected:
        criteria.beneficiaryName == '' ? null : criteria.beneficiaryName,
      depositorOriginatorSelected:
        criteria.depositorName == '' ? null : criteria.depositorName,
      letterNumber: criteria.letterNumber,
      letterPeriodFrom: this.hijriDate.formatToRrequest(criteria.letterDateFrom),
      letterPeriodTo: this.hijriDate.formatToRrequest(criteria.letterDateTo),
      letterValueDate: this.hijriDate.formatToRrequest(criteria.letterDate),
      totalAmountFrom: criteria.totalAmountFrom ? +criteria.totalAmountFrom : null,
      totalAmountTo: criteria.totalAmountTo ? +criteria.totalAmountTo : null,
      userApproved: criteria.approvedBy?.key,
    }
    return this.doPost(this.servicesUrl + '/governmentRevenue/file/process/list', params)
  }

  protected getOutputFromRequestedData(_body) {
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
    return this.translate.instant('governmentRevenue.processed_operation')
  }

  public showExportButtons() {
    return true
  }
}
