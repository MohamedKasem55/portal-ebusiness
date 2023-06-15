import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {RequestToPayService} from "./requestToPay.service";
import {AbstractDatatableMobileComponent} from "../Common/Components/Abstract/abstract-datatable-mobile.component";
import {FormBuilder} from "@angular/forms";
import {AuthenticationService} from "../../../core/security/authentication.service";

@Component({
    selector: 'app-requestToPay',
    templateUrl: './requestToPay.component.html',
    styleUrls: ['./requestToPay.component.scss'],
})
export class RequestToPayComponent extends AbstractDatatableMobileComponent implements OnInit {

    public tabNumber: number = 1

    constructor(
        public fb: FormBuilder,
        public router: Router,
        public translate: TranslateService,
        public authenticationService: AuthenticationService,
        public requestToPayService: RequestToPayService) {
        super(fb, translate, authenticationService, router)
    }

    po

    ngOnInit(): void {
        if (localStorage.getItem("RTP_TAB")) {
            this.tabNumber = parseInt(localStorage.getItem("RTP_TAB"))
        }
        this.elementsPage.page.pageNumber = 1
        this.elementsPage.page.pageSize = 10
        this.fillList()
    }

    rest() {
        this.elementsPage = {
            page: {
                size: 0,
                totalElements: 0,
                totalPages: 0,
                pageNumber: 1,
                pageSize: 10,
            },
            data: []
        }
    }

    fillList() {
        if (this.tabNumber == 2) {
            this.getReceivedRequest(this.elementsPage.page.pageNumber, this.elementsPage.page.pageSize)
        } else {
            this.getSentRequest(this.elementsPage.page.pageNumber, this.elementsPage.page.pageSize)
        }
    }

    getSentRequest(offset, page) {
        this.requestToPayService.getSentRequest(offset, page).subscribe(result => {
            if (result.errorCode == '0') {
                this.elementsPage = {
                    page: {
                        size: result.sentItems.size,
                        totalElements: result.sentItems.total,
                        totalPages: Math.ceil(result.sentItems.total / offset),
                        pageNumber: this.elementsPage.page.pageNumber,
                        pageSize: this.elementsPage.page.pageSize,
                    },
                    data: result.sentItems.items
                }
            }
        })
    }

    getReceivedRequest(offset, page) {
        this.requestToPayService.getReceivedRequest(offset, page).subscribe(result => {
            if (result.errorCode == '0') {
                this.elementsPage = {
                    page: {
                        size: result.items.size,
                        totalElements: result.items.total,
                        totalPages: Math.ceil(result.items.total / offset),
                        pageNumber: this.elementsPage.page.pageNumber,
                        pageSize: this.elementsPage.page.pageSize,
                    },
                    data: result.items.items
                }
            }
        })
    }

    ngAfterViewInit() {

    }

    sendNewRequest() {
        this.router.navigateByUrl("/transfers/rtPay/newRequest").then(() => {
        });
    }

    back() {
        this.router.navigateByUrl("/").then(() => {
        });
    }

    tabChanged(tab) {
        this.rest()
        this.tabNumber = tab
        this.fillList()
        localStorage.setItem("RTP_TAB", tab)
    }

    toDetails(referenceNumber) {
        const data = JSON.stringify({referenceNumber, type: this.tabNumber == 1 ? 'REQUEST' : 'RECEIVE'})
        localStorage.setItem('REQUEST_TO_PAY_REFERENCE', data)
        this.router.navigateByUrl("/transfers/rtPay/details").then(() => {
        });
    }

    getStatusClass(status) {
        switch (status) {
            case 'Pending':
                return 'yellowSpan'
            case 'Expired':
            case 'Cancelled':
            case 'Rejected':
            case 'Processing_Rejection':
            case 'Failed':
                return 'redSpan'
            default :
                return 'greenSpan'
        }
    }

    setPage(dataTableEvent) {
        if (dataTableEvent == null) {
            dataTableEvent = {offset: 1}
        }
        this.elementsPage.page.pageNumber = dataTableEvent.offset
        this.fillList()

    }

    getId(row): any {
    }

    getList(searchElement, order, orderType, offset, pageSize) {
    }

    setPageSize(event) {
        this.elementsPage.page.pageSize = event.target.value
        this.setPage(null)
    }

    footerChanged(event) {
        this.setPage({offset: event.page})
    }
}

/*
'Paid'
'Rejected'
'Cancelled'
'Processing_Acceptance'
'Processing_Rejection'
'Accepted'
'Expired'
'Failed'
'Pending'*/
