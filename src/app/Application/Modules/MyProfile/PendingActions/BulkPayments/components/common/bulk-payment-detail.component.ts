import {Component, Input, OnInit, ViewChild} from '@angular/core'
import {TranslateService} from '@ngx-translate/core'
import {ResponseGenerateChallenge} from 'app/Application/Model/responsegeneratechallenge.type'
import {RequestValidate} from 'app/Application/Model/requestvalidateType'
import {DatatableMobileComponent} from "../../../../../../../core/responsive/datatable-mobile.component";
import {PagedData} from "../../../../../../Model/paged-data";
import {Page} from "../../../../../../Model/page";

@Component({
    selector: 'app-bulk-payment-detail',
    templateUrl: './bulk-payment-detail.component.html',
    styleUrls: ['./bulk-payment-detail.component.scss'],
})
export class BulkPaymentDetailComponent
    extends DatatableMobileComponent
    implements OnInit {

    @ViewChild('elementsTable', {static: true}) table: any
    @Input() bulkPaymentsBatchDetail: any

    step: number
    elementsPage: PagedData<any> = new PagedData<any>()
    // generateChallengeAndOTP: ResponseGenerateChallenge
    // requestValidate: RequestValidate = new RequestValidate()
    statusKeys: any = {
        I: 'status.initiated',
        P: 'status.pending',
        A: 'status.approve',
        R: 'status.rejected'
    }

    constructor(public translate: TranslateService) {
        super()
        this.step = 2
        this.elementsPage.page.pageNumber = 1
        this.elementsPage.page.pageSize = 20
    }

    ngOnInit() {
        super.ngOnInit()
        this.setPage(null);
    }

    setPage(dataTableEvent): void {
        console.log(dataTableEvent);
        if (dataTableEvent == null) {
            dataTableEvent = {offset: 0}
        }
        if (!dataTableEvent.offset) {
            dataTableEvent.offset = 0
        }
        this.elementsPage.page.pageNumber = dataTableEvent.offset + 1
        this.getList(
            dataTableEvent.offset,
            this.elementsPage.page.pageSize,
        )
    }

    getList(offset, pageSize): void {
        // this.elementsPage.page.pageNumber = 1
        //this.elementsPage.page.pageSize = 20
        this.elementsPage.page.size = this.elementsPage.page.pageSize < this.bulkPaymentsBatchDetail.fileLinesList.length ?
            this.elementsPage.page.pageSize : this.bulkPaymentsBatchDetail.fileLinesList.length;
        this.elementsPage.page.totalElements = this.bulkPaymentsBatchDetail.fileLinesList.length
        this.elementsPage.page.totalPages = Math.ceil(
            this.elementsPage.page.totalElements / this.elementsPage.page.pageSize,
        )
        this.elementsPage.data = [...this.bulkPaymentsBatchDetail.fileLinesList];
    }

    getAllTables(): any[] {
        const tablas = []
        if (this.table) {
            tablas.push(this.table)
        }
        return tablas
    }
}
