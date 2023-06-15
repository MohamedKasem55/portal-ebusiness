import { DatePipe } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Observable, of } from 'rxjs'
import { ConfigResourceService } from '../../../../../../core/config/config.resource.local'
import { DateFormatPipe } from '../../../../../Components/common/Pipes/date-format-pipe'
import { AbstractListDynamicService } from "../../../../Common/Services/Abstract/abstract-list-dynamic.service";
import { DomSanitizer } from "@angular/platform-browser";
import { FormGroup, Validators } from '@angular/forms'
import { catchError, map } from 'rxjs/operators'
import { PagedData } from 'app/Application/Model/paged-data'
import { Page } from 'app/Application/Model/page'
import { StatusPipe } from '../../../../../Components/common/Pipes/status-pipe'
import { ModelPipe } from 'app/Application/Components/common/Pipes/model-pipe'
import { isDate } from 'ngx-bootstrap/chronos'
import { IgnoreGMTPipe } from 'app/Application/Components/common/Pipes/ignore-gmt.pipe'
import { AmountCurrencyPipe } from 'app/Application/Components/common/Pipes/amount-currency.pipe'


@Injectable()
export class MoiProcessedTransactionsService extends AbstractListDynamicService {



    combosData: any = {}

    constructor(
        protected translate: TranslateService,
        protected dateService: DatePipe,
        public statusPipe: StatusPipe,
        protected http: HttpClient,
        public config: ConfigResourceService,
        private injector: Injector,
        @Inject(LOCALE_ID) private locale: string,
        public sanitizer: DomSanitizer,
        public modelPipe: ModelPipe
    ) {
        super(translate, http, config)
        new ModelPipe(this.injector).transform('errors', null)
        new DateFormatPipe(this.injector, this.locale).transform(new Date, 'dd/MM/yyyy',)

        //new ModelPipe(this.injector).transform('errors', 'errorTable.' + row.beStatus)
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
            key: 'serviceType',
            title: 'moiPayments.payments.serviceType',
            translate: 'moiPayments.payments.serviceType',
            type: 'select',
            required: false,
            default: '',
            validators: [],
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_event_on_change: ($event, field, combosData, formModel) => { this.resetSearchForm(formModel) },
            widget_container_init_row: true,
            widget_container_end_row: false,
            select_combo_key: 'eGovSadadType',
        })
        //"'eGovApplicationTypeAll' | modelPipe: row.applicationType"
        _fieldsConfigForSearchForm.push({
            key: 'applicationType',           /* cambiar key*/
            title: 'moiPayments.payments.applicationType',
            translate: 'moiPayments.payments.subServiceType',
            type: 'select',
            required: false,
            default: '',
            validators: [],
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-4',
            widget_event_on_change: ($event, field, combosData, formModel) => { this.resetSearchForm(formModel) },
            widget_container_init_row: false,
            widget_container_end_row: false,
            select_combo_key: 'applicationsTypes',      /*  cambiar key*/
            select_dependent: true,
            select_parent: 'serviceType',
            select_combo_key_by_parent_value: {
                '': 'eGovApplicationTypeAll', // All
                '095': 'eGovLaborImportationApp', //"VisaService",
                '092': 'eGovSaudiPassportsApp', //"SaudiPassport",
                '091': 'eGovDrivingLicenseApp', //"DrivingLicense",
                '096': 'eGovCivilRegistrationApp', //"CivilRegistration",
                '158': 'eGovCivilDefenseViolationsApp', //"CivilDefenseViolations",
                '090': 'eGovAlienControlApp', //"AlienControl",
                '094': 'eGovMotorVehiclesApp', //"MotorVehicles",
                '093': 'eGovTrafficViolationsApp', //"TrafficViolations"
                '126': 'eGovNationalViolationsApp', //"TrafficViolations"
            },
        })


        _fieldsConfigForSearchForm.push({
            key: 'account',
            title: 'account',
            translate: 'processedFile.accnum',
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
            key: 'idNumber',
            title: 'idNumber',
            translate: 'idNumber',
            type: 'text',
            required: false,
            default: '',
            validators: [],
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-2',
            widget_container_init_row: false,
            widget_container_end_row: true,
        })

        _fieldsConfigForSearchForm.push({
            key: 'PaidAmountFrom',
            title: 'PaidAmountFrom',
            translate: 'payment-amount-From',
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
            translate: 'payment-amount-To',
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
            key: 'initiatedDateFrom',
            title: 'initiatedDateFrom',
            translate: 'processedFile.initiated_from',
            type: 'date',
            required: false,
            default: '',
            validators: [],
            widget: 'datepicker',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_datepicker_min_date: false,
            widget_datepicker_max_date: 'initiatedDateTo',
            widget_container_init_row: false,
            widget_container_end_row: false,
            widget_event_on_change: ($event, field, combosData, formModel) => {
                const dateValue = formModel.controls[field['key']].value
                const dateFrom = formModel.controls['initiatedDateFrom'] ? formModel.controls['initiatedDateFrom'].value : null
                const dateTo = formModel.controls['initiatedDateTo'] ? formModel.controls['initiatedDateTo'].value : null
                if (isDate(dateFrom) && isDate(dateTo)) {
                    dateFrom.setHours(0, 0, 0, 0)
                    dateTo.setHours(0, 0, 0, 0)
                    if (dateTo < dateFrom) {
                        formModel.controls['initiatedDateFrom'].setValue(dateValue);
                        formModel.controls['initiatedDateTo'].setValue(dateValue);
                        formModel.controls['initiatedDateFrom'].updateValueAndValidity();
                        formModel.controls['initiatedDateTo'].updateValueAndValidity();
                    }
                }
            },
        })

        _fieldsConfigForSearchForm.push({
            key: 'initiatedDateTo',
            title: 'initiatedDateTo',
            translate: 'processedFile.initiated_to',
            type: 'date',
            required: false,
            default: '',
            validators: [],
            widget: 'datepicker',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_datepicker_min_date: 'initiatedDateFrom',
            widget_datepicker_max_date: true,
            widget_container_init_row: false,
            widget_container_end_row: false,
            widget_event_on_change: ($event, field, combosData, formModel) => {
                const dateValue = formModel.controls[field['key']].value
                const dateFrom = formModel.controls['initiatedDateFrom'] ? formModel.controls['initiatedDateFrom'].value : null
                const dateTo = formModel.controls['initiatedDateTo'] ? formModel.controls['initiatedDateTo'].value : null
                if (isDate(dateFrom) && isDate(dateTo)) {
                    dateFrom.setHours(0, 0, 0, 0)
                    dateTo.setHours(0, 0, 0, 0)
                    if (dateTo < dateFrom) {
                        formModel.controls['initiatedDateFrom'].setValue(dateValue);
                        formModel.controls['initiatedDateTo'].setValue(dateValue);
                        formModel.controls['initiatedDateFrom'].updateValueAndValidity();
                        formModel.controls['initiatedDateTo'].updateValueAndValidity();
                    }
                }
            },
        })

        _fieldsConfigForSearchForm.push({
            key: 'executedDateFrom',
            title: 'executedDateFrom',
            translate: 'processedFile.executedDateFrom',
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
            translate: 'processedFile.executedDateTo',
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
            translate: 'processedFile.initiated_by',
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

        _fieldsConfigForSearchForm.push({
            key: 'approvedBy',
            title: 'approvedBy',
            translate: 'processedFile.approved_by',
            type: 'select',
            required: false,
            default: '',
            validators: [],
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-2',
            widget_container_init_row: true,
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
                key: 'transactionType',
                propName: 'transactionType',
                propValue: (row, service, combosData) => this.modelPipe.transform('eGovProcess', row.transactionType),
                transformFn: (actualValue, actualDataKey, row, injector, _locale) => this.modelPipe.transform('eGovProcess', row.transactionType),
                translate: 'payments.option',
                link_to_detail: false,
                parent_div_class: 'col-xs-6',
                export: true,
                //export_column_width: 40,
                exportKey: 'transactionTypeExport',
            },
            {
                key: 'serviceType',
                propName: 'serviceType',
                propValue: (row, service, combosData) => this.modelPipe.transform('eGovSadadType', row.serviceType),
                transformFn: (actualValue, actualDataKey, row, injector, _locale) => this.modelPipe.transform('eGovSadadType', row.serviceType),
                translate: 'payments.moiPayments.payments.serviceType',
                link_to_detail: false,
                parent_div_class: 'col-xs-6',
                export: true,
                //export_column_width: 80,
                exportKey: 'serviceTypeExport',
            },
            {
                key: 'applicationType',
                propName: 'applicationType',
                propValue: (row, service, combosData) => this.modelPipe.transform('eGovApplicationTypeAll', row.applicationType),
                transformFn: (actualValue, actualDataKey, row, injector, _locale) => this.modelPipe.transform('eGovApplicationTypeAll', row.applicationType),
                translate: 'payments.moiPayments.payments.subServiceType',
                link_to_detail: false,
                parent_div_class: 'col-xs-6',
                export: true,
                //column_width: 80,
                //export_column_width: 100,
            },
            {
                key: 'paymentId',
                propName: 'paymentId',
                propValue: (row, service, combosData) => row.paymentId,
                translate: 'payments.idNumber',
                link_to_detail: true,
                parent_div_class: 'col-xs-6',
                export: true,
                //export_column_width: 100,
            },
            {
                key: 'beneficiaryName',
                propName: 'beneficiaryName',
                propValue: (row, service, combosData) => row.beneficiaryName,
                translate: 'payments.moiPayments.beneficiaryName',
                link_to_detail: false,
                parent_div_class: 'col-xs-6',
                export: true,
                //column_width: 120,
                //export_column_width: 100,
            },
            {
                key: 'accountNumber',
                propName: 'accountNumber',
                propValue: (row, service, combosData) => row.accountNumber,
                translate: 'payments.processedFile.accnum',
                link_to_detail: false,
                parent_div_class: 'col-xs-6',
                export: true,
                //export_column_width: 100,
                column_width: 220,
                append_next_column: true,
            },
            {
                key: 'nickName',
                propName: 'nickName',
                propValue: (row, service, combosData) => row.accountAlias,
                transformFn: (actualValue, actualDataKey, row, injector, _locale) => row.accountAlias,
                translate: 'payments.nick-name',
                link_to_detail: false,
                exportKey: 'nickNameExport',
                parent_div_class: 'col-xs-6',
                export: true,
                column_width: 220,
                //export_column_width: 100,
            },
            {
                key: 'amount',
                propName: 'amount',
                propValue: (row, service, combosData) => new AmountCurrencyPipe(this.injector, this.locale).transform(
                    row.amount ? row.amount : 0,
                    null,
                ),
                translate: 'payments.amount',
                link_to_detail: false,
                parent_div_class: 'col-xs-6',
                export: true,
                //column_width: 80,
                //export_column_width: 100,
            },

            {
                key: 'status',
                propName: 'status',
                propValue: (row, service, combosData) => { //this.getTranslateStatus(row)},
                    if (row.beStatus != null) {
                        return new ModelPipe(this.injector).transform('errors', 'errorTable.' + row.beStatus)
                    }
                    else {
                        return this.injector.get(TranslateService).instant('invoiceHUB.sentTobank')
                    }
                }, //TODO get comissionString
                translate: 'payments.status',
                link_to_detail: false,
                parent_div_class: 'col-xs-6',
                export: true,
                exportKey: 'statusProcessedTransaction',
                //export_column_width: 170,
                //column_width: 110,
            },
            {
                key: 'initiatedBy',
                propName: 'initiatedBy',
                propValue: (row, service, combosData) => row.securityLevelsDTOList[0]?.updater, //valor que se debe mostrar en la carga
                transformFn: (actualValue, actualDataKey, row, injector, _locale) => row.securityLevelsDTOList[0]?.updater, //actualValue, actualDataKey - Nombre campo, si funciona la funciona no es necesario el exportKey
                translate: 'payments.processedFile.initiated_by',
                link_to_detail: false,
                parent_div_class: 'col-xs-6',
                export: true,
                exportKey: 'initiatedByExport', //esto provoca el calculo en tiempo real en la carga, si el valor se obtiene posteriormente no saldra
                //export_column_width: 100,
                //column_width: 120,
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
                transformFn: (actualValue, actualDataKey, row, injector, _locale) => {
                    return new DateFormatPipe(this.injector, this.locale).transform(
                        row.initiationDate,
                        // 'dd/MM/yyyy HH:mm:ss',
                        'dd/MM/yyyy',

                    )
                },
                translate: 'payments.processedFile.initiated_date',
                link_to_detail: false,
                parent_div_class: 'col-xs-6',
                export: true,
                exportKey: 'initiationDateExport',
                //export_column_width: 80,
                column_width: 130,
            },
            {
                key: 'executedBy',
                propName: 'executedBy',
                propValue: (row, service, combosData) => row.securityLevelsDTOList[row.securityLevelsDTOList.length - 1]?.updater,
                transformFn: (actualValue, actualDataKey, row, injector, _locale) => row.securityLevelsDTOList[row.securityLevelsDTOList.length - 1]?.updater,
                translate: 'payments.processedFile.executedBy',
                link_to_detail: false,
                parent_div_class: 'col-xs-6',
                export: true,
                //export_column_width: 80,
                exportKey: 'executedByExport',
                //column_width: 200,
                append_next_column: true,
            },
            {
                key: 'executedDate',
                propName: 'executedDate',
                propValue: (row, service, combosData) => {
                    return new DateFormatPipe(this.injector, this.locale).transform(
                        row.securityLevelsDTOList[row.securityLevelsDTOList.length - 1]?.updateDate,
                        // 'dd/MM/yyyy HH:mm:ss',
                        'dd/MM/yyyy',

                    )
                },
                transformFn: (actualValue, actualDataKey, row, injector, _locale) => {
                    return new DateFormatPipe(this.injector, this.locale).transform(
                        row.securityLevelsDTOList[row.securityLevelsDTOList.length - 1]?.updateDate,
                        // 'dd/MM/yyyy HH:mm:ss',
                        'dd/MM/yyyy',

                    )
                },
                translate: 'payments.processedFile.executedDate',
                link_to_detail: false,
                parent_div_class: 'col-xs-6',
                export: true,
                exportKey: 'executedDateExport',
                //export_column_width: 90,
                //column_width: 200,
            },
        ]

        return _fieldsConfigForList
    }

    //----------------------------------------------------------------------

    public isSelectItemsAllowed(): boolean {
        return false
    }

    protected createDataRequest(
        criteria: any,
        order: string,
        orderType: string,
        page: number,
        rows: number,
    ): Observable<any> {
        const params = { //Revisar criteria.search params
            search: criteria.search ? true : false,
            serviceType: criteria.serviceType ? criteria.serviceType : null, //???
            applicationType: criteria.applicationType ? criteria.applicationType : null,
            accountNumber: criteria.account ? criteria.account : null,
            idNumber: criteria.idNumber ? criteria.idNumber : null,
            amountFrom: criteria.PaidAmountFrom ? +criteria.PaidAmountFrom : null,
            amountTo: criteria.PaidAmountTo ? +criteria.PaidAmountTo : null,
            initiatedDateFrom: criteria.initiatedDateFrom ? new IgnoreGMTPipe().transform(
                criteria.initiatedDateFrom
            ) : null,

            initiatedDateTo: criteria.initiatedDateTo ? new IgnoreGMTPipe().transform(
                criteria.initiatedDateTo
            ) : null,
            executedDateFrom: criteria.executedDateFrom ? new IgnoreGMTPipe().transform(
                criteria.executedDateFrom
            ) : null,
            executedDateTo: criteria.executedDateTo ? new IgnoreGMTPipe().transform(
                criteria.executedDateTo
            ) : null,
            initiatedBy: criteria.initiatedBy ? criteria.initiatedBy : null,
            approvedBy: criteria.approvedBy ? criteria.approvedBy : null,
            transactionType: null,
            labelIdNumber: null,
            page: page,
            rows: rows,
            status: criteria.status ? criteria.status : null
        }
        return this.http.post(
            this.servicesUrl + '/moiPayment/processedTransaction/list',
            params,
        )
    }

    protected getOutputFromRequestedData(_body) {
        return {
            data: {
                items: _body.items,
                size: _body.size,
                total: _body.total,
            },
            size: _body.size,
            total: _body.total,
        }
    }

    public getExportHeader() {
        return this.translate.instant('payments.processedPayments')
    }

    showExportButtons() {
        return true
    }

    getTrustedHtml(str) {
        return this.sanitizer.bypassSecurityTrustHtml(str);
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

    public getAccountsComboData(): Observable<any> {
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
    ): Observable<PagedData<any>> {
        return this.createDataRequest(criteria, order, orderType, page, rows).pipe(
            map((response: any) => {
                const _body = response.requestStatusEgovSPList;
                if (response.errorCode != 0) {
                    return null;
                } else {
                    const output = this.postProcessOutputFromRequestedData(
                        this.getOutputFromRequestedData(_body)
                    );
                    // const output = response.processedTransactionList;
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

    protected createAccountsDTORequest(values: any): Observable<any> {
        const data: any = {}
        return this.http.get(this.servicesUrl + '/accounts/nicknameList', { params: data })
    }

    public accountsDTO(values: any = {}): Observable<any> {
        return this.createAccountsDTORequest(values).pipe(
            map((response: any) => {
                return response
            }),
            catchError(this.handleError),
        )
    }

    public resetSearchForm(searchForm: FormGroup) {
        searchForm.get('account').setValue(null)
    }
    public getTranslatePrefix() {
        return 'payments';
    }

    // getTranslateStatus(row: any ): string{
    //     if (row.beStatus) {
    //         return new ModelPipe(this.injector).transform('errors', 'errorTable.' + row.beStatus)
    //     }else {
    //          return ''
    //     }

    // }

}
