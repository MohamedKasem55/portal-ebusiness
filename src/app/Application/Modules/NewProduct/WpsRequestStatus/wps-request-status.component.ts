import { Component, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { FormBuilder } from '@angular/forms'
import { DatatableMobileComponent } from 'app/core/responsive/datatable-mobile.component'
import { WpsRequestStatus } from './wps-request-status.service'
import {WpsPayrollService} from "../WpsPayrollNew/wps-payroll-new.service";
import {ModalDirective} from "ngx-bootstrap/modal";


@Component({
    selector: 'wps-request-status',
    templateUrl: './wps-request-status.component.html',
    styleUrls: ['./wps-request-status.component.scss'],
})

export class WpsRequestStatusComponent extends DatatableMobileComponent {


    @ViewChild('wpsRequestSearchPanelTable', { static: true }) table: any;
    @ViewChild('wpsStatusModal') wpsStatusModal: ModalDirective

    order: string;
    orderType: string;
    requestsPage: any = { data: [], page: { size: 0, totalElements: 0, totalPages: 0, pageNumber: 0, pageSize: 10 }};
    requestsPageCount: number = 0;
    model: any;
    isSearchCollapsed = true;
    accounts = [];
    account: string;


    constructor(
        public formBuilder: FormBuilder,
        public router: Router,
        public translate: TranslateService,
        private wpsRequestStatus: WpsRequestStatus,
        private wpsPayrollService: WpsPayrollService
    ) {
        super()

        this.model = {
            account: '',
            requestNumber: '',
            requestType: '',
            requestUser: '',
            requestStatus: '',
        }
    }


    onChangeAccount(codeaccount: string): void {
        this.account = codeaccount
    }


    canShowSelectPlaceHolder(field) {
        if (field == null) {
            return true
        }
    }

    reset() {
        this.model = {
            account: '',
            requestNumber: '',
            requestType: '',
            requestUser: '',
            requestStatus: '',
        };
    }


    ngOnInit() {
        super.ngOnInit();
        this.order = 'account';
        this.orderType = 'desc';
        this.setPage();
    }

    ngOnDestroy() {

    }


    search() {

    }

    setPage() {
        this.wpsPayrollService.getPayrollAgreementEligibility().subscribe(res => {

            if(res.errorCode == '0'){
                if(res.eligibleToRegister || res.eligibleToUpdate){
                    this.wpsRequestStatus.getRequestStatus().subscribe((res) => {
                        let size = res.companyPayrollAgreementDTOS.length;
                        this.requestsPage = {
                            page: { size: size, totalElements: size, totalPages: Math.ceil(size / 10), pageNumber: 0, pageSize: 10 },
                            data: res.companyPayrollAgreementDTOS
                        };
                    });
                } else if (!res.eligibleToRegister && !res.eligibleToUpdate){
                    this.wpsStatusModal.show()
                }
            } else {
                this.router.navigate(['/'])
            }
        })
    }


    getDetails(selectedRowData) {
        this.router.navigateByUrl('/newProduct/wps/requestDetails', {state : {data: selectedRowData}});
    }

    close(){
        this.wpsStatusModal.hide()
        this.router.navigate(['/'])
    }
}

