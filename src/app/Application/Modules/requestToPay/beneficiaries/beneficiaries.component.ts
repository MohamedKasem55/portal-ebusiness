import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {RequestToPayService} from "../requestToPay.service";
import {ColumnMode, SelectionType} from "@swimlane/ngx-datatable";
import {Exception} from "../../../Model/exception";
import {PagedData} from "../../../Model/paged-data";
import {Beneficiary} from "../../../Model/beneficiary";
import {Subscription} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {BeneficiaryService} from "../../Transfers/Services/beneficiary.service";
import {AbstractDatatableMobileComponent} from "../../Common/Components/Abstract/abstract-datatable-mobile.component";
import {AuthenticationService} from "../../../../core/security/authentication.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-requestToPayBeneficiaries',
    templateUrl: './beneficiaries.component.html',
    styleUrls: ['./beneficiaries.component.scss'],
})
export class BeneficiariesComponent extends AbstractDatatableMobileComponent implements OnInit {

    public beneficiaryPage: PagedData<Beneficiary> = new PagedData<Beneficiary>()
    public tableSelectedRows: any[] = []
    private formSearch: FormGroup

    constructor(
        public translate: TranslateService,
        public beneficiaryService: BeneficiaryService,
        public fb: FormBuilder,
        public authenticationService: AuthenticationService,
        public router: Router,) {
        super(fb, translate, authenticationService, router)
        this.formSearch = this.fb.group({
            erNumber: '',
            filterBankCode: '',
            filterBankName: '',
            filterBenefName: '',
            filterCriteria: 'beneficiary',
            filterCurrency: '',
            type: '02',
            pageSize: '',
        })
    }


    ngOnInit() {
        this.setPage(null)
    }

    setPageSize(event) {
        this.beneficiaryPage.page.pageSize = event.target.value
        this.setPage(null)
    }

    setPage(dataTableEvent) {
        if (dataTableEvent == null) {
            dataTableEvent = {offset: 0}
        }
        this.beneficiaryPage.page.pageSize = 10
        this.subscriptions.push(
            this.beneficiaryService
                .searchBeneficiaries(
                    this.formSearch.value,
                    dataTableEvent.offset + 1,
                    this.beneficiaryPage.page.pageSize,
                )
                .subscribe((result) => {
                    if (result instanceof Exception) {
                        this.onError(result)
                        return
                    } else {
                        this.beneficiaryPage = result
                        setTimeout(() => {
                            this.resizeAllTables()
                        }, 200)
                    }
                }),
        )
    }

    setSort(dataTableEvent) {
        this.beneficiaryPage.page.pageSize = 10
        this.subscriptions.push(
            this.beneficiaryService
                .searchBeneficiaries(
                    this.formSearch.value,
                    dataTableEvent.offset + 1,
                    this.beneficiaryPage.page.pageSize,
                )
                .subscribe((result) => {
                    if (result instanceof Exception) {
                        this.onError(result)
                        return
                    } else {
                        this.beneficiaryPage = result
                    }
                }),
        )
    }

    getId(row) {
        return (
            row['beneficiaryId'] +
            row['beneficiaryAccountCode'] +
            row['beneficiaryFullName'] +
            row['ernumber']
        )
    }

    getList(searchElement, order, orderType, offset, pageSize) {
        console.log("test")
    }

    onSelect(event) {
        super.onSelect(event)
        const selectedItem = event.selected[0]
        this.beneficiaryPage.data.forEach(item => {
            if (item == selectedItem) {
                item.selected = (!Boolean(item.selected)).toString()
            }
        })
    }
}