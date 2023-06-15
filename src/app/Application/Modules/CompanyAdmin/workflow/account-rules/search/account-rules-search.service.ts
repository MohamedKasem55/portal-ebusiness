import { Currency } from './../../../../../Model/currency';
import { DatePipe } from "@angular/common"
import { HttpClient } from "@angular/common/http"
import { Inject, Injectable, Injector, LOCALE_ID } from "@angular/core"
import { TranslateService } from "@ngx-translate/core"
import { DateFormatPipe } from "app/Application/Components/common/Pipes/date-format-pipe"
import { AbstractListDynamicService } from "app/Application/Modules/Common/Services/Abstract/abstract-list-dynamic.service"
import { ConfigResourceService } from "app/core/config/config.resource.local"
import { Observable } from "rxjs"

@Injectable()
export class AccountRulesSearchService extends AbstractListDynamicService {
    combosData: any = {}
    accountSelected: any = {}
    constructor(protected translate: TranslateService,
        protected dateService: DatePipe,
        protected http: HttpClient,
        public config: ConfigResourceService,
        private injector: Injector,
        @Inject(LOCALE_ID) private locale: string,) {
        super(translate, http, config)
    }

    protected createDataRequest(
        criteria: any,
        order: string,
        orderType: string,
        page: number,
        rows: number,
    ): Observable<any> {
        const params = {
            search: (criteria.accountNumber || criteria.branch || criteria.currency || criteria.nickName || criteria.searchByPrivilege || criteria.status) ? true : false,
            currency: !this.isEmpty(criteria.currency)
                ? criteria.currency
                : null,
            accountNumber: !this.isEmpty(criteria.accountNumber)
                ? criteria.accountNumber
                : null,
            accountNickname: !this.isEmpty(criteria.nickName)
                ? criteria.nickName
                : null,
            searchByPrivilege: criteria.searchByPrivilege ? criteria.searchByPrivilege : false,
            privilege: criteria.privilegeId ? criteria.privilegeId : null,
            serviceActive: criteria.privilegeActive ? criteria.privilegeActive : false,
            status: !this.isEmpty(criteria.status) ? criteria.status : null,
            branchid: !this.isEmpty(criteria.branch) ? criteria.branch : null,
        }
        return this.http.post(
            this.servicesUrl + '/workflow/accounts', params
        )
    }
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
            key: 'accountNumber',
            title: 'accountNumber',
            translate: 'accountNumber',
            type: 'select',
            required: false,
            default: '',
            validators: [],
            widget: 'text',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: true,
            widget_container_end_row: false,
            select_combo_key: 'accountsList',
        })

        _fieldsConfigForSearchForm.push({
            key: 'nickName',
            title: 'nickName',
            translate: 'nickName',
            type: 'text',
            required: false,
            default: '',
            validators: [],
            maxlength: 70,
            widget: 'text',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
        });
        _fieldsConfigForSearchForm.push({
            key: 'currency',
            title: 'currency',
            translate: 'currency',
            type: 'select',
            required: false,
            default: '',
            validators: [],
            select_combo_key: 'currency', // currencyIso
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
        }),
            _fieldsConfigForSearchForm.push({
                key: 'branch',
                title: 'branch',
                translate: 'branch',
                type: 'select',
                required: false,
                default: null,
                validators: [],
                select_combo_key: 'branchRbs5',
                widget: '',
                widget_container_class: 'col-xs-12 col-sm-3',
                widget_container_init_row: false,
                widget_container_end_row: true,
            })

        _fieldsConfigForSearchForm.push({
            key: 'searchByPrivilege',
            title: 'searchByPrivilege',
            translate: false,
            type: 'checkbox',
            class: "sme-checkbox checkbox-inline",
            required: false,
            default: '',
            validators: [],
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: true,
            widget_container_end_row: false,
            translate_inline: 'searchByPrivilege',
            mask_fields_to_show: {
                '': [],
                false: [],
                true: ['privilegeId', 'privilegeActive'],
            },
            widget_event_on_change: ($event, field, combosData, formModel) => {
                formModel.get('privilegeActive').setValue(formModel.get('searchByPrivilege').value)
                console.warn(formModel);
            },
        })

        _fieldsConfigForSearchForm.push({
            key: 'privilegeId',
            title: 'privilegeId',
            translate: 'privilegeId',
            multiple: true,
            type: 'select',
            required: true,
            default: '',
            validators: [],
            select_combo_key: 'privilegesList',
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
        })

        _fieldsConfigForSearchForm.push({
            key: 'privilegeActive',
            title: 'privilegeActive',
            translate: 'privilegeActive',
            type: 'checkbox',
            required: false,
            default: true,
            validators: [],
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
        })

        _fieldsConfigForSearchForm.push({
            key: 'status',
            title: 'status',
            translate: 'requestStatus.status',
            type: 'select',
            required: false,
            default: '',
            validators: [],
            select_combo_key: 'WorkflowAccountStatus',
            widget: 'select',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
        })


        return _fieldsConfigForSearchForm
    }
    public getFieldsConfigForList(): any[] {
        const _fieldsConfigForList: any[] = [

            {
                key: 'fullAccountNumber',
                propName: 'fullAccountNumber',
                propValue: (row, service, combosData) => {
                    row.fullAccountNumber = row.account.fullAccountNumber
                    return row.fullAccountNumber
                },
                translate: 'workflow.accountNumber',
                link_to_detail: true,
                parent_div_class: 'col-xs-6',
                export: true,
                column_width: 240,
                width: 130,
            },
            {
                key: 'alias',
                propName: 'alias',
                propValue: (row, service, combosData) => {
                    row.alias = row.account.alias;
                    return row.alias
                },
                translate: 'workflow.nickName',
                link_to_detail: false,
                parent_div_class: 'col-xs-6',
                export: true,
                column_width: 270,
                width: 200,
            },

            {
                key: 'currencyAccount',
                propName: 'currencyAccount',
                propValue: (row, service, combosData) => {
                    const list = combosData['currency']
                        ? combosData['currency']
                        : []
                    let elem = null
                    elem = list.find((item) => item.key == row.account.currency)
                    if (elem != null) {
                        row.currencyAccount = elem.value;
                        return elem.value
                    }
                    row.currencyAccount = row.account.currency;
                    return row.currencyAccount
                },
                translate: 'workflow.currency',
                link_to_detail: false,
                parent_div_class: 'col-xs-6',
                export: true,
                column_width: 200,
                width: 100,
            },
            {
                key: 'branchId',
                propName: 'branchId',
                propValue: (row, service, combosData) => {
                    const list = combosData['branchRbs5']
                        ? combosData['branchRbs5']
                        : []
                    let elem = null
                    elem = list.find((item) => item.key == row.account.branchid)
                    if (elem != null) {
                        row.branchId = elem.value
                        return elem.value
                    }
                    row.branchId = row.account.branchid;
                    return row.branchid
                },
                translate: 'workflow.branch',
                link_to_detail: false,
                parent_div_class: 'col-xs-6',
                export: true,
                column_width: 280,
                width: 100,
            },

            {
                key: 'statusAccount',
                propName: 'statusAccount',
                propValue: (row, service, combosData) => {
                    const list = combosData['WorkflowAccountStatus']
                        ? combosData['WorkflowAccountStatus']
                        : []
                    let elem = null
                    elem = list.find((item) => item.key == row.status)
                    if (elem != null) {
                        row.statusAccount = elem.value;
                        return elem.value
                    }
                    row.statusAccount = row.status
                    return row.statusAccount
                },
                translate: 'workflow.requestStatus.status',
                link_to_detail: false,
                parent_div_class: 'col-xs-6',
                export: true,
                column_width: 130,
                width: 100,
            },
            {
                key: 'userUpdate',
                propName: 'userUpdate',
                propValue: (row, service, combosData) => row.userUpdate,
                translate: 'workflow.lastActionBy',
                link_to_detail: false,
                parent_div_class: 'col-xs-6',
                export: true,
                column_width: 170,
                width: 100,
            },
            {
                key: 'dateUpdate',
                propName: 'dateUpdate',
                propValue: (row, service, combosData) => new DateFormatPipe(this.injector, this.locale).transform(
                    row.dateUpdate,
                    'dd/MM/yyyy',
                    // 'dd/MM/yyyy HH:mm:ss',
                ),

                translate: 'workflow.lastActionDate',
                link_to_detail: false,
                parent_div_class: 'col-xs-6',
                export: true,
                column_width: 180,
                width: 100,
            }
        ]
        return _fieldsConfigForList
    }
    // protected getOutputFromRequestedData(_body) {return null}
    protected getOutputFromRequestedData(_body) {
        return {
            data: {
                items: _body?.accountList,
                size: _body?.accountList.length,
                total: _body?.accountList.length,
            },
            // size: 0,
            // total: _body.accountList.length,
        }
    }
    public getExportHeader() {
        return this.translate.instant('workflow')
    }

    public showExportButtons() {
        return true
    }

    public isSelectItemsAllowed(): boolean {
        return true
    }

    public branches(): Observable<any> {
        return this.http.get(this.servicesUrl + '/letterGuarantee/branches')
    }

    public privileges(): Observable<any> {
        return this.http.get(this.servicesUrl + '/workflow/accounts/privilege')
    }

    public setAccountSelected(accountSelected: any) {
        this.accountSelected = accountSelected;
    }
    public getAccountSelected(): any {
        return this.accountSelected;
    }

}