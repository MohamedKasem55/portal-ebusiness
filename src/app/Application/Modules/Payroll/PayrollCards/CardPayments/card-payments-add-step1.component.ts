import {Component, OnInit, ViewChild} from '@angular/core'
import {ActivatedRoute, Router} from '@angular/router'
import {TranslateService} from '@ngx-translate/core'
import {RequestValidate} from 'app/Application/Model/requestvalidateType'
import {ResponseGenerateChallenge} from 'app/Application/Model/responsegeneratechallenge.type'
import {Subscription} from 'rxjs'
import {LogService} from '../../../../../core/log/log.service'
// Service
import {DatatableMobileComponent} from '../../../../../core/responsive/datatable-mobile.component'
import {Page} from '../../../../Model/page'
import {PagedData} from '../../../../Model/paged-data'
import {PayrollCardsService} from '../payroll-cards.service'
import {PayrollCardPaymentsService} from './card-payments-service'

@Component({
    selector: 'app-card-payments-add-step1',
    templateUrl: './card-payments-add-step1.component.html',
    styleUrls: ['./card-payments.component.scss'],
})
export class AddCardPaymentsStep1Component
    extends DatatableMobileComponent
    implements OnInit {
    @ViewChild('payrollCardPageTable') table: any
    @ViewChild('payrollCardPageTableStep2') table2: any
    @ViewChild('batchname_v') batchname_v: any

    authorization: any

    @ViewChild('authorization') set content(content) {
        this.authorization = content
    }

    authorizeSubscriptiongetInstitution: Subscription
    authorizeSubscriptiongetInitiateSearch: Subscription
    initiatePayment: Subscription
    waitReceivedParams: Subscription
    waitPreviousMonthDetail: Subscription
    waitLoadPreviousMonthCardList: Subscription
    isCollapsedContent = true
    filterCriteria = ''
    disabledNationalId = false
    cardNumber = false
    //group = "";
    //departments:any = [{}];
    step = 1
    batchname = ''
    establishmentId: string
    receivedParams: any
    dataSetPage = {}
    resultLoadPreviousMonth = []
    finalFileName = ''
    dirArchive: boolean
    molEstablishmentId = ''

    payrollCardPage: PagedData<any>
    payrollCardPageOriginal: PagedData<any>
    tableSelectedRows: any = []
    payrollCardSelectedElementsPage: PagedData<any>

    numberCards = 0
    totalAmount = 0
    expectedFees = 0

    reponseInitiatePayment = [{}]
    generateChallengeAndOTP: ResponseGenerateChallenge
    payrollCardsPayments: any = {}
    requestValidate: RequestValidate

    amount = ''
    salaryBasis = ''
    otherAllowance = ''
    allowanceOthers = ''
    deduction = ''

    newPayments = [{}]
    editing = {}

    searchNationalId = ''
    searchCardNumber = ''
    searchNationalIdData = ''
    searchCardNumberData = ''
    filterCriteriaData = ''
    instituteId: any
    layout: any
    institutionType: any

    constructor(
        public translate: TranslateService,
        public cardPaymentsService: PayrollCardPaymentsService,
        public router: Router,
        public route: ActivatedRoute,
        private serviceshare: PayrollCardsService,
        private logservice: LogService,
    ) {
        super()
        this.requestValidate = new RequestValidate()
        this.payrollCardPage = new PagedData<any>()
        this.payrollCardSelectedElementsPage = new PagedData<any>()
        this.newPayments = []
    }

    getAllTables(): any[] {
        const tablas = []
        if (this.table) {
            tablas.push(this.table)
        }
        if (this.table2) {
            tablas.push(this.table2)
        }
        return tablas
    }

    ngOnInit() {
        super.ngOnInit()
        this.serviceshare.getInstitution().subscribe((result) => {
            if (!result.error) {
                this.instituteId = result.institutionDTO.instituteId
                this.layout = result.institutionDTO.layout
                this.institutionType = result.institutionDTO.institutionType
            }
        })
        this.route.queryParams.subscribe((params) => {
            this.receivedParams = params

            if (this.receivedParams['fileName'] != undefined) {
                // Get group of /payrollCards/getInstitutionNewCard REST Service
                /*
                                    );*/

                const posOnlyName = this.receivedParams.fileName.indexOf('.txt')
                this.finalFileName = this.receivedParams.fileName.substring(
                    0,
                    posOnlyName,
                )
                this.dirArchive = this.receivedParams.dirUploadArchive
                // Service Call
                this.waitPreviousMonthDetail = this.cardPaymentsService
                    .loadPreviousMonthListDetail(this.finalFileName, this.dirArchive)
                    .subscribe((result) => {
                        if (result === null) {
                            this.onError(result)
                            //
                        } else {
                            this.waitPreviousMonthDetail.unsubscribe()

                            this.resultLoadPreviousMonth = result.detailsFile.listDetails
                        }
                        this.setPage(null)
                    })
            } else {
                this.setPage(null)
            }
        })
    }

    searchPayrollCards() {
        this.searchNationalIdData = this.searchNationalId
        this.searchCardNumberData = this.searchCardNumber
        this.filterCriteriaData = this.filterCriteria
        this.setPage(null)
    }

    reset() {
        this.searchNationalId = ''
        this.searchCardNumber = ''
        this.filterCriteria = ''
        this.searchPayrollCards()
    }

    next() {
        if (this.step === 1) {
            this.initiateNewPayment()
        }
        if (this.step === 2) {
            this.initiateNewPaymentConfirm()
        }
        if (this.step === 3) {
            this.step = 1
            this.router.navigate(['payroll/payroll-cards/card-payments'])
        }
    }

    previous() {
        this.step = this.step - 1
        if (this.step === 0) {
            this.step = 1
        }
        if (this.step != 2) {
            this.expectedFees = 0
        }
    }

    // STEP 1 > 2
    initiateNewPayment() {
        // Datatable Data
        this.payrollCardSelectedElementsPage.data = this.tableSelectedRows
        const pageObject = new Page();
        pageObject.pageNumber = 1
        pageObject.pageSize =
            this.tableSelectedRows && this.tableSelectedRows.length
                ? this.tableSelectedRows.length
                : 100
        pageObject.size = this.tableSelectedRows.length
        pageObject.totalElements = this.tableSelectedRows.length
        pageObject.totalPages = pageObject.totalElements / pageObject.pageSize

        this.payrollCardSelectedElementsPage.page = pageObject

        // Fields Data
        this.numberCards = this.payrollCardSelectedElementsPage.data.length
        this.totalAmount = 0
        for (let i = 0; i < this.numberCards; i++) {
            this.totalAmount +=
                +this.payrollCardSelectedElementsPage.data[i]['totalAmount']
        }

        // Create newPayments array

        this.newPayments = []
        for (let i = 0; i < this.tableSelectedRows.length; i++) {
            const newPayment = {
                allowanceOthers: this.tableSelectedRows[i]['allowanceOthers'],
                amount: this.tableSelectedRows[i]['totalAmount'],
                deductions: this.tableSelectedRows[i]['deductions'],
                departmentId: this.tableSelectedRows[i]['departmentId'],
                employees: this.tableSelectedRows[i],
                homeAllowance: this.tableSelectedRows[i]['homeAllowance'],
                salaryBasis: this.tableSelectedRows[i]['salaryBasis'],
                userField: this.tableSelectedRows[i]['userField'],
            }

            this.newPayments.push(newPayment)
        }

        // Request Json
        const data = {
            batchName: this.batchname,
            totalPayemts: this.tableSelectedRows.length,
        }

        ////console.log("Params enviados initiateNewPayment");
        //

        // Call service
        this.initiatePayment = this.cardPaymentsService
            .initiateNewPayment(data)
            .subscribe((result) => {
                if (result === null) {
                    this.onError(result)
                    //
                } else {
                    ////console.log("RESPUESTA INITIATE NEW PAYMENT");
                    //

                    this.reponseInitiatePayment = result.cardsFeesInquiryDTO
                    this.generateChallengeAndOTP = result.generateChallengeAndOTP
                    this.payrollCardsPayments = result.payrollCardsPayments
                    //this.requestValidate = {};

                    for (
                        let i = 0;
                        i <
                        this.reponseInitiatePayment['listPayrollCardsOperationFeesOutDTO']
                            .length;
                        i++
                    ) {
                        this.expectedFees +=
                            this.reponseInitiatePayment[
                                'listPayrollCardsOperationFeesOutDTO'
                                ][i]['expectedFees']
                    }

                    this.initiatePayment.unsubscribe()
                    this.step = this.step + 1
                }
            })
    }

    // STEP 2 > 3
    initiateNewPaymentConfirm() {
        const data: any = {}

        data.cardsFeesInquiryDTO = this.reponseInitiatePayment
        data.listNewPayments = this.newPayments
        data.payrollCardsPayments = this.payrollCardsPayments
        data.totalAmount = this.totalAmount
        data.totalPayemts = this.numberCards
        data.requestValidate = this.requestValidate

        ////console.log("Datos enviados a initiateNewPaymentConfirm");
        //

        this.initiatePayment = this.cardPaymentsService
            .initiateNewPaymentConfirm(data)
            .subscribe((result) => {
                if (result === null) {
                    this.onError(result)
                    //
                } else {
                    //result.cardIncentiveInstitutionsList;
                    this.step = ++this.step % 4

                    this.initiatePayment.unsubscribe()
                }
            })
    }

    onCriteriaChange(target) {
        let value = ''
        if (target && target.value) {
            value = target.value
        }
        this.filterCriteria = value

        if (value === 'nationalId') {
            this.disabledNationalId = true
            this.searchNationalId = ''
            this.cardNumber = false
        }

        if (value === 'cardReferenceNumber') {
            this.cardNumber = true
            this.searchCardNumber = ''
            this.disabledNationalId = false
        }
    }

    updateValue(event, cell, rowIndex) {
        if (this.layout === 'wps') {
            const selectedChangedRow = this.payrollCardPage.data[rowIndex];
            // let existedIndex = NaN;
            if (this.tableSelectedRows.length > 0) {
                this.tableSelectedRows.forEach((oldSelected, oldIndex) => {
                    if (oldSelected.cardNumber === selectedChangedRow.cardNumber) {
                        this.tableSelectedRows[oldIndex] = selectedChangedRow;
                    }
                });
            }
            this.payrollCardPage.data[rowIndex][cell] = event.target.value
            this.payrollCardPage.data[rowIndex]['totalAmount'] =
                (this.payrollCardPage.data[rowIndex]['salaryBasis']
                    ? +this.payrollCardPage.data[rowIndex]['salaryBasis']
                    : 0) +
                (this.payrollCardPage.data[rowIndex]['homeAllowance']
                    ? +this.payrollCardPage.data[rowIndex]['homeAllowance']
                    : 0) +
                (this.payrollCardPage.data[rowIndex]['allowanceOthers']
                    ? +this.payrollCardPage.data[rowIndex]['allowanceOthers']
                    : 0) -
                (this.payrollCardPage.data[rowIndex]['deductions']
                    ? +this.payrollCardPage.data[rowIndex]['deductions']
                    : 0)
        } else {
            this.payrollCardPage.data[rowIndex][cell] = event.target.value
            this.payrollCardPage.data[rowIndex]['totalAmount'] =
                this.payrollCardPage.data[rowIndex]['totalAmount']
        }
        this.payrollCardPage.data = [...this.payrollCardPage.data]
    }

    setPage(dataTableEvent) {
        ////console.log("Parametros recividos: ", this.receivedParams);

        if (dataTableEvent == null) {
            dataTableEvent = {offset: 0}
        }

        this.payrollCardPage.page.pageNumber = dataTableEvent.offset

        if (this.receivedParams['fileName'] != undefined) {
            const data = {
                cardReferenceNumber: this.searchCardNumberData,
                dirUploadArchive: false,
                fileName: this.finalFileName,
                nationalId: this.searchNationalIdData,
                page: this.payrollCardPage.page.pageNumber + 1,
                rows: this.payrollCardPage.page.pageSize,
                selectedIncentiveCards: 'string',
            }

            ////console.log("Params loadPreviousMonthCardList");
            //

            // Service Call
            this.waitLoadPreviousMonthCardList = this.cardPaymentsService
                .loadPreviousMonthCardList(data)
                .subscribe((result) => {
                    if (result === null) {
                        this.onError(result)
                        //
                    } else {
                        ////console.log('actuales',result.cardIncentiveInstitutionsList.cardIncentiveInstitutionsList);
                        ////console.log('antiguos',this.resultLoadPreviousMonth);
                        this.payrollCardPage.data = this.completeDataLastMonth(
                            result.cardIncentiveInstitutionsList
                                .cardIncentiveInstitutionsList,
                            this.resultLoadPreviousMonth,
                        )

                        const pageObject = new Page()

                        pageObject.pageNumber = this.payrollCardPage.page.pageNumber + 1
                        pageObject.pageSize = this.payrollCardPage.page.pageSize
                        pageObject.size = result.cardIncentiveInstitutionsList.size
                        pageObject.totalElements =
                            result.cardIncentiveInstitutionsList.total
                        pageObject.totalPages =
                            pageObject.totalElements / pageObject.pageSize

                        this.payrollCardPage.page = pageObject

                        this.molEstablishmentId =
                            result.cardIncentiveInstitutionsList['molEstablishmentId']

                        ////console.log("----------  RESULT  loadPreviousMonthCardList  ---------------------------");
                        ////console.log(this.payrollCardPage);
                        ////console.log("-------------------------------------");

                        this.payrollCardPageOriginal = JSON.parse(
                            JSON.stringify(this.payrollCardPage),
                        )
                        // //console.log("Copy of pagedData: ", this.payrollCardPageOriginal);
                        // //console.log("Are they equal: ", this.payrollCardPageOriginal.data === this.payrollCardPage.data);

                        this.waitLoadPreviousMonthCardList.unsubscribe()
                        //this.onSelect({ selected: this.tableSelectedRows });
                    }
                })
        } else {
            const data = {
                cardReferenceNumber: this.searchCardNumberData,
                departmentCode: '',
                nationalId: this.searchNationalIdData,
                page: this.payrollCardPage.page.pageNumber + 1,
                rows: this.payrollCardPage.page.pageSize,
                selectedIncentiveCards: this.filterCriteria,
            }

            ////console.log("Params getInitiateSearch");
            //

            // Service Call
            this.authorizeSubscriptiongetInitiateSearch = this.cardPaymentsService
                .searchInitiatePayment(data)
                .subscribe((result) => {
                    if (result === null) {
                        this.onError(result)
                        //
                    } else {
                        // Datatable Data
                        this.payrollCardPage.data = result.cardIncentiveInstitutionsList
                        if (this.tableSelectedRows != null) {
                            this.tableSelectedRows.forEach((oldSelected, oldIndex) => {
                                this.payrollCardPage.data.forEach((obj, index) => {
                                    if (oldSelected.cardNumber === obj.cardNumber) {
                                        this.payrollCardPage.data[index] = oldSelected;
                                    }
                                });
                            });
                        }
                        const pageObject = new Page()

                        pageObject.pageNumber = this.payrollCardPage.page.pageNumber + 1
                        pageObject.pageSize = this.payrollCardPage.page.pageSize
                        pageObject.size = result.size
                        pageObject.totalElements = result.total
                        pageObject.totalPages =
                            pageObject.totalElements / pageObject.pageSize

                        this.payrollCardPage.page = pageObject

                        this.molEstablishmentId = result['molEstablishmentId']

                        this.authorizeSubscriptiongetInitiateSearch.unsubscribe()

                        this.payrollCardPageOriginal = JSON.parse(
                            JSON.stringify(this.payrollCardPage),
                        )
                    }
                })
        }
    }

    completeDataLastMonth(pages, data) {
        const toSelect = []
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < pages.length; j++) {
                ////console.log(data[i]['nationalID'],'==',pages[j]['nationalId']);
                if (data[i]['nationalID'] == pages[j]['nationalId']) {
                    ////console.log(data[i]['nationalID'],data[i]['amountFormated'],data[i]['salaryBasicFormated'],data[i]['housingAllowanceFormated'],data[i]['otherAllowanceFormated']);
                    pages[j]['totalAmount'] = data[i]['amountFormated']
                    pages[j]['salaryBasis'] = data[i]['salaryBasicFormated']
                    pages[j]['homeAllowance'] = data[i]['housingAllowanceFormated']
                    pages[j]['allowanceOthers'] = data[i]['otherAllowanceFormated']
                    pages[j]['deductions'] = data[i]['deductionFormated']

                    toSelect.push(pages[j])
                    break
                }
            }
        }
        this.tableSelectedRows.splice(0, this.tableSelectedRows.length)
        this.tableSelectedRows.push(...toSelect)
        return pages
    }

    onError(result) {
        this.logservice.log.error(result)
    }

    onSelect({selected}) {
        if (selected === undefined) {
            return
        }
        this.tableSelectedRows.forEach((oldSelected, oldIndex) => {
            selected.forEach((obj, index) => {
                if (oldSelected.cardNumber === obj.cardNumber) {
                    this.tableSelectedRows[oldSelected] = selected[index];
                }
            });
        });
    }

    valid() {
        if (this.authorization) {
            return this.authorization.valid()
        } else {
            return true
        }
    }

    validFirst() {
        let notAmount = false
        //
        for (let i = 0; i < this.tableSelectedRows.length; i++) {
            if (
                !this.tableSelectedRows[i].totalAmount ||
                !(this.tableSelectedRows[i].totalAmount > 0)
            ) {
                notAmount = true
                break
            }
        }

        return (
            !this.tableSelectedRows || this.tableSelectedRows.length < 1 || notAmount
        )
    }

    isPending() {
        if (
            this.generateChallengeAndOTP &&
            (this.generateChallengeAndOTP.typeAuthentication === 'STATIC' ||
                this.generateChallengeAndOTP.typeAuthentication === 'OTP' ||
                this.generateChallengeAndOTP.typeAuthentication === 'CHALLENGE')
        ) {
            return false
        } else {
            return true
        }
    }

    getId(row) {
        if (row) {
            return row['cardNumber']
        }
    }

    getIdFunction() {
        return this.getId.bind(this)
    }

    validateNoSpacesOnBatchName(event) {
        if (event['code'] === 'Space') {
            return false
        }
    }
}
