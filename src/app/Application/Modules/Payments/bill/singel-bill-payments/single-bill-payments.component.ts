import {Component, ViewChild} from '@angular/core';
import {Account} from "../../../../Model/account";

import {CurrentAccountsService} from "../../../Accounts/accounts-current-account/accounts-current-account.service";
import {BillPaymentService} from "../bill-payments/bill-payment.service";
import {
    AbstractWizardInitiatorModifyComponent
} from "../../../Common/Components/Abstract/Initiator/abstract-wizard-initiator-modify.component";
import {FormBuilder, Validators} from "@angular/forms";
import {StaticService} from "../../../Common/Services/static.service";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {ResponseGenerateChallenge} from "../../../../Model/responsegeneratechallenge.type";
import {RequestValidate} from "../../../../Model/requestvalidateType";
import {DatePipe} from "@angular/common";


@Component({
    selector: 'arb-single-bill-payments',
    templateUrl: './single-bill-payments.component.html',
    styleUrls: ['./single-bill-payments.component.scss']
})
export class SingleBillPaymentsComponent extends AbstractWizardInitiatorModifyComponent {


    authorization: any

    @ViewChild('authorization') set content(content) {
        this.authorization = content
    }


    public accounts: Array<Account> = new Array<Account>()
    public bill: any = {}
    public generateChallengeAndOTP: ResponseGenerateChallenge
    public requestValidate = new RequestValidate()
    public providers: []
    public batchListsContainer: any = []
    public totalAmount = 0
    public isAuthorized = false

    constructor(
        public translate: TranslateService,
        public accountService: CurrentAccountsService,
        private billPaymentService: BillPaymentService,
        public fb: FormBuilder,
        public staticService: StaticService,
        public router: Router,
        private datePipe: DatePipe,
    ) {
        super(fb, staticService, translate, router)
        this.buildForm()
    }

    ngAfterViewInit() {
        super.ngAfterViewInit();
        this.getServiceProvider()
        this.getAccounts()
    }

    buildForm() {
        this.formModel = this.fb.group({
            serviceProvider: [null, [Validators.required]],
            billNumber: [null, [Validators.required]],
            account: [null, [Validators.required]],
        })
    }

    getServiceProvider() {
        this.billPaymentService.getBillCodes().subscribe(result => {
            if (!result.error) {
                this.providers = result.billCodes
            }
        })
    }

    private getAccounts() {
        this.accountService.getAccounts('ECIA').pipe().subscribe((result: any) => {
            this.accounts = result
        })
    }

    onAccountChange(event) {
        this.formModel.controls.account.setValue(event)
    }


    next() {
        switch (this.wizardStep) {
            case 1:
                this.validationBills()
                break
            case 2:
                this.validationBills()
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


    isValid() {
        switch (this.wizardStep) {
            case 1:
                return this.formModel.valid
                break
            case 2:
                return true
                break
            case 3:
                if (this.authorization) {
                    return this.authorization.valid()
                }
                return true
                break
        }
    }

    isDisabled() {
    }


    finish() {
        this.router.navigateByUrl('/').then(r => {
        })
    }

    goToPay() {
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
        this.router.navigate(['/payments/oneTimePayment/single']));
    }

    cancel() {
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
        this.router.navigate(['/payments/oneTimePayment/single']));
    }

    validationBills() {
        this.bill.billCode = this.formModel.controls.serviceProvider.value.billCode
        this.bill.billRef = this.formModel.controls.billNumber.value
        if(this.wizardStep===1)
            this.bill.amount = this.bill.billAmount ? this.bill.billAmount : this.bill.amount ? this.bill.amount : 1;
        if(this.wizardStep===2)
            this.bill.amount = this.bill.billAmount ? this.bill.billAmount : this.bill.amountOriginal
        this.bill.dueDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
        this.bill.nickname = ''
        this.billPaymentService.validate(this.formModel.controls.account.value, [this.bill],this.wizardStep).subscribe(bills => {
            if (bills.errorCode == '0') {
                this.wizardStep++
                this.batchListsContainer = bills.batchListsContainer
                if (bills.batchListsContainer.toAuthorize.length > 0) {
                    this.bill = bills.batchListsContainer.toAuthorize[0]
                } else {
                    this.bill = bills.batchListsContainer.toProcess[0]
                }
                this.totalAmount = Number(bills.total.totalAmountToProcess) + Number(bills.total.totalAmountToAuthorize)
                this.generateChallengeAndOTP = bills.generateChallengeAndOTP
                this.bill.billAmount = this.bill.amountWithoutVat
            }
        })
    }

    payBills() {
        if (this.batchListsContainer.toAuthorize.length > 0) {
            this.batchListsContainer.toAuthorize = [this.bill]
        } else {
            this.batchListsContainer.toProcess = [this.bill]
        }
        this.billPaymentService.payBills(this.batchListsContainer, this.generateChallengeAndOTP, this.requestValidate).subscribe(result => {
            if (!result.error) {
                if (result.billPayProcessList?.length > 0) {
                    this.isAuthorized = true
                    let bill = result.billPayProcessList.find(bill => bill.billCodeSelected === this.bill.billCode && bill.billReference === this.bill.billRef);
                    this.bill.returnCode = bill.returnCode
                }
                this.wizardStep++
            }
        });
    }
}
