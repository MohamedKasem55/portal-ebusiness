import { Component, OnInit, ViewChild } from '@angular/core'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { AbstractDatatableMobileComponent } from 'app/Application/Modules/Common/Components/Abstract/abstract-datatable-mobile.component'
import { AuthenticationService } from 'app/core/security/authentication.service'
import { AccountRulesSearchService } from './account-rules-search.service'
import { StaticService } from 'app/Application/Modules/Common/Services/static.service'
import { ModelPipe } from 'app/Application/Components/common/Pipes/model-pipe';
import {AmountCurrencyPipe} from "../../../../../Components/common/Pipes/amount-currency.pipe";

@Component({
    selector: 'app-rules',
    templateUrl: './account-rules-search.component.html',
})
export class AccountRulesSearchComponent extends AbstractDatatableMobileComponent
    implements OnInit {

    step: number
    form: FormGroup
    formModify: FormGroup
    accountSelected: any
    data = {}
    messageError = {}
    workflowTypePaymentList: any[] = []
    serviceAccountList: any[] = []


    validationResponse: any = {}
    requestValidate: RequestValidate
    confirmResponse: any = {}
    combosData: any = { accountsList: [], privilegesList: [] }
    fieldsConfigForList: any[]
    fieldsConfigForSearchForm: any[]

    combosKeys: any[] = [
        'privileges'
        // 'WorkflowAccountStatus'
        // 'branchRbs5'
        // 'currency',
        // 'process',
        // 'processStatus',
    ]

    privilegesWorkflow = []

    // combosKeys: any[] = ['branches']
    constructor(
        public router: Router,
        public fb: FormBuilder,
        public staticService: StaticService,
        public translate: TranslateService,
        public listService: AccountRulesSearchService,
        public authenticationService: AuthenticationService,
        public modelPipe: ModelPipe,
    ) {
        super(fb, translate, authenticationService, router)
        this.step = 1
        this.requestValidate = new RequestValidate()
        this.formModify = this.fb.group({
            accountNumber: [''],
            accountRules: new FormArray([]),
        })
        this.fieldsConfigForSearchForm = []
        // this.combosData = {}
    }

    ngOnInit() {
        super.ngOnInit()
    }

    isDisabled() {
        return !(this.tableSelectedRows && this.tableSelectedRows.length > 0)
    }
    ngOnDestroy() {
        super.ngOnDestroy()
    }
    getId(row) {
        return row[this.getIdFieldName()]
    }
    getIdFieldName() {
        return 'serialNumber'
    }
    reset() {
        this.searchForm.reset() //controls.status.reset();
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

    getList(searchElement, order, orderType, offset, pageSize) {
        if(searchElement.currency === '001') {
            searchElement.currency = null
        }
        if(!searchElement.privilegeId){
            searchElement.searchByPrivilege = false
        }

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
                                totalElements: result.data['total'],
                                totalPages: result.page.totalPages,
                                pageNumber: result.page.pageNumber,
                                pageSize: result.page.pageSize,
                            },
                            data: result.data['items'],
                        }
                        this.getAccounts();

                    }
                }),
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

    refreshData() {
        super.refreshData()
        this.subscriptions.push(
            this.staticService
                .getAllCombosAsArrays(this.combosKeys)
                .subscribe((result) => {
                    this.privilegesWorkflow = result.privileges
                    this.getPrivileges()
                }),
        )
        // this.getBranches();
        this.fieldsConfigForList = this.listService.getFieldsConfigForList()
        this.fieldsConfigForSearchForm = this.listService.getFieldsConfigForSearchForm()
        this.listService.setCombosData(this.combosData)
        this.search(false)
    }

    getBranches() {
        this.subscriptions.push(
            this.listService.branches().subscribe((result) => {
                const branches = result.items
                // const combosData = {}
                this.combosData['branchesList'] = []
                // tslint:disable-next-line:prefer-for-of
                for (let i = 0; i < branches.length; i++) {
                    this.combosData['branchesList'].push({
                        key: branches[i],
                        value: this.getUnescapedStr(
                            branches[i].branchRbs5 +
                            ' - ' +
                            (this.translate.currentLang == 'ar'
                                ? branches[i]['branchName']
                                : branches[i]['branchNameEn']),
                        ),
                    })
                }
                this.combosData = Object.assign({}, this.combosData);
                this.listService.combosData = this.combosData
                // this.search()
            }),
        )
    }

    getPrivileges() {
        this.subscriptions.push(
            this.listService.privileges().subscribe((result) => {
                const privileges = result.privilegeList
                this.combosData['privilegesList'] = []
                for (let i = 0; i < privileges.length; i++) {
                    const value = this.privilegesWorkflow.find(e => e.key === privileges[i].privilegeId)
                    if(value){
                        this.combosData['privilegesList'].push({
                            key: privileges[i].privilegeId,
                            value: value['value']
                        })
                    } else {
                        this.combosData['privilegesList'].push({
                            key: privileges[i].privilegeId,
                            value: privileges[i].privilegeId
                        })
                    }
                }
                this.combosData = Object.assign({}, this.combosData);
                // this.search()
            }),
        )
    }

    getAccounts() {
        this.combosData['accountsList'] = []
        if (this.elementsPage.data) {

            for (let i = 0; i < this.elementsPage.data.length; i++) {
                this.combosData['accountsList'].push(

                    {
                        key: this.elementsPage.data[i]['account'].fullAccountNumber,
                        value: this.elementsPage.data[i]['account'].fullAccountNumber,
                    })
            }
        }
        this.serviceAccountList = this.getServiceAccountList()


        this.combosData = Object.assign({}, this.combosData);
    }
    onClickRow(row: any, propName = null) {
        this.listService.setAccountSelected(row)
        this.router.navigate(['/companyadmin/workflow/accountRules'])
    }
    getServiceAccountList(): any {
        this.serviceAccountList = [];
        const account: any[] = []
        if (this.elementsPage.data.length > 0) {
            for (let i = 0; i < this.elementsPage.data.length; i++) {
                account.push(this.elementsPage.data[i]['account'])
                account[i]['statusAccount'] = this.elementsPage.data[i]['status'] ? this.elementsPage.data[i]['status'] : ''
                account[i]['dateUpdate'] = this.elementsPage.data[i]['dateUpdate'] ? this.elementsPage.data[i]['dateUpdate'] : ''
                account[i]['userUpdate'] = this.elementsPage.data[i]['userUpdate'] ? this.elementsPage.data[i]['userUpdate'] : ''
                account[i]['accountExport'] = this.elementsPage.data[i]['accountExport'] ? this.elementsPage.data[i]['accountExport'] : ''
                account[i]['branchIdExport'] = this.elementsPage.data[i]['branchIdExport'] ? this.elementsPage.data[i]['branchIdExport'] : ''
                account[i]['currencyExport'] = this.elementsPage.data[i]['currencyExport'] ? this.elementsPage.data[i]['currencyExport'] : ''
                account[i]['nickNameExport'] = this.elementsPage.data[i]['nickNameExport'] ? this.elementsPage.data[i]['nickNameExport'] : ''
                account[i]['statusExport'] = this.elementsPage.data[i]['statusExport'] ? this.elementsPage.data[i]['statusExport'] : ''
            }
        }
        return account;
    }
}
