import { DatePipe } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Observable } from 'rxjs'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { DateFormatPipe } from '../../../../Components/common/Pipes/date-format-pipe'
import { AbstractListDynamicService } from "../../../Common/Services/Abstract/abstract-list-dynamic.service";
import { DomSanitizer } from "@angular/platform-browser";
import { catchError, map } from 'rxjs/operators'
import { PagedData } from 'app/Application/Model/paged-data'
import { Page } from 'app/Application/Model/page'
import { StatusPipe } from '../../../../Components/common/Pipes/status-pipe'
import { ProcessedTransactionList, ResponseProcessedTransactionList } from './processed-transactions.model'
import { ModelPipe } from 'app/Application/Components/common/Pipes/model-pipe'
import { isDate } from 'ngx-bootstrap/chronos'
import { IgnoreGMTPipe } from 'app/Application/Components/common/Pipes/ignore-gmt.pipe'
import { AmountCurrencyPipe } from 'app/Application/Components/common/Pipes/amount-currency.pipe'

@Injectable()
export class ProcessedTransactionsListService extends AbstractListDynamicService {

    combosData: any = {}

    constructor(
        protected translate: TranslateService,
        protected dateService: DatePipe,
        public statusPipe: StatusPipe,
        protected http: HttpClient,
        public config: ConfigResourceService,
        private injector: Injector,
        @Inject(LOCALE_ID) private locale: string,
        public sanitizer: DomSanitizer
    ) {
        super(translate, http, config)
        new ModelPipe(this.injector).transform('errors', null)
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
            key: 'invoiceNumber',
            title: 'invoiceNumber',
            translate: 'invoiceNumber',
            type: 'text',
            required: false,
            default: '',
            validators: [],
            widget: '',
            widget_container_init_row: true,
            widget_container_end_row: false,
            widget_container_class: 'col-xs-12 col-sm-3',
        })

        _fieldsConfigForSearchForm.push({
            key: 'supplierId',
            title: 'supplierId',
            translate: 'supplierId',
            type: 'text',
            required: false,
            default: '',
            validators: [],
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
        })
        _fieldsConfigForSearchForm.push({
            key: 'supplierName',
            title: 'supplierName',
            translate: 'supplierName',
            type: 'text',
            required: false,
            default: '',
            validators: [],
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
        })

        _fieldsConfigForSearchForm.push({
            key: 'buyerName',
            title: 'buyerName',
            translate: 'buyerName',
            type: 'text',
            required: false,
            default: '',
            validators: [],
            maxlength: 70,
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
        });

        _fieldsConfigForSearchForm.push({
            key: 'PaidAmountFrom',
            title: 'PaidAmountFrom',
            translate: 'payAmountFrom',
            type: 'text',
            required: false,
            default: '',
            validators: [],
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
            fieldLimitMax: 'payAmountTo',
            inputPattern: 'onlyDigits',
            maxlength: 15,
        })


        _fieldsConfigForSearchForm.push({
            key: 'PaidAmountTo',
            title: 'PaidAmountTo',
            translate: 'payAmountTo',
            type: 'text',
            required: false,
            default: '',
            validators: [],
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
            fieldLimitMax: 'payAmountFrom',
            inputPattern: 'onlyDigits',
            maxlength: 15,
        })

        _fieldsConfigForSearchForm.push({
            key: 'accountNumber',
            title: 'accountNumber',
            translate: 'accountNumber',
            type: 'select',
            required: false,
            default: '',
            validators: [],
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
            select_combo_key: 'account',
        })

        _fieldsConfigForSearchForm.push({
            key: 'status',
            title: 'status',
            translate: 'status',
            type: 'select',
            required: false,
            default: '',
            validators: [],
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
            select_combo_key: 'processTransactionStatus',
        })

        _fieldsConfigForSearchForm.push({
            key: 'initiatedFrom',
            title: 'initiatedFrom',
            translate: 'initiated_from',
            type: 'date',
            required: false,
            default: null,
            validators: [],
            widget: 'datepicker',
            widget_datepicker_min_date: false,
            widget_datepicker_max_date: 'initiatedTo',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
            widget_event_on_change: ($event, field, combosData, formModel) => {
                const dateValue = formModel.controls[field['key']].value
                const dateFrom = formModel.controls['initiatedFrom'] ? formModel.controls['initiatedFrom'].value : null
                const dateTo = formModel.controls['initiatedTo'] ? formModel.controls['initiatedTo'].value : null
                if (isDate(dateFrom) && isDate(dateTo)) {
                    dateFrom.setHours(0, 0, 0, 0)
                    dateTo.setHours(0, 0, 0, 0)
                    if (dateTo < dateFrom) {
                        formModel.controls['initiatedFrom'].setValue(dateValue);
                        formModel.controls['initiatedTo'].setValue(dateValue);
                        formModel.controls['initiatedFrom'].updateValueAndValidity();
                        formModel.controls['initiatedTo'].updateValueAndValidity();
                    }
                }
            },
        })

        _fieldsConfigForSearchForm.push({
            key: 'initiatedTo',
            title: 'initiatedTo',
            translate: 'initiated_to',
            type: 'date',
            required: false,
            default: null,
            validators: [],
            widget: 'datepicker',
            widget_datepicker_min_date: 'initiatedFrom',
            widget_datepicker_max_date: true,
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
            widget_event_on_change: ($event, field, combosData, formModel) => {
                const dateValue = formModel.controls[field['key']].value
                const dateFrom = formModel.controls['initiatedFrom'] ? formModel.controls['initiatedFrom'].value : null
                const dateTo = formModel.controls['initiatedTo'] ? formModel.controls['initiatedTo'].value : null
                if (isDate(dateFrom) && isDate(dateTo)) {
                    dateFrom.setHours(0, 0, 0, 0)
                    dateTo.setHours(0, 0, 0, 0)
                    if (dateTo < dateFrom) {
                        formModel.controls['initiatedFrom'].setValue(dateValue);
                        formModel.controls['initiatedTo'].setValue(dateValue);
                        formModel.controls['initiatedFrom'].updateValueAndValidity();
                        formModel.controls['initiatedTo'].updateValueAndValidity();
                    }
                }
            },
        })

        _fieldsConfigForSearchForm.push({
            key: 'executedDateFrom',
            title: 'executedDateFrom',
            translate: 'executedDateFrom',
            type: 'date',
            required: false,
            default: '',
            validators: [],
            widget: 'datepicker',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_datepicker_min_date: false,
            widget_datepicker_max_date: 'executedDateTo',
            widget_container_init_row: false,
            widget_container_end_row: false,
            widget_event_on_change: ($event, field, combosData, formModel) => {
                const dateValue = formModel.controls[field['key']].value
                const dateFrom = formModel.controls['executedDateFrom'] ? formModel.controls['executedDateFrom'].value : null
                const dateTo = formModel.controls['executedDateTo'] ? formModel.controls['executedDateTo'].value : null
                if (isDate(dateFrom) && isDate(dateTo)) {
                    dateFrom.setHours(0, 0, 0, 0)
                    dateTo.setHours(0, 0, 0, 0)
                    if (dateTo < dateFrom) {
                        formModel.controls['executedDateFrom'].setValue(dateValue);
                        formModel.controls['executedDateTo'].setValue(dateValue);
                        formModel.controls['executedDateFrom'].updateValueAndValidity();
                        formModel.controls['executedDateTo'].updateValueAndValidity();
                    }
                }
            },
        })

        _fieldsConfigForSearchForm.push({
            key: 'executedDateTo',
            title: 'executedDateTo',
            translate: 'executedDateTo',
            type: 'date',
            required: false,
            default: '',
            validators: [],
            widget: 'datepicker',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_datepicker_min_date: 'executedDateFrom',
            widget_datepicker_max_date: true,
            widget_container_init_row: false,
            widget_container_end_row: false,
            widget_event_on_change: ($event, field, combosData, formModel) => {
                const dateValue = formModel.controls[field['key']].value
                const dateFrom = formModel.controls['executedDateFrom'] ? formModel.controls['executedDateFrom'].value : null
                const dateTo = formModel.controls['executedDateTo'] ? formModel.controls['executedDateTo'].value : null
                if (isDate(dateFrom) && isDate(dateTo)) {
                    dateFrom.setHours(0, 0, 0, 0)
                    dateTo.setHours(0, 0, 0, 0)
                    if (dateTo < dateFrom) {
                        formModel.controls['executedDateFrom'].setValue(dateValue);
                        formModel.controls['executedDateTo'].setValue(dateValue);
                        formModel.controls['executedDateFrom'].updateValueAndValidity();
                        formModel.controls['executedDateTo'].updateValueAndValidity();
                    }
                }
            },
        })


        _fieldsConfigForSearchForm.push({
            key: 'initiatedBy',
            title: 'initiatedBy',
            translate: 'initiatedBy',
            type: 'select',
            required: false,
            default: '',
            validators: [],
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
            select_combo_key: 'user',
        })

        _fieldsConfigForSearchForm.push({
            key: 'approvedBy',
            title: 'approvedBy',
            translate: 'approved_by',
            type: 'select',
            required: false,
            default: '',
            validators: [],
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: true,
            select_combo_key: 'user',
        })
        return _fieldsConfigForSearchForm
    }

    /**
     * Returns list fields definitions for results
     */
    public getFieldsConfigForList(): any[] {
        const _fieldsConfigForList: any[] = [
            {
                key: 'invoiceId',
                propName: 'invoiceId',
                propValue: (row, service, combosData) => row.invoiceId,
                translate: 'invoiceHUB.invoiceNumber',
                link_to_detail: true,
                parent_div_class: 'col-xs-6',
                export: true,
                export_column_width: 100,
                column_width: 120,
            },
            {
                key: 'billerId',
                propName: 'billerId',
                propValue: (row, service, combosData) => row.billerId,
                translate: 'invoiceHUB.supplierId',
                link_to_detail: false,
                parent_div_class: 'col-xs-6',
                export: true,
                export_column_width: 50,
                column_width: 90,
            },
            {
                key: 'billerName',
                propName: 'billerName',
                propValue: (row, service, combosData) => row.billerName,
                translate: 'invoiceHUB.supplierName',
                link_to_detail: false,
                parent_div_class: 'col-xs-6',
                export: true,
                export_column_width: 150,
                column_width: 240,
            },
            {
                key: 'buyerName',
                propName: 'buyerName',
                propValue: (row, service, combosData) => row.buyerName,
                translate: 'invoiceHUB.buyerName',
                link_to_detail: false,
                parent_div_class: 'col-xs-6',
                export: true,
                export_column_width: 100,
                column_width: 180,
            },
            {
                key: 'accountNumber',
                propName: 'accountNumber',
                propValue: (row, service, combosData) => row.accountNumber,
                translate: 'invoiceHUB.accountNumber',
                link_to_detail: false,
                parent_div_class: 'col-xs-6',
                export: true,
                export_column_width: 140,
                column_width: 220,
                append_next_column: true,
            },
            {
                key: 'accountAlias',
                propName: 'accountAlias',
                propValue: (row, service, combosData) => row.accountAlias,
                translate: 'invoiceHUB.nickname',
                link_to_detail: false,
                parent_div_class: 'col-xs-6',
                export: true,
                export_column_width: 130,
                column_width: 240,

            },
            {
                key: 'amount',
                propName: 'amount',
                propValue: (row, service, combosData) => new AmountCurrencyPipe(this.injector, this.locale).transform(
                    row.amount,
                    null,
                ),
                translate: 'invoiceHUB.amount',
                link_to_detail: false,
                parent_div_class: 'col-xs-6',
                export: true,
                export_column_width: 70,
                column_width: 80,
            },
            {
                key: 'beStatus',
                propName: 'beStatus',
                propValue: (row, service, combosData) => {

                    if (row.beStatus != null) {
                        return new ModelPipe(this.injector).transform('errors', 'errorTable.' + row.beStatus)
                    }
                    else {
                        return this.injector.get(TranslateService).instant('invoiceHUB.sentTobank')
                    }
                }, //TODO get comissionString
                translate: 'invoiceHUB.status',
                link_to_detail: false,
                parent_div_class: 'col-xs-6',
                export: true,
                exportKey: 'statusProcessedTransaction',
                export_column_width: 150,
                column_width: 160,
            },
            {
                key: 'initiatedBy',
                propName: 'initiatedBy',
                propValue: (row, service, combosData) => row.pdfSecurityLevelsDTOList[0].updater,
                translate: 'invoiceHUB.initiatedBy',
                link_to_detail: false,
                parent_div_class: 'col-xs-6',
                export: true,
                exportKey: 'initiatedByExport',
                export_column_width: 80,
                column_width: 120,
                append_next_column: true,
            },
            {
                key: 'initiationDate',
                propName: 'initiationDate',
                propValue: (row, service, combosData) => {
                    return new DateFormatPipe(this.injector, this.locale).transform(
                        row.initiationDate,
                        // 'dd/MM/yyyy HH:mm:ss',
                        'dd/MM/yyyy',

                    )
                },
                translate: 'invoiceHUB.initiationDate',
                link_to_detail: false,
                parent_div_class: 'col-xs-6',
                export: true,
                exportKey: 'initiationDateExport',
                export_column_width: 120,
                column_width: 120,
            },
            {
                key: 'executedBy',
                propName: 'executedBy',
                propValue: (row, service, combosData) => row.securityLevelsDTOList[row.securityLevelsDTOList.length - 1].updater,
                translate: 'invoiceHUB.executedBy',
                link_to_detail: false,
                parent_div_class: 'col-xs-6',
                export: true,
                exportKey: 'executedByExport',
                export_column_width: 80,
                column_width: 200,
                append_next_column: true,
            },
            {
                key: 'executedDate',
                propName: 'executedDate',
                propValue: (row, service, combosData) => {
                    return new DateFormatPipe(this.injector, this.locale).transform(
                        row.securityLevelsDTOList[row.securityLevelsDTOList.length - 1].updateDate,
                        // 'dd/MM/yyyy HH:mm:ss',
                        'dd/MM/yyyy',

                    )
                },
                translate: 'invoiceHUB.executedDate',
                link_to_detail: false,
                parent_div_class: 'col-xs-6',
                export: true,
                exportKey: 'executedDateExport',
                export_column_width: 130,
                column_width: 200,
            }
        ]

        return _fieldsConfigForList
    }

    //----------------------------------------------------------------------

    public isSelectItemsAllowed(): boolean {
        return false
    }

    //----------------------------------------------------------------------

    public getInitValues(values: any): Observable<any> {
        const params = {
            search: true,
            page: 1,
            rows: 20
        }
        return this.http.post(this.servicesUrl + '/sadadInvoice/processedTransaction/list', params)
    }

    protected createDataRequest(
        criteria: any,
        order: string,
        orderType: string,
        page: number,
        rows: number,
    ): Observable<any> {
        const params = {
            page: page,
            rows: rows,
            search: criteria.search ? true : false,
            invoiceNumber: criteria.invoiceNumber ? criteria.invoiceNumber : null,
            supplierId: criteria.supplierId ? criteria.supplierId : null,
            status: criteria.status ? criteria.status : null,
            supplierName: criteria.supplierName ? criteria.supplierName : null,
            buyerName: criteria.buyerName ? criteria.buyerName : null,
            amountFrom: criteria.PaidAmountFrom ? +criteria.PaidAmountFrom : null,
            amountTo: criteria.PaidAmountTo ? +criteria.PaidAmountTo : null,
            accountNumber: criteria.accountNumber ? criteria.accountNumber : null,
            initiatedDateFrom: criteria.initiatedFrom ? new IgnoreGMTPipe().transform(
                criteria.initiatedFrom
            ) : null,

            initiatedDateTo: criteria.initiatedTo ? new IgnoreGMTPipe().transform(
                criteria.initiatedTo
            ) : null,
            executedDateFrom: criteria.executedDateFrom ? new IgnoreGMTPipe().transform(
                criteria.executedDateFrom
            ) : null,
            executedDateTo: criteria.executedDateTo ? new IgnoreGMTPipe().transform(
                criteria.executedDateTo
            ) : null,
            initiatedBy: criteria.initiatedBy ? criteria.initiatedBy : null,
            approvedBy: criteria.approvedBy ? criteria.approvedBy : null,
        }
        return this.http.post(
            this.servicesUrl + '/sadadInvoice/processedTransaction/list',
            params,
        )
    }

    protected getOutputFromRequestedData(_body) {
        return {
            // data: {
            //     items: _body.items,
            //     size: _body.items.length,
            //     total: _body.items.length,
            // },
            items: _body.items,
            size: _body.size,
            total: _body.total
        }
    }

    public getExportHeader() {
        return this.translate.instant('invoiceHUB.esalProcessedPayments')
    }

    showExportButtons() {
        return true

    }

    getTrustedHtml(str) {
        return this.sanitizer.bypassSecurityTrustHtml(str);
    }

    getBillers() {
        return this.http.get(this.servicesUrl + '/billPaymentService/management/getBillCodes')
    }

    public getUsersComboData(): Observable<any> {
        return this.http
            .get(this.servicesUrl + '/transfers/processedTransaction/search/users')
            .pipe(
                map((response: any) => {
                    return response
                }),
            )
    }

    public getAccountsComboData(): Observable<ResponseProcessedTransactionList> {
        const data = {
            order: '',
            orderType: '',
            page: 1,
            rows: 100,
            txType: 'ECIA',
        }
        return this.http.post(this.servicesUrl + '/accounts/combo', data).pipe(
            map((response: any) => {
                return response
            }),
        )
    }


    public getResults(
        criteria: any,
        order: string,
        orderType: string,
        page: number,
        rows: number,
    ): Observable<PagedData<ResponseProcessedTransactionList>> {
        return this.createDataRequest(criteria, order, orderType, page, rows).pipe(
            map((response: ResponseProcessedTransactionList) => {
                const _body: ProcessedTransactionList = response.processedTransactionList;
                if (response.errorCode != '0') {
                    return null;
                } else {
                    const output: ProcessedTransactionList = this.postProcessOutputFromRequestedData(
                        this.getOutputFromRequestedData(_body)
                    );
                    const pagedData = new PagedData<any>();
                    const pageObject = new Page();

                    pageObject.pageNumber = page;
                    pageObject.pageSize = rows;
                    pageObject.size = output.size;
                    pageObject.totalElements = output.total;
                    pageObject.totalPages = pageObject.totalElements / pageObject.pageSize;

                    pagedData.data = output['data'] ? output['data'] : output['items'];
                    pagedData.page = pageObject;

                    return pagedData;
                }
            }),
            catchError(this.handleError),
        );
    }

    protected postProcessOutputFromRequestedData(output) {
        const _fieldsConfigForList = this.getFieldsConfigForList();
        if (output.items && output.items.length >= 0) {
            _fieldsConfigForList.forEach((_fieldConfig) => {
                if (_fieldConfig.hasOwnProperty('export') &&
                    _fieldConfig.export === true && _fieldConfig.exportKey) {
                    output.items.forEach((item) => {
                        const exportDataKey = _fieldConfig.exportKey;
                        item[exportDataKey] = _fieldConfig.propValue(
                            item,
                            this,
                            this.combosData,
                        )
                    })
                }
            })
        }

        return output;
    }
    public getTranslatePrefix() {
        return 'invoiceHUB';
    }
}
