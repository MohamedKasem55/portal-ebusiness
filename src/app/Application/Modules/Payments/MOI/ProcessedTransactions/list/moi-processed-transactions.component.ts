import {
    Attribute,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { SearchablePanelComponent } from 'arb-design'
import { AbstractDatatableMobileComponent } from '../../../../Common/Components/Abstract/abstract-datatable-mobile.component'
import { StaticService } from '../../../../Common/Services/static.service'
import { AuthenticationService } from '../../../../../../core/security/authentication.service'
import { Page } from "../../../../../Model/page";
import { MoiProcessedTransactionsService } from './moi-processed-transactions.service'
import { MoiProcessedTransactionsDetailService } from '../details/moi-processed-transactions-detail.service'
import { MOI_PROCESSED_TRANSACTIONS_FORMS_FIELDS_CONFIGS } from '../moi-processed-transactions.form-fields-configs'

@Component({
    selector: 'app-moi-processed-transactions',
    templateUrl: './moi-processed-transactions.component.html',
})
export class MoiProcessedTransactionsComponent
    extends AbstractDatatableMobileComponent
    implements OnInit, OnDestroy {
    @ViewChild(SearchablePanelComponent)
    searchablePanel: SearchablePanelComponent

    combosKeys: any[] = ['eGovSadadType', 'processTransactionStatus']

    combosData: any = {}

    fieldsConfigForList: any[]

    fieldsConfigForSearchForm: any[]

    routes: any[] = [['dashboard.payments'], ['payments.moiPayments.menu', ['/payments/moi']], ['menu.sadad.government_payment.processed_Transactions']]

    MOI_PROCESSED_TRANSACTIONS_FORMS_FIELDS_CONFIGS: any = MOI_PROCESSED_TRANSACTIONS_FORMS_FIELDS_CONFIGS

    constructor(
        public fb: FormBuilder,
        public staticService: StaticService,
        public translate: TranslateService,
        public authenticationService: AuthenticationService,
        public router: Router,
        public detailsService: MoiProcessedTransactionsDetailService,
        public listService: MoiProcessedTransactionsService
    ) {
        super(fb, translate, authenticationService, router)

        this.order = 'serialNumber'
        this.orderType = 'asc'

        //this.combosData = { user: [], account: [] }

        this.combosData = {
            user: [],
            accounts: [],
            servicesTypes: [],
            applicationsTypes: [],
            applicationsTypesAllCombosKey: [],
        }

        this.fieldsConfigForList = []
        this.fieldsConfigForSearchForm = []
        //this.searchForm = this.fb.group({})
        this.searchForm = this.fb.group({
            page: 1,
            row: 20,
            search: true,
        })
    }

    ngOnInit() {
        super.ngOnInit()
    }

    show() {
        console.log("searchForm: ", this.searchForm)
    }

    refreshData() {

        this.subscriptions.push(
            this.staticService
                .getAllCombosAsArrays(this.combosKeys)
                .subscribe((resultC) => {
                    const data: any = resultC
                    // tslint:disable-next-line:prefer-for-of
                    for (let i = 0; i < this.combosKeys.length; i++) {
                        this.combosData[this.combosKeys[i]] = data[this.combosKeys[i]]
                    }
                    // -------------------------------------------------
                    this.fieldsConfigForList = this.listService.getFieldsConfigForList()
                    this.fieldsConfigForSearchForm = this.listService.getFieldsConfigForSearchForm()
                }),

        )
        this.getAplicationType();
        this.getUser(); //Recupera usuarios
        this.getAccountNumber(); //Recupera numeros de cuentas
        this.setPage(null);
    }

    public getServicesType() {
        this.subscriptions.push(
            this.staticService
                .getAllCombosAsArrays(this.combosKeys, true)
                .subscribe((resultC) => {
                    if (resultC === null) {
                        this.onError(resultC)
                    } else {
                        const data: any = resultC
                        for (let i = 0; i < this.combosKeys.length; i++) {
                            this.combosData[this.combosKeys[i]] = data[this.combosKeys[i]]
                        }
                        this.combosData['servicesTypes'] = this.combosData[
                            'eGovSadadType'
                        ]
                    }
                }),
        )
    }

    getExtraFormFieldsConfigs(values: any): any[] {
        let fieldsConfigs =
            values.serviceType &&
                values.applicationType &&
                this.MOI_PROCESSED_TRANSACTIONS_FORMS_FIELDS_CONFIGS[values.serviceType] &&
                this.MOI_PROCESSED_TRANSACTIONS_FORMS_FIELDS_CONFIGS[values.serviceType]
                    .applicationsTypes[values.applicationType]
                ? this.MOI_PROCESSED_TRANSACTIONS_FORMS_FIELDS_CONFIGS[values.serviceType]
                    .applicationsTypes[values.applicationType].fieldsConfigs
                : null

        if (!fieldsConfigs) {
            const servicesIDs = Object.keys(this.MOI_PROCESSED_TRANSACTIONS_FORMS_FIELDS_CONFIGS)
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < servicesIDs.length; i++) {
                const serviceDef = this.MOI_PROCESSED_TRANSACTIONS_FORMS_FIELDS_CONFIGS[
                    servicesIDs[i]
                ]
                const transactionsIDs = Object.keys(serviceDef.applicationsTypes)
                if (transactionsIDs.indexOf(values.applicationType) >= 0) {
                    fieldsConfigs =
                        serviceDef.applicationsTypes[values.applicationType].fieldsConfigs
                    break
                }
            }
        }
        return fieldsConfigs ? fieldsConfigs : []
    }

    getComboDataForApplicationsTypesBySelectedService(serviceType): any[] {
        const applicationsTypesAllCombosKey = this.getCombosDatasKeysForApplicationTypes()
        const applicationsTypesComboKey =
            serviceType && applicationsTypesAllCombosKey[serviceType]
                ? applicationsTypesAllCombosKey[serviceType]
                : null

        return applicationsTypesComboKey &&
            this.combosData[applicationsTypesComboKey]
            ? this.combosData[applicationsTypesComboKey]
            : []
    }

    public getAplicationType() {
        this.combosData[
            'applicationsTypesAllCombosKey'
        ] = this.getCombosDatasKeysForApplicationTypes()

        const combosKeys = ['eGovSadadType']
            .concat(this.getCombosDatasKeysForApplicationTypesAsArray())
            .concat(this.getSelectTypeFieldsCombosKeys())
            .concat(this.getOthersCombosKeysToBeLoaded())
            .filter((value, index, self) => {
                return self.indexOf(value) === index
            })
        //console.log("------ combosKeys: ",combosKeys)


    }


    public getUser() {
        this.combosData['user'] = [];
        this.subscriptions.push(this.listService.getUsersComboData().subscribe((result: any) => {
            if (result.errorCode != '0') {
                this.onError(result);
            } else {
                const user = []
                result.userIds?.forEach((element, i) => {
                    user.push({
                        key: element,
                        value: element
                    })
                });
                this.combosData = Object.assign({}, this.combosData, { user })
            }
        }));
    }
    public getAccountNumber() {
        this.combosData['account'] = [];
        this.subscriptions.push(this.listService.getAccountsComboData().subscribe((result: any) => {
            if (result.errorCode != '0') {
                this.onError(result);
            } else {
                const account = []
                result.accountComboList?.forEach((element, i) => {
                    account.push({
                        key: element.value,
                        value: element.value
                    })
                });
                this.combosData = Object.assign({}, this.combosData, { account })

            }
        }));
    }

    getList(searchElement, order, orderType, offset, pageSize) {
        this.subscriptions.push(
            this.listService
                .getResults(searchElement, order, orderType, offset, pageSize)
                .subscribe((result) => {
                    if (result === null) {
                        this.onError(result)
                    } else {
                        this.elementsPage = {
                            page: {
                                size: result.data['size'],
                                totalElements: result.page.totalElements,
                                totalPages: result.page.totalPages,
                                pageNumber: result.page.pageNumber,
                                pageSize: +result.page.pageSize,
                            },
                            data: result.data['items'],
                        }
                    }
                }),
        )
    }

    isDisabled() {
        return !(this.tableSelectedRows && this.tableSelectedRows.length > 0)
    }

    ngOnDestroy() {
        super.ngOnDestroy()
    }

    getIdFieldName() {
        return 'batchPk'
    }

    getId(row) {
        return row[this.getIdFieldName()]
    }

    reset() {
        this.searchForm.reset() //controls.status.reset();
        //this.elementsPage.data = []
        //this.elementsPage.page = new Page()
        this.search()
    }

    search(isSearching = true) {
        if (this.searchForm && this.searchForm.get('search')) {
            this.searchForm.get('search').setValue(isSearching)
        }
        super.search()
    }

    setPage(dataTableEvent) {
        if (dataTableEvent == null) {
            dataTableEvent = { offset: 0 }
        }
        this.elementsPage.page.pageNumber = dataTableEvent.offset
        this.searchFormData = Object.assign({}, this.searchForm.value)
        this.getList(
            this.searchFormData,
            this.order,
            this.orderType,
            dataTableEvent.offset + 1,
            this.elementsPage.page.pageSize,
        )
    }

    getExportColumns() {
        return this.listService.getExportColumns()
    }

    getExportHeader() {
        return this.listService.getExportHeader()
    }

    showExportButtons() {
        return this.listService.showExportButtons()
    }

    onClickRow(row: any, propName = null) {
        this.detailsService.setSelectedItem(row);
        this.router.navigate(['/payments/moi/processedTransactionsDetail'])
    }

    canExecuteAction(action) {
        switch (action) {
            case 'details':
                return this.authenticationService.activateOption(
                    null,
                    [],
                    [],
                )
            default:
                break
        }
        return false
    }

    onSearchFormAllFieldsCreated($event) {

    }


    /* LOAD COMBODARA FOR THE FORM */
    getCombosDatasKeysForApplicationTypesAsArray(): string[] {
        const applicationsTypesAllCombosKey = this.getCombosDatasKeysForApplicationTypes()

        const keys = Object.keys(applicationsTypesAllCombosKey)

        const list = []
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < keys.length; i++) {
            list.push(applicationsTypesAllCombosKey[keys[i]])
        }
        return list
    }

    getCombosDatasKeysForApplicationTypes(): any {
        const applicationsTypesAllCombosKey = {
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
        }
        return applicationsTypesAllCombosKey
    }

    getSelectTypeFieldsCombosKeys(): string[] {
        const combosKeys = {}
        const servicesTypes = Object.keys(this.MOI_PROCESSED_TRANSACTIONS_FORMS_FIELDS_CONFIGS)
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < servicesTypes.length; i++) {
            const applicationsTypes = Object.keys(
                this.MOI_PROCESSED_TRANSACTIONS_FORMS_FIELDS_CONFIGS[servicesTypes[i]]
                    .applicationsTypes,
            )
            // tslint:disable-next-line:prefer-for-of
            for (let j = 0; j < applicationsTypes.length; j++) {
                const fields = this.MOI_PROCESSED_TRANSACTIONS_FORMS_FIELDS_CONFIGS[servicesTypes[i]]
                    .applicationsTypes[applicationsTypes[j]].fieldsConfigs
                for (let k = 0; k < fields.length; k++) {
                    const field = this.MOI_PROCESSED_TRANSACTIONS_FORMS_FIELDS_CONFIGS[servicesTypes[i]]
                        .applicationsTypes[applicationsTypes[j]].fieldsConfigs[k]
                    if (
                        field['type'] == 'select' &&
                        field['select_combo_key'] != '' &&
                        !this.combosData[field['select_combo_key']]
                    ) {
                        combosKeys[field['select_combo_key']] = field['select_combo_key']
                    }
                }
            }
        }
        return Object.keys(combosKeys)
    }

    getOthersCombosKeysToBeLoaded(): string[] {
        return []
    }
}

