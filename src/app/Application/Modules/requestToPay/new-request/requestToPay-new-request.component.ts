import {Component} from '@angular/core'
import {Router} from '@angular/router'
import {TranslateService} from '@ngx-translate/core'
import {RequestToPayService} from '../requestToPay.service'
import {AbstractWizardComponent} from '../../Common/Components/Abstract/abstract-wizard.component'
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms'
import {ResponseGenerateChallenge} from '../../../Model/responsegeneratechallenge.type'
import {RequestValidate} from '../../../Model/requestvalidateType'
import {CommonValidators} from '../../Common/constants/common-validators.service'
import {ProxyTypes} from '../../Transfers/Model/ProxyTypes'
import {SimpleMQ} from 'ng2-simple-mq'

@Component({
    selector: 'app-requestToPay',
    templateUrl: './requestToPay-new-request.component.html',
    styleUrls: ['./requestToPay-new-request.component.scss'],
})
export class RequestToPayNewRequestComponent extends AbstractWizardComponent {

    public pageType = 'STEEPER'
    public generateChallengeAndOTP: ResponseGenerateChallenge = new ResponseGenerateChallenge()
    public requestValidate: RequestValidate = new RequestValidate()
    public formModel: FormGroup
    public purposes: any[] = []
    public beneficiaries: any[] = []
    public selectedAccount: any = {}
    public accounts: any[]
    public ibanText: string = ''
    public tabName: string
    public banks: any[] = []
    public isSuccess: boolean = false
    public maxValidatyDays: number
    private selectedBeneficiary: any
    private proxyTypes: ProxyTypes = new ProxyTypes(['IBAN', 'ID', 'email', 'mobile'])
    private selectedProxy: any
    private transferLimit: number

    constructor(
        public fb: FormBuilder,
        public router: Router,
        private smq: SimpleMQ,
        public translate: TranslateService,
        public commonValidators: CommonValidators,
        public requestToPayService: RequestToPayService) {
        super(fb, translate, router)
    }

    ngOnInit(): void {
        this.wizardStep = 1
        this.requestToPayService.initiateRTP().subscribe(result => {
            if (result.errorCode == '0') {
                this.accounts = result.listAccount
                this.maxValidatyDays = result.maxValidatyDays
                this.transferLimit = result.maxRequestLimit
                this.createForm()
            }
        })
        this.getTransferPurposes()
    }

    ngAfterViewInit() {
    }


    public createForm() {
        this.formModel = this.fb.group({
            expiryDate: [new Date()],
            amount: ['', [Validators.required, Validators.min(1), Validators.max(this.transferLimit)]],
            purpose: ['', [Validators.required]],
            validityTime: [this.maxValidatyDays, [Validators.required, Validators.min(1), Validators.max(this.maxValidatyDays)]],
            acctNum: ['', [Validators.required]],
            fees: [0],
            beneficiaryName: [''],
            referenceNumber: [''],
            ponId: [''],
        })
    }

    selectAccount(account) {
        this.formModel.controls.acctNum.patchValue(account)
    }

    getTransferPurposes() {
        this.requestToPayService.getTransferPurposes().subscribe(result => {
            if (result.errorCode == '0') {
                this.purposes = result.transferReasonsList
            }
        })
    }

    getProxyObject() {
        let quickProxy: any = {
            participantBankId: this.formModel.controls.bank.value.participantId,
            participantBankName: this.formModel.controls.bank.value.participantName,
        }

        switch (this.selectedProxy.type) {
            case 'IBAN':
                quickProxy.beneficiaryIBAN = this.formModel.controls.iban.value
                quickProxy.beneficiaryName = this.formModel.controls.beneficiary.value
                break
            case 'MOIBLE_NUMBER':
                quickProxy.proxyType = {
                    type: this.selectedProxy.type,
                    value: '966' + this.formModel.controls.iban.value.substring(1),
                }
                break
            default:
                quickProxy.proxyType = {
                    type: this.selectedProxy.type,
                    value: this.formModel.controls.iban.value,
                }
                break
        }
        return quickProxy
    }

    initiateValidateRTP() {
        if (this.tabName == 'beneficiary') {
            this.selectedProxy = this.proxyTypes.proxyTypes.filter(item => item.type == 'IBAN')[0]
        }

        let data = {
            quickProxy: this.getProxyObject(),
            transferPurpose: this.formModel.controls.purpose.value.purposeCode,
            comments: this.formModel.controls.comment.value,
            amount: this.formModel.controls.amount.value,
            toAccount: this.formModel.controls.acctNum.value,
        }
        this.requestToPayService.initiateValidateRTP(data).subscribe(result => {
            if (result.errorCode == '0') {
                this.generateChallengeAndOTP = result.generateChallengeAndOTP
                this.formModel.controls.fees.patchValue(result.feesAmount)
                this.formModel.controls.beneficiaryName.patchValue(result.beneficiaryName)
                this.formModel.controls.referenceNumber.patchValue(result.trxnKey)
                this.wizardStep++
            }
        })
    }

    initiateConfirmRTP() {
        let data = {
            proxy: this.getProxyObject(),
            transferPurpose: this.formModel.controls.purpose.value.purposeCode,
            trxnKey: this.formModel.controls.referenceNumber.value,
            creditorIBAN: this.formModel.controls.acctNum.value.ibanNumber,
            rtpAmt: this.formModel.controls.amount.value,
            expiry: this.formModel.controls.validityTime.value,
            comments: this.formModel.controls.comment.value,
            requestValidate: this.requestValidate,
        }
        this.requestToPayService.initiateConfirmRTP(data).subscribe(result => {
            if (result.errorCode == '0') {
                this.isSuccess = true
                this.formModel.controls.ponId.patchValue(result.ponId)
            } else {
                this.isSuccess = false
            }
            this.pageType = 'STEEPER'
            this.wizardStep++
        })
    }

    back() {
        if (this.pageType == 'OTP') {
            this.pageType = 'STEEPER'
        } else {
            if (this.wizardStep == 3 && this.tabName == 'beneficiary') {
                this.resetReceiverDetailsControls()
            }
            if (this.wizardStep == 2) {
                this.formModel.removeControl('bank')
                this.deleteBeneficiaryControl()
                this.formModel.removeControl('comment')
                this.formModel.removeControl('iban')
            }
            if (this.wizardStep == 1) {
                this.goTo(false)
            }
            this.wizardStep--
        }
    }


    getWizardStepsCount() {
    }

    isDisabled() {
    }

    next() {
        switch (this.wizardStep) {
            case 1:
                this.toReceiverDetails()
                break
            case 2:
                this.initiateValidateRTP()
                break
            case 3:
                if (this.pageType == 'STEEPER') {
                    this.pageType = 'OTP'
                } else {
                    this.initiateConfirmRTP()
                }
                break
        }
    }

    onInitStep(step, events) {
    }

    valid() {
        if (this.pageType == 'OTP') {
            return !this.requestValidate.valid()
        } else {
            switch (this.wizardStep) {
                case 1:
                case 2:
                    return !this.formModel.valid
                default:
                    return false
            }
        }
    }


    toReceiverDetails() {
        this.formModel.controls.expiryDate.patchValue(new Date().setDate(new Date().getDate() + parseInt(this.formModel.controls.validityTime.value)))
        this.requestToPayService.getParticipantBankList().subscribe((result: any) => {
            this.banks = result.participantBankItems
            this.addReceiverDetailsControls()
            this.showProxyTab(this.proxyTypes.proxyTypes[0])
            this.wizardStep++
        })
    }

    addReceiverDetailsControls() {
        this.formModel.addControl('bank', new FormControl(null, Validators.compose([Validators.required])))
        this.formModel.addControl('comment', new FormControl(null, Validators.compose([Validators.maxLength(50), Validators.pattern('^(?=.*\\S).+$')])))
        this.formModel.addControl('iban', new FormControl(null, Validators.compose([Validators.required])))
    }

    resetReceiverDetailsControls() {
        this.formModel.controls.bank.reset()
        this.formModel.controls.comment.reset()
        this.formModel.controls.iban.reset()
    }

    showBeneficiaryTab() {
        this.resetReceiverDetailsControls()
        this.deleteBeneficiaryControl()
        this.selectedProxy = null
        this.formModel.controls.iban.setValidators(Validators.compose(null))
        this.formModel.addControl('beneficiary', new FormControl(null, Validators.compose([Validators.required])))
        this.tabName = 'beneficiary'
    }

    showProxyTab(item) {
        this.resetReceiverDetailsControls()
        this.deleteBeneficiaryControl()
        this.selectedProxy = item
        this.tabName = item.key
        this.ibanText = this.translate.instant(item.value)
        this.formModel.controls.iban.setValidators(Validators.compose([Validators.required, Validators.pattern(item.pattern), Validators.minLength(item.min), Validators.maxLength(item.max)]))
        if (this.selectedProxy.key == 'IBAN') {
            this.formModel.addControl('beneficiary', new FormControl(null, Validators.compose([Validators.required])))
        }
    }

    setBeneficiary(item) {
        if (this.formModel.controls.comment.valid) {
            this.selectedBeneficiary = item[0]
            let bank = this.banks.filter(bank => bank.participantId == this.selectedBeneficiary.bankCode)
            if (bank.length > 0) {
                this.formModel.controls.bank.setValue(bank[0])
                this.formModel.controls.beneficiary.setValue(this.selectedBeneficiary.beneficiaryFullName)
                this.formModel.controls.iban.setValue(this.selectedBeneficiary.beneficiaryAccount.ibanNumber)
                this.initiateValidateRTP()
            } else {

                this.smq.publish(
                    'error-mq',
                    this.translate.instant('rtp.invalidBeneficiary'),
                )
            }
        } else {
            this.smq.publish(
                'error-mq',
                this.translate.instant('rtp.commentRequired'),
            )
        }
    }

    goTo(flag) {
        this.router.navigateByUrl(flag ? '/' : '/transfers/rtPay').then(() => {
        })
    }

    deleteBeneficiaryControl() {
        if (this.formModel.controls.beneficiary) {
            this.formModel.removeControl('beneficiary')
        }
    }
}
