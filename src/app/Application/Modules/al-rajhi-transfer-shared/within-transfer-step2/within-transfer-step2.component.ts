import {
    AfterViewChecked,
    Component,
    EventEmitter,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Output, PLATFORM_ID,
    ViewChild
} from '@angular/core';
import {DatatableMobileComponent} from "../../../../core/responsive/datatable-mobile.component";
import {FormBuilder, FormGroup} from "@angular/forms";
import {TransferInit} from "../../Home/Model/transferInit";
import {FillBeneficiaries} from "../../../Model/fillBeneficiaries";
import {PagedData} from "../../../Model/paged-data";
import {Beneficiary} from "../../../Model/beneficiary";
import {Subscription} from "rxjs";
import {BeneficiaryService} from "../../Transfers/Services/beneficiary.service";
import {TransferWithinService} from "../../Home/Services/transfer-within.service";
import {StaticService} from "../../Common/Services/static.service";
import {TranslateService} from "@ngx-translate/core";
import {Exception} from "../../../Model/exception";
import {isPlatformBrowser} from "@angular/common";

@Component({
    selector: 'app-within-transfer-step2',
    templateUrl: './within-transfer-step2.component.html',
    styleUrls: ['./within-transfer-step2.component.scss']
})
export class WithinTransferStep2Component extends DatatableMobileComponent
    implements OnInit, OnDestroy, AfterViewChecked {

    @ViewChild('beneficiaryTable', {static: true}) table: any
    @Input() form: FormGroup
    @Input() buttonLabel: string
    @Input() tableSelectedRows: any = [];
    @Input() beneficiariesService: BeneficiaryService;
    @Output() onNext = new EventEmitter<boolean>()
    @Output() onInit = new EventEmitter<Component>()

    isCollapsedContent = true
    loading = false
    public innerWidth: any
    public mobile = false
    initTransferData: TransferInit
    fillBeneficiariesData: FillBeneficiaries
    beneficiaryPage: PagedData<Beneficiary>
    formSearch: FormGroup
    beneficiaries: any[] = []
    order: string
    orderType: string
    mensajeError: any = {}
    subscriptions: Subscription[] = []
    maxSelected = 10
    selectAllOnPage: any = []

    constructor(
        public fb: FormBuilder,
        public serviceTransfer: TransferWithinService,
        public staticService: StaticService,
        public translate: TranslateService,
        @Inject(PLATFORM_ID) private platformId,
    ) {
        super()
        this.formSearch = this.fb.group({
            erNumber: '',
            filterBankCode: '',
            filterBankName: '',
            filterBenefName: '',
            filterCriteria: 'beneficiary',
            filterCurrency: '',
            type: '01',
            pageSize: '',
        })

        this.beneficiaryPage = new PagedData<Beneficiary>()
        this.changeTypeCriteria('beneficiary')
        this.formSearch.controls.filterCriteria.valueChanges.subscribe((value) => {
            this.changeTypeCriteria(value)
        })
    }

    ngOnInit() {
        super.ngOnInit()
        this.innerWidth = window.innerWidth

        this.mensajeError = {}
        this.setPage(null)
        this.subscriptions.push(
            this.serviceTransfer.transferInit().subscribe((result) => {
                if (result instanceof Exception) {
                    this.onError(result)
                    return
                } else {
                    this.initTransferData = result
                    this.mensajeError = {}
                    this.onInit.emit(this as Component)
                }
            }),
        )
        window.addEventListener('resize', (res: Event) => {
            this.innerWidth = window.innerWidth
            if (this.innerWidth < 800) {
                this.mobile = true
                this.table?.rowDetail.expandAllRows()
            } else {
                this.mobile = false
                this.table?.rowDetail.collapseAllRows()
            }
        })

        if(this.beneficiariesService.selectedWithinBeneficiaries.length > 0){
            this.tableSelectedRows = this.beneficiariesService.selectedWithinBeneficiaries
        }
    }

    ngAfterViewChecked() {
        if (isPlatformBrowser(this.platformId) && this.innerWidth < 800) {
            if (this.beneficiaryPage.data.length > 0) {
                this.mobile = true
                this.table.rowDetail.expandAllRows()
            }
        }
    }

    getAllTables(): any[] {
        const tablas = []
        tablas.push(this.table)
        return tablas
    }

    reset() {
        this.formSearch = this.fb.group({
            erNumber: '',
            filterBankCode: '',
            filterBankName: '',
            filterBenefName: '',
            filterCriteria: 'beneficiary',
            filterCurrency: '',
            type: '01',
            pageSize: '',
        })
        this.getBeneficiaries()
    }

    changeTypeCriteria(value) {
        if (value == 'beneficiary') {
            this.formSearch.controls.filterBenefName.enable()
            this.formSearch.controls.filterBankName.reset()
            this.formSearch.controls.filterBankName.disable()
        } else {
            this.formSearch.controls.filterBankName.enable()
            this.formSearch.controls.filterBenefName.reset()
            this.formSearch.controls.filterBenefName.disable()
        }
    }

    onError(error: any) {
        const res = error
        if (typeof res.error != 'undefined') {
            this.mensajeError['code'] = res.error.errorCode
            this.mensajeError['description'] = res.error.errorDescription
        }
    }

    setPageSize(event) {
        this.beneficiaryPage.page.pageSize = event.target.value
        this.setPage(null)
    }

    setPage(dataTableEvent) {
        if (dataTableEvent == null) {
            dataTableEvent = {offset: 0}
        }
        this.loading = true
        // Service Call
        this.beneficiaryPage.page.pageSize = 10
        this.subscriptions.push(
            this.beneficiariesService
                .searchBeneficiaries(
                    this.formSearch.value,
                    Number(dataTableEvent.offset) + 1,
                    this.beneficiaryPage.page.pageSize,
                )
                .subscribe((result) => {
                    if (result instanceof Exception) {
                        this.onError(result)
                        return
                    } else {
                        this.loading = false
                        this.beneficiaryPage = result
                    }
                }),
        )
    }

    setSort(dataTableEvent) {
        this.loading = true
        // Service Call with new short
        this.beneficiaryPage.page.pageSize = 10
        this.subscriptions.push(
            this.beneficiariesService
                .searchBeneficiaries(
                    this.formSearch.value,
                    Number(dataTableEvent.offset) + 1,
                    this.beneficiaryPage.page.pageSize,
                )
                .subscribe((result) => {
                    if (result instanceof Exception) {
                        this.onError(result)
                        return
                    } else {
                        this.beneficiaryPage = result
                        this.loading = false
                    }
                }),
        )
    }

    removeSelected(index) {
        this.tableSelectedRows.splice(index, 1)
    }

    removeDuplicate(selected) {
        const select = []
        const ids: Set<string> = new Set()
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < selected.length; i++) {
            if (ids.has(selected[i]['beneficiaryId'])) {
                continue
            }
            select.push(selected[i])
            ids.add(selected[i]['beneficiaryId'])
        }
        return select
    }

    onSelect({ selected }) {
        // Make sure we are no longer selecting all
        this.selectAllOnPage[this.beneficiaryPage.page.pageNumber] = false
        this.tableSelectedRows.push(...selected)

        this.tableSelectedRows = this.tableSelectedRows.filter(
            (obj, index, self) =>
                index === self.findIndex((t) => this.getBeneficiaryId(obj) === this.getBeneficiaryId(t)),
        )
        this.tableSelectedRows = [
            ...this.tableSelectedRows.filter((row, index) => this.displayCheck(row)),
        ]

        this.beneficiariesService.selectedWithinBeneficiaries = this.tableSelectedRows
    }

    selectAll(event) {
        if (!this.selectAllOnPage[this.beneficiaryPage.page.pageNumber]) {
            // Unselect all so we dont get duplicates.
            if (this.tableSelectedRows.length > 0) {
                this.beneficiaryPage.data.map((beneficiary) => {
                    this.tableSelectedRows = this.tableSelectedRows.filter(
                        (selected) => this.getBeneficiaryId(selected) !== this.getBeneficiaryId(beneficiary),
                    )
                })
            }
            // Select all again
            this.tableSelectedRows.push(...this.beneficiaryPage.data)
            this.selectAllOnPage[this.beneficiaryPage.page.pageNumber] = true
        } else {
            // Unselect all
            this.beneficiaryPage.data.map((beneficiary) => {
                this.tableSelectedRows = this.tableSelectedRows.filter(
                    (selected) => this.getBeneficiaryId(selected) !== this.getBeneficiaryId(beneficiary),
                )
            })
            this.selectAllOnPage[this.beneficiaryPage.page.pageNumber] = false
        }

        this.beneficiariesService.selectedWithinBeneficiaries = this.tableSelectedRows
    }

    getBeneficiaries() {
        this.setPage({offset: 0})
    }


    cancel() {
        this.onNext.emit(false)
    }

    submit() {
        this.subscriptions.push(
            this.beneficiariesService
                .fillBeneficiaries(this.tableSelectedRows)
                .subscribe((result) => {
                    if (result instanceof Exception) {
                        this.onError(result)
                        return
                    } else {
                        this.fillBeneficiariesData = result
                        this.mensajeError = {}
                        this.onNext.emit(true)
                    }
                }),
        )
    }

    isValidData() {
        return (
            !this.mensajeError.hasOwnProperty('code') &&
            this.tableSelectedRows.length > 0
        )
    }

    getBeneficiaryId(row) {
        return (
            row['beneficiaryId'] +
            row['beneficiaryAccountCode'] +
            row['beneficiaryFullName'] +
            row['ernumber']
        )
    }

    getId(row: string) {
        return String(row['beneficiaryId']) + String(row['beneficiaryAccountCode']) +
            String(row['beneficiaryFullName']) + String(row['ernumber']);
    }

    getIdFunction() {
        return this.getId.bind(this)
    }

    onDetailToggle(event) {
        //console.log('Detail Toggled', event);
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub: Subscription) => {
            sub.unsubscribe()
        })
        this.subscriptions = []
    }

    displayCheck(row) {
        return true
    }
}