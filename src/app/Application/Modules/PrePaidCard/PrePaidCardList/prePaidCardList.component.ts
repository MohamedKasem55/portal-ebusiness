import { PrePaidCardService } from '../prePaidCard.service'
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, } from '@angular/core'
import { Router } from '@angular/router'
import { Exception } from '../../../Model/exception'
import { StorageService } from '../../../../core/storage/storage.service'
import { PagedData } from '../prePaidCardModels'
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap'
import { PrepaidCardItem, PrepaidCardListResponse } from './prePaidCardListModel'
import { PrePaidCardListService } from './prePaidCardList.service'
import { User } from 'app/Application/Model/user'
import { AuthenticationService } from 'app/core/security/authentication.service'
import { StaticService } from "../../Common/Services/static.service";
import { Prepaid_Status_card, PrePaidCardDetailService } from "../PrePaidCardViewQuery/prePaidCardDetail.service";
import { PrepaidCardsDetailsRequest } from "../PrePaidCardViewQuery/prePaidCardDetailModel";
import { take } from "rxjs/operators";
import { PrePaidCardResetPINService } from "../PrePaidCardReset/prePaidCardResetPin.service";
import { PrePaidCardBlockService } from "../PrePaidCardBlock/prePaidCardBlock.service";
import { PrePaidCardPaymentService } from "../PrePaidCardPayment/prePaidCardPayment.service";
import { DatatableMobileComponent } from "../../../../core/responsive/datatable-mobile.component";
import { TranslateService } from "@ngx-translate/core";
import { CredentialsObject, ViewCardCredentialsData } from '../../ViewCardCredentials/view-card-credentials.models'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { ViewCardCredentialsService } from '../../Common/Services/viewCardCredentials/view-card-credentials.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { throwError as observableThrowError } from 'rxjs'



@Component({
    selector: 'PrePaidCardList',
    templateUrl: './prePaidCardList.component.html',
    styleUrls: ['./PrePaidCardList.component.scss']
})
export class PrePaidCardListComponent extends DatatableMobileComponent
    implements OnInit, AfterViewInit, OnDestroy{
    @ViewChild('prePaidCardListTable') table: any;
    @ViewChild('myCarousel') myCarousel: NgbCarousel;
    @ViewChild('displayCardCredential', { static: true }) displayCardCredential: ModalDirective
    @ViewChild('pin1', { read: ElementRef }) pin1: ElementRef
    @ViewChild('pin2', { read: ElementRef }) pin2: ElementRef
    @ViewChild('pin3', { read: ElementRef }) pin3: ElementRef
    @ViewChild('pin4', { read: ElementRef }) pin4: ElementRef
    @Output() onInit = new EventEmitter<Component>();
    public form: any
    public isSole: boolean = false;
    public timerInterval: any;
    public display: any;
    public params: ViewCardCredentialsData = new ViewCardCredentialsData();
    public countDown: boolean = false;
    public requestValidate: RequestValidate = new RequestValidate();
    public viewCredentialGroupIsActive: boolean = false
    public confirmResponse: any = {}
    accounts: object[];
    statements: object[];
    total: number;
    account: string;
    errorObj: any = {};
    tableDisplaySize = 20;
    sharedData: any = {};
    slidesNum: number;
    option: string;
    slidesActive: number;
    //added
    offset = 0;
    prepaidCardListResponse: PrepaidCardListResponse;
    slides: PrepaidCardItem[][] = [];
    currentUser: User;
    showTabs: boolean = false;
    public indexSelected: number = 0;
    selectedcard: PrepaidCardItem;
    prepaidCardsList: PrepaidCardItem[];
    selectedcardDetails: any;
    public inactiveStatus = Prepaid_Status_card.inActive
    activeTab: number;
    public detailsPage: PagedData<any>;
    public tableSelectedRows: any = [];
    public transactionsTab = true;
    public statementsTab = false;

    constructor(
        public router: Router,
        private fb: FormBuilder,
        private storageService: StorageService,
        public prePaidCardService: PrePaidCardService,
        private prepaidCardListService: PrePaidCardListService,
        public authenticationService: AuthenticationService,
        public viewCardCredentialsService: ViewCardCredentialsService,
        public staticService: StaticService,
        public prePaidCardDetailService: PrePaidCardDetailService,
        public resetPINService: PrePaidCardResetPINService,
        public prePaidCardBlockService: PrePaidCardBlockService,
        public translate: TranslateService
    ) {
        super();
        this.form = fb.group({
            newPin: fb.group({
                newPin1: ['', Validators.required],
                newPin2: ['', Validators.required],
                newPin3: ['', Validators.required],
                newPin4: ['', Validators.required],
            }),
        })
    }


    ngOnInit() {

        const infoUser = JSON.parse(this.storageService.retrieve('currentUser'));
        this.currentUser = infoUser.user;
        const listRequest = {
            page: this.offset + 1, // Initial offset = 0
            rows: this.tableDisplaySize,
        };
        this.prepaidCardListService
            .getPrepaidCardList(listRequest).pipe(take(1))
            .subscribe((result) => {
                if (result instanceof Exception) {
                    this.onError(result);
                    return;
                } else {
                    this.prepaidCardListResponse = result;
                    this.prepaidCardListResponse.prepaidCardsList =
                        this.cardFilterByBin(
                            this.prepaidCardListResponse.prepaidCardsList
                        );
                    this.prepaidCardsList = this.prepaidCardListResponse.prepaidCardsList;
                    this.selectedcard = this.prepaidCardListResponse.prepaidCardsList[0];
                    this.prePaidCardService.setPrepaidCardList(
                        this.prepaidCardListResponse.prepaidCardsList,
                    )
                    this.slides = this.prepaidCardListService.groupPrepaidCardListInSlides(
                        this.prepaidCardListResponse.prepaidCardsList,
                        6,
                    )
                    this.slidesNum = Object.keys(this.slides).length;
                    this.initializeScreen();
                }
            });
        this.isSolePropietorCompany()
        this.viewCredentialGroupIsActive = this.getViewCredentialGroup()
    }

    ngAfterViewInit(): void {
        this.activeTab = 1;
    }

    onSelectCard(prepaidCardItem: PrepaidCardItem) {
        this.selectedcard = prepaidCardItem;
        this.indexSelected = this.prepaidCardsList.indexOf(prepaidCardItem);
        this.initializeScreen();

    }

    initializeScreen() {
        this.detailsPage = new PagedData<any>();
        this.detailsPage.page.pageSize = 20;

        let selectedPrepaidCardIndex = history.state.selectedPrepaidCardIndex;
        if (selectedPrepaidCardIndex) {
            this.indexSelected = selectedPrepaidCardIndex;
            this.getCardDetails(selectedPrepaidCardIndex)
        } else {
            this.getCardDetails(this.indexSelected);
        }
        this.errorObj = {};
        this.onInit.emit(this as Component);
    }

    private getCardDetails(cardId: number, search?: boolean) {
        this.showTabs = false;
        let request: PrepaidCardsDetailsRequest;
        request = {
            page: 1,
            rows: 50,
            cardSeqNumber: this.prepaidCardsList[cardId].cardSeqNumber
        };
        this.prePaidCardDetailService.getCardDetails(request).pipe(take(1)).subscribe((res) => {
            if (res.errorCode != '0') {
                this.onError(res);
                return;
            } else {
                this.errorObj = {};
                if (res?.prepaidCardDetails) {
                    this.selectedcardDetails = res;
                }
                this.detailsPage = {
                    page: {
                        size: this.selectedcardDetails.transactionsList?.size,
                        totalElements: this.selectedcardDetails.transactionsList?.total,
                        totalPages: this.selectedcardDetails.transactionsList?.total / this.detailsPage.page.pageSize,
                        pageNumber: 0,
                        pageSize: this.detailsPage.page.pageSize,
                    },
                    data: this.selectedcardDetails.transactionsList?.items,
                }
                this.setActiveTab(1);
                this.isActiveTab(1);
            }
        }
        )
    }

    getRoutes(): any {
        const routes = [['prePaidCard.name'], ['prePaidCard.prePaidCardList']];
        return routes;
    }

    onError(error: any) {
        const res = error;
        this.errorObj['code'] = res.errorCode;
        this.errorObj['description'] = res.errorDescription;
    }

    activateCard(selectedPrepaidCard) {
        this.prePaidCardService.setPrepaidCardSelected(selectedPrepaidCard);
        this.router.navigate(['/prepaid-card/prepaidcardactivate']);
    }

    getAllTables(): any[] {
        const tablas = [];
        tablas.push(this.table);
        return tablas;
    }


    cardFilterByBin(prepaidCardList: PrepaidCardItem[]): PrepaidCardItem[] {
        return prepaidCardList
            ? prepaidCardList.filter((card) =>
                card.cardNumber.startsWith(PrePaidCardListService.BIN)
            )
            : [];
    }


    isActiveTab(tab) {
        return this.activeTab == tab
    }

    setActiveTab(tab) {
        this.activeTab = tab
        this.getTabsDetails();
    }

    getTabsDetails() {
        switch (this.activeTab) {
            case 1: //Load Refunds
                this.prePaidCardService.setPrepaidCardDetail(this.selectedcardDetails.prepaidCardDetails)
                this.prePaidCardService.setPrepaidCardSelected(this.prepaidCardsList[this.indexSelected])
                this.prePaidCardService.setPaymentTypeFunds(PrePaidCardPaymentService.LOAD_FUNDS_TYPE)
                break
            case 2: //Refund
                this.prePaidCardService.setPaymentTypeFunds(PrePaidCardPaymentService.REFUND_FUNDS_TYPE)
                this.prePaidCardService.setPrepaidCardList(this.prepaidCardsList);
                this.prePaidCardService.setPrepaidCardDetail(this.selectedcardDetails.prepaidCardDetails);
                this.prePaidCardService.setPrepaidCardSelected(this.selectedcard);
                break
            case 3: //Pin Managment
                this.resetPINService.setResetOperationType(PrePaidCardResetPINService.RESET_OP_TYPE)
                this.prePaidCardService.setPrepaidCardList(this.prepaidCardsList);
                this.prePaidCardService.setPrepaidCardDetail(this.selectedcardDetails.prepaidCardDetails);
                this.prePaidCardService.setPrepaidCardSelected(this.selectedcard);
                break
            case 4: //Card Closure Request
                this.prePaidCardBlockService.setBlockOperationType(PrePaidCardBlockService.CLOSURE_OP_TYPE)
                this.prePaidCardService.setPrepaidCardList(this.prepaidCardsList);
                this.prePaidCardService.setPrepaidCardDetail(this.selectedcardDetails.prepaidCardDetails);
                this.prePaidCardService.setPrepaidCardSelected(this.selectedcard);
                break
            case 5: //Stolen / Lost Card
                this.prePaidCardBlockService.setBlockOperationType(PrePaidCardBlockService.STOLEN_OP_TYPE)
                this.prePaidCardService.setPrepaidCardList(this.prepaidCardsList);
                this.prePaidCardService.setPrepaidCardDetail(this.selectedcardDetails);
                this.prePaidCardService.setPrepaidCardSelected(this.selectedcard);
                break
            case 6: //Card Replacement
                this.prePaidCardBlockService.setBlockOperationType(PrePaidCardBlockService.REPLACE_OP_TYPE)
                this.prePaidCardService.setPrepaidCardList(this.prepaidCardsList);
                this.prePaidCardService.setPrepaidCardDetail(this.selectedcardDetails.prepaidCardDetails);
                this.prePaidCardService.setPrepaidCardSelected(this.selectedcard);
                break
            case 7: //Activation Card
                this.prePaidCardService.setPrepaidCardList(this.prepaidCardsList);
                this.prePaidCardService.setPrepaidCardDetail(this.selectedcardDetails.prepaidCardDetails);
                this.prePaidCardService.setPrepaidCardSelected(this.selectedcard);
                break
        }
        this.showTabs = true
    }


    /**
     * @description Table Functions
     *
     * */

    activeTransactions() {
        this.transactionsTab = true;
        this.statementsTab = false;
    }

    setPage(dataTableEvent) {
        if (dataTableEvent == null) {
            dataTableEvent = { offset: 0 };
        }
        this.detailsPage.page.pageNumber = dataTableEvent.offset;
    }

    getIdFunction() {
        return this.getId.bind(this);
    }

    getId(row) {
        return row['id'];
    }

    onSelect({ selected }) {
        this.tableSelectedRows = [];
        this.tableSelectedRows.splice(0, selected.length);
        this.tableSelectedRows.push(...selected);
        this.sharedData.selectedRows = this.tableSelectedRows;
        return this.tableSelectedRows;
    }

    activeDetails() {
        this.statementsTab = true;
        this.transactionsTab = false;
    }

    goToDisplayCardCredentials() {
        this.viewCardCredentialsService.setViewCardCredentialsData(this.params);
        this.router.navigate(['/prepaid-card/prepaidcardlist/viewCardCredentials']);
    }
    showPopUp() {
        this.displayCardCredential.show();
        this.putFocusPin()
    }
    putFocusPin() {
        setTimeout(() => {
            this.focus(4);
        }, 1000);
    }
    sendMessageAndRequestOTPToValidate() {
        if(this.selectedcardDetails['prepaidCardDetails']){
            this.subscriptions.push(
                this.viewCardCredentialsService.sendMessage().subscribe((result) => {
                    if (this.hasError(result)) {
                        this.closePopUp()
                        this.onError(result)
                        return
                    } else {
                        this.showPopUp()
                        this.confirmResponse = result
                    }
                }),
            )
            this.countDown = false;
            clearInterval(this.timerInterval);
            this.form.reset();
            this.focus(4);
            this.getCountdown(1);
        }
    }
    focus(pin) {
        switch (pin) {
            case 1:
                this.pin2.nativeElement.focus()
                break
            case 2:
                this.pin3.nativeElement.focus()
                break
            case 3:
                this.pin4.nativeElement.focus()
                break
            case 4:
                this.pin1.nativeElement.focus()
                break
        }
        if (this.form.valid) {
            this.validateOTP(this.form.value);
        }
    }
    closePopUp() {
        this.countDown = false;
        clearInterval(this.timerInterval);
        this.displayCardCredential.hide();
        this.form.reset()
    };

    getCountdown(minute: number) {
        this.countDown = true;
        let seconds: number = minute * 30;
        let textSec: any = "0";
        let statSec: number = 30;

        const prefix = minute < 10 ? "0" : "";
        this.timerInterval = setInterval(() => {
            seconds--;
            if (statSec != 0) statSec--;
            else statSec = 59;

            if (statSec < 10) {
                textSec = "0" + statSec;
            } else textSec = statSec;

            this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

            if (seconds == 0) {
                this.displayCardCredential.hide();
                clearInterval(this.timerInterval);
            }
        }, 1000);
    }
    resendOTP() {
        this.countDown = false;
        console.warn('cerramosreset');
        clearInterval(this.timerInterval);
        this.getCountdown(1);
    }

    validateOTP(form: FormGroup) {
        const code = form['newPin'] ? form['newPin']['newPin1'] + form['newPin']['newPin2'] + form['newPin']['newPin3'] + form['newPin']['newPin4'] : 0;
        this.requestValidate.otp = code;
        this.closePopUp()
        this.subscriptions.push(
            this.viewCardCredentialsService
                .validateOTP(this.requestValidate, this.selectedcardDetails['prepaidCardDetails']).subscribe((result) => {
                    if (this.hasError(result)) {
                        this.closePopUp()
                        this.onError(result)
                        return
                    } else {
                        const credentialsObject: CredentialsObject = {
                            cardHolderName: result.holderName,
                            expiryDate: result.expiryDate,
                            accountNumber: result.iban,
                            cvv: result.cvv
                        }
                        this.params = this.builtViewCardCredentialsData(credentialsObject)
                        this.displayCardCredential.hide();
                        clearInterval(this.timerInterval);
                        this.goToDisplayCardCredentials()
                    }
                }),
        )

    }
    builtViewCardCredentialsData(credentialsObject: CredentialsObject): ViewCardCredentialsData {
        const routes: any[] = [['prePaidCard.name'], ['prePaidCard.prePaidCardList']]
        const routesString = JSON.stringify(routes)
        const params: ViewCardCredentialsData = {
            accountNumber: credentialsObject.accountNumber,
            cvv: credentialsObject.cvv,
            expiryDate: credentialsObject.expiryDate,
            cardHolderName: credentialsObject.cardHolderName,
            indexSelected: this.indexSelected,
            messageExpired: 'Pre-Paid Cards List.',
            sourcePage: ['/prepaid-card/prepaidcardlist'],
            imageType: ViewCardCredentialsService.PrepaidCards,
            routes: routesString
        }
        return params;
    }

    isSolePropietorCompany() {
        this.subscriptions.push(
            this.viewCardCredentialsService.getCompanyJuridicalState().subscribe((result) => {
                if (this.hasError(result)) {
                    this.onError(result)
                    return
                } else {
                    const juridicalState: string = result['juridicalState'] ? result['juridicalState'] : '';
                    this.isSole = ViewCardCredentialsService.SolePropiertorship.includes(juridicalState);
                }
            }),
        )
    }

    getViewCredentialGroup(): boolean {
        let groupIsActive: boolean = false;
        groupIsActive = this.authenticationService.activateOption(
            'PrepaidCardsMenu',
            ['PREPAID_CARDS_PRIVILEGE'],
            [
                'PrepaidQueryCardCredentials',
            ],
        )
        return groupIsActive;
    }
    ngOnDestroy() {
        clearInterval(this.timerInterval);
      }
}

