import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core'
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import {Router} from '@angular/router'
import {TranslateService} from '@ngx-translate/core'
import {CommonValidators} from '../../Common/constants/common-validators.service'
import {RequestToPayService} from '../requestToPay.service'
import {ModalDirective} from 'ngx-bootstrap/modal'
import {ResponseGenerateChallenge} from '../../../Model/responsegeneratechallenge.type'
import {RequestValidate} from '../../../Model/requestvalidateType'
import {StorageService} from '../../../../core/storage/storage.service'

@Component({
    selector: 'app-requestToPay',
    templateUrl: './request-details.component.html',
    styleUrls: ['./request-details.component.scss'],
})
export class RequestToPayRequestDetailsComponent implements OnInit, AfterViewInit {
    constructor(
        public fb: FormBuilder,
        public router: Router,
        public translate: TranslateService,
        public commonValidators: CommonValidators,
        public storageService: StorageService,
        public requestToPayService: RequestToPayService) {
    }

    @ViewChild('modal', {static: true}) modal: ModalDirective

    private referenceNumber: string = ''
    public type: string = 'REQUEST' /*'REQUEST' : 'RECEIVE'*/
    public formModel: FormGroup
    public pageType: string = 'DETAILS'   /*'DETAILS':  'RESULT' : 'OTP'*/
    public isSuccess: boolean = true
    public modalTitle: string = ''
    public modalMsg: string = ''
    public generateChallengeAndOTP: ResponseGenerateChallenge = new ResponseGenerateChallenge()
    public requestValidate: RequestValidate = new RequestValidate()
    public showAccount: boolean = false
    public selectedAccount: any = {}
    public accounts: any[] = []
    public showDetails: boolean = false
    public purposes: any[] = []
    public banks: any[] = []
    public comment: string = ''
    public requiredBeneficary: boolean = true
    public requesterBenefciary: any = {}
    public pomid: string = ''
    public rtpId: string = ''
    public successTitle: string = ''
    public successMsg: string = ''

    ngAfterViewInit(): void {
    }

    ngOnInit(): void {
        const data = JSON.parse(localStorage.getItem('REQUEST_TO_PAY_REFERENCE'))
        this.referenceNumber = data.referenceNumber
        this.type = data.type
        if (this.type == 'REQUEST') {
            this.getSentRTPDetails()
        } else {
            this.getReceivedRTPDetails()
        }
        this.getParticipantBankList()
        this.getTransferPurposes()
    }

    getSentRTPDetails() {
        this.requestToPayService.getSentRTPDetails(this.referenceNumber).subscribe(result => {
            this.createForm(result)
        })
    }

    getReceivedRTPDetails() {
        this.requestToPayService.getReceivedRTPDetails(this.referenceNumber).subscribe(result => {
            this.requiredBeneficary = result.requiredBeneficary
            this.requesterBenefciary = result.requesterBenefciary
            this.accounts = [result.accountForm]
            this.createForm(result)
        })
    }

    getTransferPurposes() {
        this.requestToPayService.getTransferPurposes().subscribe(result => {
            if (result.errorCode == '0') {
                this.purposes = result.transferReasonsList
            }
        })
    }

    getParticipantBankList() {
        this.requestToPayService.getParticipantBankList().subscribe((result: any) => {
            if (result.errorCode == '0') {
                this.banks = result.participantBankItems
            }
        })
    }


    public createForm(data) {
        this.formModel = this.fb.group({
            referenceNumber: [this.referenceNumber],
            receiverName: [data.debtorName],
            bank: this.type == 'REQUEST' ? [data.debtorBankID] : [data.requesterBenefciary?.bankCode],
            receiverIban: [data.debtorIBAN],
            requesterIban: [data.requesterBenefciary?.beneficiaryAccountCode],
            amount: this.type == 'REQUEST' ? [data.rtpAmt] : [data.amount],
            purpose: [data.transferPurpose],
            fees: [0],
            comments: [data.comments],
            requestDate: [data.createTime],
            requesterName: [data.requesterBenefciary?.name],
            expiryDate: [data.rtpExpiryTime],
            status: [data.rtpStatus],
            acctNum: [''],
            pomid: [data.pomid],
        })
        this.showDetails = true
    }

    selectAccount(account) {
        this.selectedAccount = account
    }

    cancelRequest() {
        this.modalTitle = this.translate.instant('rtp.cancelRequest')
        this.modalMsg = this.translate.instant('rtp.cancelRequestMsg')
        this.modal.show()
    }

    hideModal() {
        this.comment = ''
        this.modal.hide()
    }

    confirm() {
        this.modal.hide()
        if (this.type == 'REQUEST') {
            let data = {
                rtpid: this.referenceNumber,
                cancellationReasonCd: this.comment,
                additionalInfo: this.comment,
            }
            this.requestToPayService.cancelRTPRequest(data).subscribe(result => {
                this.isSuccess = result.errorCode == '0'
                this.pageType = 'RESULT'
                this.successTitle = this.translate.instant('rtp.successCancel')
                this.successMsg = this.translate.instant('rtp.successMsg')
            })

        } else {
            let data = {
                rtpid: this.referenceNumber,
                pomid: this.formModel.controls.pomid.value,
                comments: this.comment,
            }
            this.requestToPayService.rejectRTPRequest(data).subscribe(result => {
                this.isSuccess = result.errorCode == '0'
                this.pageType = 'RESULT'
                this.successTitle = this.translate.instant('rtp.successReject')
                this.successMsg = this.translate.instant('rtp.successMsg')
            })
        }
    }

    back() {
        this.pageType = 'DETAILS'
    }

    goTo(flag) {
        this.router.navigateByUrl(flag ? '/' : '/transfers/rtPay').then(() => {
        })
    }

    reject() {
        this.modalTitle = this.translate.instant('rtp.rejectRequest')
        this.modalMsg = this.translate.instant('rtp.rejectRequestMsg')
        this.modal.show()
    }


    pay() {
        this.requestToPayService.getAccounts().subscribe(result => {
            this.showAccount = true
            this.accounts = result.listAlertsPermissionAccount
        })
    }

    ValidateRTPRequest() {
        const welcome = this.storageService.retrieve('welcome')
        let data = {
            rtpid: this.referenceNumber,
            segment: welcome.segment,
            accountFrom: this.selectedAccount,
            requesterBenefciary: this.requesterBenefciary,
        }
        this.requestToPayService.acceptValidateRTPRequest(data).subscribe(result => {
            if (result.errorCode == '0') {
                this.generateChallengeAndOTP = result.generateChallengeAndOTP
                this.pageType = 'OTP'
                this.pomid = result.trxnKey
                this.rtpId = result.rtpId
            }
        })
    }

    proceed() {
        let data = {
            rtpid: this.rtpId,
            pomid: this.pomid,
            comments: this.comment,
            requestValidate: this.requestValidate,
        }
        this.requestToPayService.acceptRTPRequest(data).subscribe(result => {
            this.successTitle = this.translate.instant('rtp.successPay')
            this.successMsg = this.translate.instant('rtp.successMsg')
            this.pageType = 'RESULT'
            this.isSuccess = result.errorCode == '0'

        })
    }

    getBankName(id) {
        let bank = this.banks.filter(item => item.participantId == id)
        if (bank.length > 0) {
            return bank[0].participantFullName
        } else {
            return ''
        }
    }

    getReasonsName(id) {
        let reason = this.purposes.filter(item => item.purposeCode == id)
        if (reason.length > 0) {
            return this.translate.currentLang == 'en' ? reason[0].purposeDescriptionEn : reason[0].purposeDescriptionAr
        } else {
            return ''
        }
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

    addBeneficiary() {
        localStorage.setItem('RTP_Beneficiary_IBAN', this.formModel.controls.requesterIban.value)
        this.router.navigateByUrl('/beneficiaries/LocalBeneficiary/AddStep2').then(() => {
        })
    }

    canPay() {
        return this.formModel.controls.status.value == 'Pending'
        // || this.formModel.controls.status.value == 'Processing_Acceptance'
    }

    later() {
        this.requestToPayService.later().subscribe(result => {
            if (result.errorCode == '0') {
                this.goTo(true)
            }
        })
    }
}
