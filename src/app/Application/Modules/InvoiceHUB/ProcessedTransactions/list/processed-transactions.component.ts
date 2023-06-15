import { ProcessedTransactionsInvoiceService } from './../processed-transactions-invoice.service';
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
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { SearchablePanelComponent } from 'arb-design'
import { AbstractDatatableMobileComponent } from '../../../Common/Components/Abstract/abstract-datatable-mobile.component'
import { StaticService } from '../../../Common/Services/static.service'
import { AuthenticationService } from '../../../../../core/security/authentication.service'

import { Page } from "../../../../Model/page";
import { ProcessedTransactionsListService } from './processed-transactions-list.service'
import { ProcessedTransactionsDetailService } from '../details/processed-transactions-detail.service'
import { EsalPaymentsBatch } from './processed-transactions.model'

@Component({
    templateUrl: './processed-transactions.component.html',
    selector: 'bill-processed-transactions',
})
export class ProcessedTransactionsComponent
    extends AbstractDatatableMobileComponent
    implements OnInit, OnDestroy {
    @ViewChild(SearchablePanelComponent)
    searchablePanel: SearchablePanelComponent

    combosKeys: any[] = [
        'processTransactionStatus',
    ]
    combosData: any = {}

    fieldsConfigForList: any[]

    fieldsConfigForSearchForm: any[]
    routes: any[] = [['dashboard.payments'], ['dashboard.invoiceHUB', ['/invoiceHUB']], ['menu.sadad.bill_payments.processed_Transactions']]

    constructor(
        public fb: FormBuilder,
        public staticService: StaticService,
        public translate: TranslateService,
        public authenticationService: AuthenticationService,
        public router: Router,
        public detailsService: ProcessedTransactionsDetailService,
        public listService: ProcessedTransactionsListService,
        public processedTransactionsInvoiceService: ProcessedTransactionsInvoiceService
    ) {
        super(fb, translate, authenticationService, router)

        this.order = 'serialNumber'
        this.orderType = 'asc'

        this.combosData = { biller: [], user: [], account: [] }

        this.fieldsConfigForList = []
        this.fieldsConfigForSearchForm = []
        this.searchForm = this.fb.group({})
    }

    ngOnInit() {

        super.ngOnInit()
    }

    refreshData() {
        super.refreshData()
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

                    this.getBillCode();
                    this.getUser();
                    this.getAccountNumber();
                    this.fieldsConfigForList = this.listService.getFieldsConfigForList()
                    this.fieldsConfigForSearchForm = this.listService.getFieldsConfigForSearchForm()
                }),

        )
        this.setPage(null);
    }

    public getBillCode() {
        this.combosData['biller'] = [];
        this.subscriptions.push(this.listService.getBillers().subscribe((result: any) => {
            if (result.errorCode != '0') {
                this.onError(result);
            } else {
                const biller = []
                result.billCodesList.billsList?.forEach((element, i) => {
                    biller.push({
                        key: element.billCode,
                        value: element.billCode
                    })
                });
                this.combosData = Object.assign({}, this.combosData, { biller })
            }
        }));
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
                                size: result.page.size,
                                totalElements: result.page.totalElements,
                                totalPages: result.page.totalPages,
                                pageNumber: result.page.pageNumber,
                                pageSize: +result.page.pageSize,
                            },
                            data: result.data,
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

    onClickRow(row: EsalPaymentsBatch, propName = null) {
        this.processedTransactionsInvoiceService.setSelectedItem(row);
        this.router.navigate(['/invoiceHUB/processedTransactions/details'])
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

    onSearchFormAllFieldsCreated($event) { }


}

