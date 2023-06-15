import {Component, ViewChild} from '@angular/core';
import {Account} from "../../../../Model/account";

import {CurrentAccountsService} from "../../../Accounts/accounts-current-account/accounts-current-account.service";
import {BillPaymentService} from "../bill-payments/bill-payment.service";
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
import {BillDetailsPaymentsComponent} from "../bill-details/bill-detail.component";


@Component({
    selector: 'arb-bulk-bill-payments',
    templateUrl: './bulk-bill-payments.component.html',
    styleUrls: ['./bulk-bill-payments.component.scss']
})
export class BulkBillPaymentsComponent extends AbstractWizardInitiatorModifyComponent {


    @ViewChild('sheetImporterComponent')
    sheetImporterComponent: SheetImporterComponent

    @ViewChild('BillDetailsPayments')
    billDetailsPayments: BillDetailsPaymentsComponent

    public columns = ['billCode', 'billName', 'billRef', 'amount']
    public accounts: Array<Account> = new Array<Account>()
    public selectedAccount: Account
    public isFileUploaded: boolean = false
    public bills: any = []
    public file: any = {name: ''}
    public totalAmount = 0
    public generateChallengeAndOTP: ResponseGenerateChallenge
    public requestValidate = new RequestValidate()
    public batchListsContainer: any
    public isAuthorized = false

    constructor(
        public translate: TranslateService,
        public accountService: CurrentAccountsService,
        private billPaymentService: BillPaymentService,
        public fb: FormBuilder,
        public staticService: StaticService,
        public router: Router,
        private smq: SimpleMQ,
        private datePipe: DatePipe,
    ) {
        super(fb, staticService, translate, router)
    }

    ngAfterViewInit() {
        super.ngAfterViewInit();
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

    validateUpdatedBills() {
        let updatedBills = [];

        this.bills.forEach(item => {
            if (item.amountWithoutVat ? item.amountWithoutVat != Number(item.billAmount) : item.amount != Number(item.billAmount)) {
                item.amount = item.billAmount
                updatedBills.push(item)
                this.totalAmount = this.totalAmount - Number(item.amountPayment)
            }
        })

        if (updatedBills.length > 0) {
            this.billPaymentService.validate(this.selectedAccount, updatedBills).subscribe(result => {

                let UpdatedBills = []
                if (result.batchListsContainer.toAuthorize.length > 0) {
                    UpdatedBills = result.batchListsContainer.toAuthorize
                } else {
                    UpdatedBills = result.batchListsContainer.toProcess
                }

                this.totalAmount += Number(result.total.totalAmountToProcess) + Number(result.total.totalAmountToAuthorize)

                UpdatedBills.forEach(itemOfUpdatedBills => {
                    itemOfUpdatedBills.billAmount = itemOfUpdatedBills.amountWithoutVat ? itemOfUpdatedBills.amountWithoutVat : itemOfUpdatedBills.amount
                    this.bills.forEach(bill => {
                        if (bill.billCode === itemOfUpdatedBills.billCode && bill.billRef === itemOfUpdatedBills.billRef) {
                            bill.amount = itemOfUpdatedBills.amount
                            bill.amountOriginal = itemOfUpdatedBills.amountOriginal
                            bill.amountPayment = itemOfUpdatedBills.amountPayment
                            bill.amountWithoutVat = itemOfUpdatedBills.amountWithoutVat
                            bill.futureStatus = itemOfUpdatedBills.futureStatus
                            bill.nextStatus = itemOfUpdatedBills.nextStatus
                            bill.paymentType = itemOfUpdatedBills.paymentType
                            bill.process = itemOfUpdatedBills.process
                            bill.vatAmount = itemOfUpdatedBills.vatAmount
                        }
                    })
                })
                setTimeout(
                    () =>
                        window.scrollTo(0, 0),
                    100,
                )
                this.wizardStep++

            })
        } else {
            setTimeout(
                () =>
                    window.scrollTo(0, 0),
                100,
            )
            this.wizardStep++
        }
    }

    validationBills() {
        this.sheetImporterComponent.getJson().then((result: any) => {
            let bills = []
            let errorList = []
            let rowCount = 0
            result.forEach(item => {
                rowCount++
                if (item.billCode) {
                    item.amount = item.amount ? item.amount : 1
                    item.nickname = ''
                    item.dueDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
                    let code = item.billCode.split("(")
                    item.billCode = code[code.length - 1].replace(")", "")
                    bills.push(item);
                }
                if (!item.billCode && item.billName) {
                    errorList.push(rowCount + ": " + item.billName)
                }
            })
            if (errorList.length > 0) {
                this.translate.get('oneTimePayment.invalidName').subscribe((value) => {
                    this.smq.publish('error-mq-Lines', {message: value, lines: errorList})
                })
            }
            if (bills.length < 200) {
                this.billPaymentService.validate(this.selectedAccount, bills).subscribe(bills => {
                    if (bills.errorCode == '0') {
                        this.wizardStep++
                        this.batchListsContainer = bills.batchListsContainer
                        if (bills.batchListsContainer.toAuthorize.length > 0) {
                            this.bills = bills.batchListsContainer.toAuthorize
                        } else {
                            this.bills = bills.batchListsContainer.toProcess
                        }
                        this.bills.forEach(item => {
                            item.billAmount = item.amountWithoutVat ? item.amountWithoutVat : item.amount
                        })
                        this.totalAmount = Number(bills.total.totalAmountToProcess) + Number(bills.total.totalAmountToAuthorize)
                        this.generateChallengeAndOTP = bills.generateChallengeAndOTP
                        setTimeout(
                            () =>
                                window.scrollTo(0, 0),
                            100,
                        )


                    }
                })
            } else {
                this.translate.get('oneTimePayment.maxError').subscribe((value) => {
                    this.smq.publish('error-mq', value)
                })

            }
        })
    }

    payBills() {
        if (this.batchListsContainer.toAuthorize.length > 0) {
            this.batchListsContainer.toAuthorize = this.bills
        } else {
            this.batchListsContainer.toProcess = this.bills
        }
        this.billPaymentService.payBills(this.batchListsContainer, this.generateChallengeAndOTP, this.requestValidate).subscribe(result => {
            if (!result.error) {
                if (result.billPayProcessList?.length > 0) {
                    this.isAuthorized = true
                    this.bills.forEach(item => {
                        let bill = result.billPayProcessList.find(bill => bill.billCodeSelected === item.billCode && bill.billReference === item.billRef);
                        item.returnCode = bill.returnCode
                    })
                }
                this.wizardStep++
            }
        });
    }

    next() {
        switch (this.wizardStep) {
            case 1:
                this.validationBills()
                break
            case 2:
                this.validateUpdatedBills()
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
                return this.billDetailsPayments.isValidAuthorization()
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
        this.router.navigateByUrl('/payments/oneTimePayment/bulk').then(r => {
        })
    }

    download() {
        this.billPaymentService.getFile().subscribe(res => {
                if (!res.errorCode) {
                    saveAs(res.file, res.fileName)
                }
            }
        )
    }
}
