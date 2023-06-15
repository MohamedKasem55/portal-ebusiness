import {Component, ViewChild} from '@angular/core';
import {Account} from "../../../../Model/account";

import {CurrentAccountsService} from "../../../Accounts/accounts-current-account/accounts-current-account.service";
import {
    AbstractWizardInitiatorModifyComponent
} from "../../../Common/Components/Abstract/Initiator/abstract-wizard-initiator-modify.component";
import {FormBuilder} from "@angular/forms";
import {StaticService} from "../../../Common/Services/static.service";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {SheetImporterComponent} from "../../../../Components/common/sheet-importer/sheet-importer.component";
import {ResponseGenerateChallenge} from "../../../../Model/responsegeneratechallenge.type";
import {RequestValidate} from "../../../../Model/requestvalidateType";
import {SimpleMQ} from "ng2-simple-mq";
import {saveAs} from "file-saver";
import {DatePipe} from "@angular/common";
import {BulkPaymentsService} from "./bulk-payments.service";
import {BulkErrorComponent} from "./bulk-error/bulk-error.component";


@Component({
    selector: 'arb-bulk-payments',
    templateUrl: './bulk-payments.component.html',
    styleUrls: ['./bulk-payments.component.scss']
})
export class BulkPaymentsComponent extends AbstractWizardInitiatorModifyComponent {


    @ViewChild('sheetImporterComponent') sheetImporterComponent: SheetImporterComponent
    @ViewChild('errorModal', {static: true}) bulkErrorComponent: BulkErrorComponent
    @ViewChild('authorization', {static: true}) authorization: any


    public defaultHeight: any = 'auto'
    public columns = ['ServiceCode', 'JobCategoryCode', 'ServiceName', 'IqamaID', 'IqamaDuration', 'VisaDuration', 'SponsorID', 'JobCategory', 'Amount']
    public accounts: Array<Account> = new Array<Account>()
    public selectedAccount: Account
    public isFileUploaded: boolean = false
    public bills: any = []
    public billsBatchInquiry: any = []
    public billsBatchValidate: any = []
    public file: any = {name: ''}
    public totalAmount = 0
    public generateChallengeAndOTP: ResponseGenerateChallenge
    public requestValidate = new RequestValidate()
    public isAuthorized = false
    public errorList: any = []
    public applicationsTypes: any = []

    constructor(
        public translate: TranslateService,
        public accountService: CurrentAccountsService,
        public fb: FormBuilder,
        public staticService: StaticService,
        public router: Router,
        private smq: SimpleMQ,
        private datePipe: DatePipe,
        private bulkPaymentsService: BulkPaymentsService
    ) {
        super(fb, staticService, translate, router)
    }

    ngAfterViewInit() {
        super.ngAfterViewInit()
        this.getAccounts()
    }


    onAccountChange(event) {
        this.selectedAccount = event
    }


    private getAccounts() {
        this.accountService.getAccounts('ECIA').pipe().subscribe((result: any) => {
            this.accounts = result
        })
    }

    validateBills() {
        this.sheetImporterComponent.getJson().then((result: any) => {
            this.bills = []
            let rowCount = 0
            if (result.length > 200) {
                this.translate.get('MOIBulkPayment.maxError').subscribe((value) => {
                    this.smq.publish('error-mq', value)
                })
            } else {
                result.forEach(item => {
                        rowCount++
                        if (item.ServiceName) {
                            if (item.ServiceCode && item.ServiceCode.includes('-')) {
                                let bill: any = {}
                                bill.accountNumber = this.selectedAccount.fullAccountNumber
                                bill.serviceType = item.ServiceCode.split('-')[0]
                                bill.applicationType = item.ServiceCode.split('-')[1]
                                bill.transactionType = "P"

                                switch (bill.applicationType) {
                                    case '004':
                                    case '005':
                                        this.getExitEntry(bill, item, rowCount)
                                        break
                                    case '002':
                                        this.geIssueIqama(bill, item, rowCount)
                                        break
                                    case '003':
                                        this.geRenewIqama(bill, item, rowCount)
                                        break
                                    default:
                                        this.translate.get(['MOIBulkPayment.invalidService', 'MOIBulkPayment.serviceName']).subscribe((value) => {
                                            this.errorList.push({
                                                row: rowCount,
                                                message: Object.values(value)[0],
                                                filedName: Object.values(value)[1],
                                                filedData: bill.ServiceName
                                            })
                                        })
                                        break
                                }
                            } else {
                                this.errorList.push({
                                    message: 'MOIBulkPayment.invalidService',
                                    filedName: 'MOIBulkPayment.serviceName',
                                    filedData: item.ServiceName,
                                    row: rowCount
                                })
                            }
                        }
                    }
                )
                if (this.errorList.length > 0) {
                    console.log(this.errorList)
                    this.bulkErrorComponent.showModal()
                } else {
                    if (this.bills.length > 0) {
                        this.prepareBulkAlienControl()
                    } else {
                        this.translate.get('MOIBulkPayment.invalidSheet').subscribe((value) => {
                            this.smq.publish('error-mq', value)
                        })
                    }
                }
            }
        })
    }

    getExitEntry(bill, item, rowCount) {

        let iqamaError = this.checkIqama(item)
        let durationError = this.checkVisaDuration(item)
        let amountError = this.checkAmount(item)

        if (!iqamaError && !durationError && !amountError) {
            bill.iqamaId = item.IqamaID
            bill.visaDuration = item.VisaDuration.toString().padStart(4, '0')
            bill.amount = item.Amount
            this.bills.push(bill)
        } else {
            this.pushError(rowCount, iqamaError, durationError, amountError, null)
        }
    }

    geIssueIqama(bill, item, rowCount) {

        let iqamaError = this.checkIqama(item)
        let durationError = this.checkIqamaDuration(item)
        let amountError = this.checkAmount(item)
        let sponsorIDError = this.checkSponsorID(item)
        let jobCategoryError = this.checkJobCategory(item)

        if (!iqamaError && !durationError && !amountError && !sponsorIDError && !jobCategoryError) {
            bill.borderNumber = item.IqamaID
            bill.iqamaDuration = item.IqamaDuration
            bill.sponsorId = item.SponsorID
            bill.jobCategory = item.JobCategoryCode
            bill.amount = item.Amount
            this.bills.push(bill)
        } else {
            this.pushError(rowCount, iqamaError, durationError, amountError, sponsorIDError)
        }
    }

    geRenewIqama(bill, item, rowCount) {

        let iqamaError = this.checkIqama(item)
        let durationError = this.checkIqamaDuration(item)
        let amountError = this.checkAmount(item)

        if (!iqamaError && !durationError && !amountError) {
            bill.iqamaId = item.IqamaID
            bill.iqamaDuration = item.IqamaDuration
            bill.amount = item.Amount
            this.bills.push(bill)
        } else {
            this.pushError(rowCount, iqamaError, durationError, amountError, null)
        }
    }

    pushError(rowCount, iqamaError, durationError, amountError, sponsorIDError) {
        if (iqamaError) {
            iqamaError.row = rowCount
            this.errorList.push(iqamaError)
        }
        if (durationError) {
            durationError.row = rowCount
            this.errorList.push(durationError)
        }
        if (amountError) {
            amountError.row = rowCount
            this.errorList.push(amountError)
        }
        if (sponsorIDError) {
            sponsorIDError.row = rowCount
            this.errorList.push(sponsorIDError)
        }
    }

    checkIqama(item) {
        if (!item.IqamaID || item.IqamaID?.toString().length != 10) {
            return {
                message: 'MOIBulkPayment.invalidIqamaID',
                filedName: 'MOIBulkPayment.iqamaID',
                filedData: item.IqamaID
            }
        }
        return null
    }

    checkVisaDuration(item) {
        if (!item.VisaDuration) {
            return {
                message: 'MOIBulkPayment.invalidVisaDuration',
                filedName: 'MOIBulkPayment.visaDuration',
                filedData: item.VisaDuration
            }
        }
        return null
    }

    checkIqamaDuration(item) {
        if (!item.IqamaDuration) {
            return {
                message: 'MOIBulkPayment.invalidIqamaDuration',
                filedName: 'MOIBulkPayment.iqamaDuration',
                filedData: item.IqamaDuration
            }
        }
        return null
    }

    checkAmount(item) {
        if (!item.Amount || item.Amount == 0 || !parseFloat(item.Amount)) {
            return {
                message: 'MOIBulkPayment.invalidAmount',
                filedName: 'MOIBulkPayment.amount',
                filedData: item.Amount
            }
        }
        return null
    }

    checkSponsorID(item) {
        if (!item.SponsorID || item.SponsorID?.toString().length != 10) {
            return {
                message: 'MOIBulkPayment.invalidSponsorID',
                filedName: 'MOIBulkPayment.sponsorID',
                filedData: item.SponsorID
            }
        }
        return null
    }

    checkJobCategory(item) {
        if (!item.JobCategoryCode) {
            return {
                message: 'MOIBulkPayment.invalidJobCategory',
                filedName: 'MOIBulkPayment.jobCategory',
                filedData: item.JobCategoryCode
            }
        }
        return null
    }

    prepareBulkAlienControl() {
        this.bulkPaymentsService.prepareBulkAlienControl(this.bills).subscribe(result => {
            if (result) {
                this.wizardStep++
                this.billsBatchInquiry = result.batch
            }
        })
    }


    payBills() {
        const data = {
            batchList: this.billsBatchValidate,
            requestValidate: this.requestValidate,
        }
        this.bulkPaymentsService.confirm(data).subscribe(result => {
            if (result) {
                this.wizardStep++
            }
        })
    }

    validate() {
        this.setAmount()
        this.bulkPaymentsService.validate({batchList: this.billsBatchInquiry}).subscribe(result => {
            if (result) {
                this.wizardStep++
                this.generateChallengeAndOTP = result.generateChallengeAndOTP
                this.billsBatchValidate = result.batchList
                this.isAuthorized = !(this.billsBatchValidate.toAuthorize.length > 0)
                this.bills.forEach(billItem => {
                    this.billsBatchValidate.toProcess.forEach(item => {
                        this.fillDetails(item, billItem)
                    })
                    this.billsBatchValidate.toAuthorize.forEach(item => {
                        this.fillDetails(item, billItem)
                    })
                    this.billsBatchValidate.notAllowed.forEach(item => {
                        this.fillDetails(item, billItem)
                    })
                })
            }
        })
    }

    fillDetails(item, billItem) {
        if (this.checkIfDetailsExist(item.details, billItem.iqamaId, billItem.borderNumber) && this.checkIfDetailsExist(item.details, billItem.visaDuration, billItem.iqamaDuration) && billItem.applicationType == item.applicationType && billItem.serviceType == item.serviceType) {
            item.borderNumber = billItem.borderNumber
            item.iqamaId = billItem.iqamaId
            item.visaDuration = billItem.visaDuration
            item.iqamaDuration = billItem.iqamaDuration
            item.sponsorId = billItem.sponsorId
            item.jobCategory = billItem.jobCategory
        }
    }

    setAmount() {
        this.billsBatchInquiry.forEach(item => {
            this.bills.forEach(billItem => {
                if (this.checkIfDetailsExist(item.details, billItem.iqamaId, billItem.borderNumber) && this.checkIfDetailsExist(item.details, billItem.visaDuration, billItem.iqamaDuration) && billItem.applicationType == item.applicationType && billItem.serviceType == item.serviceType) {
                    item.amount = billItem.amount
                    item.fees = this.setFess(billItem.applicationType, billItem.amount)
                }
            })
        })
    }


    setFess(applicationType, amount) {
        let fees = [{
            batch: null,
            egovSadadFeesPk: null,
            feeAmount: amount,
            feeType: ''
        }]
        switch (applicationType) {
            case '002':
                fees[0].feeType = 'Issue Iqamah Fees'
                break
            case '003':
                fees[0].feeType = 'Renew Iqamah Fees'
                break
            case '004':
                fees[0].feeType = 'Issue Single Exit/reentry Visa'
                break
            case '005':
                fees[0].feeType = 'Issue multiple exit/reentry visa'
                break
        }
        return fees
    }


    checkIfDetailsExist(details, value, value2) {
        let flag = false
        details.forEach(item => {
            if (item.value == value || item.value == value2) {
                flag = true
            }
        })
        return flag
    }

    next() {
        switch (this.wizardStep) {
            case 1:
                this.validateBills()
                break
            case 2:
                this.validate()
                break
            case 3:
                this.payBills()
                break
        }
    }


    back() {
        switch (this.wizardStep) {
            case 1:
                this.router.navigate(['/payments/oneTimePayment']).then(r => {
                });
                break
            case 2:
            case 3:
                this.wizardStep--
                break
        }
    }

    fileUploaded(event) {
        this.file = event
        this.isFileUploaded = true
    }

    isValid() {
        switch (this.wizardStep) {
            case 1:
                return this.isFileUploaded && this.selectedAccount.fullAccountNumber
                break
            case 2:
                return true
                break
            case 3:
                return this.generateChallengeAndOTP ? this.requestValidate.valid() : true
                break
        }
    }

    isDisabled() {
    }

    delete(event) {
        let bill = event.bill
        let index = event.index
        this.bills.splice(index, 1)
        this.totalAmount = this.totalAmount - bill.amount
    }


    finish() {
        this.router.navigateByUrl('/').then(r => {
        })
    }

    goToPay() {
        this.router.navigateByUrl('/').then(r => {
            this.router.navigateByUrl('/payments/moi/bulk-payments').then(r => {
            })
        })
    }

    download() {

        this.bulkPaymentsService.getDownloadedFile('MOI-Bulk_payment-' + this.translate.currentLang + '.xlsx').subscribe(res => {
                if (!res.errorCode) {
                    saveAs(res.file, 'MOI-Bulk_payment.xlsx')
                }
            }
        )
    }

    closeModal() {
        this.errorList = []
        this.file = {name: ''}
        this.isFileUploaded = false
        this.sheetImporterComponent.deleteFile()
    }

}