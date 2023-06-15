import {Component, Input, OnInit} from '@angular/core';
import {MoiPaymentStep2TrafficViolationDetailsService} from "./moi-payment-step2-traffic-violation-details.service";
import {AbstractDatatableMobileComponent} from "../../../../../../Common/Components/Abstract/abstract-datatable-mobile.component";
import {Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {StaticService} from "../../../../../../Common/Services/static.service";
import {TranslateService} from "@ngx-translate/core";
import {AuthenticationService} from "../../../../../../../../core/security/authentication.service";
import {ModelPipe} from "../../../../../../../Components/common/Pipes/model-pipe";
import {PagedData} from "../../../../../../../Model/paged-data";
import {Page} from "../../../../../../../Model/page";
import {LevelFormatPipe} from "../../../../../../../Components/common/Pipes/getLevels-pipe";

@Component({
    selector: 'app-moi-payment-step2-traffic-violation-details',
    templateUrl: './moi-payment-step2-traffic-violation-details.component.html',
    styleUrls: []
})
export class MoiPaymentStep2TrafficViolationDetailsComponent extends AbstractDatatableMobileComponent
    implements OnInit {

    readonly TRAFFIC_TYPE: string = '093'
    fieldsConfigForList: any[]
    fieldsConfigForSearchForm: any[]
    combosData: any = {}

    @Input() batchList;
    items: any[] = []

    constructor(
        public router: Router,
        public fb: FormBuilder,
        public staticService: StaticService,
        public translate: TranslateService,
        public listService: MoiPaymentStep2TrafficViolationDetailsService,
        public authenticationService: AuthenticationService,
        public modelPipe: ModelPipe,
    ) {
        super(fb, translate, authenticationService, router)
    }

    ngOnInit(): void {
        super.ngOnInit()
    }

    getId(row): any {
        return ''
    }

    getList(searchElement, order, orderType, offset, pageSize) {
        const batchList = []
        batchList.push(...this.batchList['notAllowed'])
        batchList.push(...this.batchList['toProcess'])
        batchList.push(...this.batchList['toAuthorize'])

        if (Array.isArray(batchList) && batchList.length > 0) {
            batchList.forEach((item) => {
                if (item.serviceType === this.TRAFFIC_TYPE) {
                    this.items.push(...item.fees)
                }
            })
        }
        this.elementsPage = {
            page: {
                size: this.items.length,
                totalElements: this.items.length,
                totalPages: this.items.length / pageSize,
                pageNumber: offset,
                pageSize: pageSize,
            },
            data: this.items,
        }
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
        super.refreshData();
        this.fieldsConfigForList = this.listService.getFieldsConfigForList()
        this.listService.setCombosData(this.combosData)
        super.search()
    }

    onClickRow(row: any, propName = null) {
        return null;
    }

}
