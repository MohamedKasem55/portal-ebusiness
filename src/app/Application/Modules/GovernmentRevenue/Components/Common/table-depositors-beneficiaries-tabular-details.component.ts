import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core'
import {TranslateService} from '@ngx-translate/core'
import {PagedData} from "../../../../Model/paged-data";
import {Page} from "../../../../Model/page";
import {AbstractDatatableMobileComponent} from "../../../Common/Components/Abstract/abstract-datatable-mobile.component";
import {FormBuilder} from "@angular/forms";
import {AuthenticationService} from "../../../../../core/security/authentication.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-government-revenue-table-depositors-beneficiaries-tabular-details',
    templateUrl: './table-depositors-beneficiaries-tabular-details.component.html',
})
export class TableDepositorsBeneficiariesTabularDetailsComponent
    extends AbstractDatatableMobileComponent
    implements OnInit, OnChanges {

    @ViewChild('depositorBeneficiariesTabularTable', {static: true}) table: any

    @Input() title = 'governmentRevenue.bulkUploadFile.tabularOfTheDetails';

    @Input() details: any[] = [];

    @Output() onInit = new EventEmitter<any>()

    treeData: any[] = [];

    depositorBeneficiariesPageData: PagedData<any>

    constructor(public fb: FormBuilder,
                public translate: TranslateService,
                public authenticationService: AuthenticationService,
                public router: Router,
                private cd: ChangeDetectorRef) {
        super(fb, translate, authenticationService, router)

        this.depositorBeneficiariesPageData = new PagedData<any>()
        this.depositorBeneficiariesPageData.data = []
        const page = new Page()
        page.pageNumber = 1
        page.pageSize = 20
        this.depositorBeneficiariesPageData.page = page
    }

    ngOnInit() {
        super.ngOnInit()
        this.onInit.emit(this)
    }

    ngOnChanges(changes: SimpleChanges) {
        this.refreshData();
    }


    refreshData() {
        super.refreshData();

        const depositorOriginatorCounts = {};

        this.treeData = [];

        this.details.forEach((detail: any, index: number) => {

            if (!depositorOriginatorCounts[detail.depositorOriginator.govRevenueDepositorsPk]) {
                depositorOriginatorCounts[detail.depositorOriginator.govRevenueDepositorsPk] = {
                    type: 'depositor',
                    parentId: null,
                    id: 'D-' + this.pad(index, '0', 10) + '-' + detail.depositorOriginator.govRevenueDepositorsPk,
                    treeStatus: 'collapsed',
                    hidden: false,

                    depositorId: detail.depositorOriginator.govRevenueDepositorsPk,
                    beneficiaryId: null,

                    account: detail.depositorOriginatorStr,
                    amount: 0,
                    counts: 0,
                    name: detail.depositorOriginator.depositorOriginatorName,

                    depositorToPrint: detail.depositorOriginator.depositorOriginatorName,
                    beneficiaryToPrint: null,
                    subAccountToPrint: null,
                };

                this.treeData.push(depositorOriginatorCounts[detail.depositorOriginator.govRevenueDepositorsPk]);
            }

            const depositor = depositorOriginatorCounts[detail.depositorOriginator.govRevenueDepositorsPk]

            const beneficiary = {
                type: 'beneficiary',
                parentId: depositor.id,
                id: depositor.id + '-B-' + this.pad(index, '0', 10) + '-' + detail.beneficiaryOriginator.govRevenueDepositorsPk,
                treeStatus: 'collapsed',
                hidden: true,

                depositorId: depositor.id,
                beneficiaryId: depositor.id + '-B-' + this.pad(index, '0', 10) + '-' + detail.beneficiaryOriginator.govRevenueDepositorsPk,

                account: detail.beneficiaryOriginatorStr,
                amount: 0,
                counts: detail.subAccounts.length,
                name: detail.beneficiaryOriginator.depositorOriginatorName,

                depositorToPrint: null,
                beneficiaryToPrint: detail.beneficiaryOriginator.depositorOriginatorName,
                subAccountToPrint: null,
            }

            depositor.counts = depositor.counts + 1;

            this.treeData.push(beneficiary);

            detail.subAccounts.forEach((subAccount, indexS) => {
                const subAccountItem = {
                    type: 'subAccount',
                    parentId: beneficiary.id,
                    id: beneficiary.id + '-S-' + this.pad(indexS, '0', 10) + '-' + detail.subAccount,
                    treeStatus: 'collapsed',
                    hidden: true,

                    depositorId: depositor.id,
                    beneficiaryId: beneficiary.id,

                    account: subAccount.subAccount,
                    amount: Number.parseFloat(subAccount.amount),
                    counts: 1,
                    name: subAccount.name,

                    depositorToPrint: null,
                    beneficiaryToPrint: null,
                    subAccountToPrint: subAccount.name,
                }

                depositor.amount = depositor.amount + Number.parseFloat(subAccount.amount);
                beneficiary.amount = beneficiary.amount + Number.parseFloat(subAccount.amount);

                this.treeData.push(subAccountItem);
            })

        });

        this.treeData.sort((a, b) => {
            return ("" + a.id).localeCompare(""+b.id);
        });

        this.depositorBeneficiariesPageData.data = [...this.treeData.filter((treeItem) => treeItem.hidden === false)];
        this.depositorBeneficiariesPageData.page.totalPages = 1
        this.depositorBeneficiariesPageData.page.totalElements = this.depositorBeneficiariesPageData.data.length
        this.depositorBeneficiariesPageData.page.size = this.depositorBeneficiariesPageData.data.length
    }

    pad(valor, char, size) {
        let str = "" + valor
        while (str.length < size) {
            str = char + str
        }
        return str;
    }

    getAllTables(): any[] {
        const tablas = []
        if (this.table) {
            tablas.push(this.table)
        }
        return tablas
    }

    onTreeAction(row: any) {
        if (row.type === 'depositor') {
            if (row.treeStatus === 'collapsed') {
                row.treeStatus = 'expanded';
                this.treeData.forEach((item) => {
                    if (item.depositorId === row.id && item.type === 'beneficiary') {
                        item.treeStatus = 'collapsed';
                        item.hidden = false;
                    }
                    if (item.depositorId === row.id && item.type === 'subAccount') {
                        item.treeStatus = 'collapsed';
                        item.hidden = true;
                    }
                });
            } else if (row.treeStatus === 'expanded') {
                row.treeStatus = 'collapsed';
                this.treeData.forEach((item) => {
                    if (item.depositorId === row.id && item.type === 'beneficiary') {
                        item.treeStatus = 'collapsed';
                        item.hidden = true;
                    }
                    if (item.depositorId === row.id && item.type === 'subAccount') {
                        item.treeStatus = 'collapsed';
                        item.hidden = true;
                    }
                });
            }
        } else if (row.type === 'beneficiary') {
            if (row.treeStatus === 'collapsed') {
                row.treeStatus = 'expanded';
                this.treeData.forEach((item) => {
                    if (item.beneficiaryId === row.id && item.type === 'subAccount') {
                        item.treeStatus = 'collapsed';
                        item.hidden = false;
                    }
                });
            } else if (row.treeStatus === 'expanded') {
                row.treeStatus = 'collapsed';
                this.treeData.forEach((item) => {
                    if (item.beneficiaryId === row.id && item.type === 'subAccount') {
                        item.treeStatus = 'collapsed';
                        item.hidden = true;
                    }
                });
            }
        }

        this.depositorBeneficiariesPageData.data = [...this.treeData.filter((treeItem) => treeItem.hidden === false)];
        this.depositorBeneficiariesPageData.page.totalElements = this.depositorBeneficiariesPageData.data.length
        this.depositorBeneficiariesPageData.page.size = this.depositorBeneficiariesPageData.data.length

        this.cd.detectChanges();
    }

    getId(row): any {
    }

    getList(searchElement, order, orderType, offset, pageSize) {
    }
}
