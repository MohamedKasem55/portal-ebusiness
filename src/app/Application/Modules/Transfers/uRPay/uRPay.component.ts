import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AbstractWizardComponent } from '../../Common/Components/Abstract/abstract-wizard.component'
import { TranslateService } from '@ngx-translate/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { URPayService } from '../Services/uRPay.service'
import { ResponseGenerateChallenge } from '../../../Model/responsegeneratechallenge.type'
import { RequestValidate } from '../../../Model/requestvalidateType'
import { StorageService } from '../../../../core/storage/storage.service'
import { SimpleMQ } from 'ng2-simple-mq'


@Component({
  selector: 'uRPayComponent',
  templateUrl: './uRPay.component.html',
  styleUrls: ['./uRPay.component.scss'],
})
export class uRPayComponent extends AbstractWizardComponent
  implements OnInit, OnDestroy {

  public pageName = 'STEEPER'
  public payType = ''
  public formModel: FormGroup
  public accounts: []
  // public purposes: []
  private validateRes

  public generateChallengeAndOTP: ResponseGenerateChallenge
  public requestValidate: RequestValidate = new RequestValidate()


  constructor(
    public fb: FormBuilder,
    public router: Router,
    public translate: TranslateService,
    private uRPayService: URPayService,
    public storage: StorageService,
    private smq: SimpleMQ,
  ) {
    super(fb, translate, router)
  }

  payTypeChange(type) {
    this.payType = type
    this.formModel = this.uRPayService.createForm(this.payType)
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  back() {
    if (this.pageName == 'STEEPER') {
      this.wizardStep--
      if (this.wizardStep == 1) {
        this.formModel.controls['wallet'].enable()
      }
    } else {
      this.pageName = 'STEEPER'
    }
  }

  getWizardStepsCount() {
  }

  isDisabled() {
  }

  getAccountsAndPurposes() {
    this.uRPayService.getAccounts().subscribe(result => {
      if (result) {
        this.accounts = result
      }
    })
    // this.uRPayService.getTransferPurpose().subscribe(result => {
    //  if(result) {
    //    this.purposes = result
    //  }
    // })
  }

  isAuthorize() {
    return this.generateChallengeAndOTP && this.validateRes.checkAndSeparateInitiatitionPermission.toProcess.length > 0 && this.validateRes.checkAndSeparateInitiatitionPermission.toAuthorize.length == 0
  }

  next() {
    if (this.pageName == 'STEEPER') {
      switch (this.wizardStep) {
        case 1:
          this.getCustomerDetails()
          break
        case 2:
          this.validateTopUp()
          break
        case 3:
          if (this.isAuthorize()) {
            this.pageName = 'OTP'
          } else {
            this.initiateTopUp()
          }
          break
      }
    } else {
      this.initiateTopUp()
    }
  }

  onInitStep(step, events) {
  }

  valid() {
    if (this.pageName == 'STEEPER') {
      switch (this.wizardStep) {
        case 1:
          if (this.formModel) {
            return !this.formModel.controls['wallet'].valid
          } else {
            return true
          }
        case 2:
          return !this.formModel.valid

      }
      return false
    } else {
      return !this.requestValidate.valid()
    }
  }

  finish() {
    this.router.navigate(['/']).then(() => {
    })
  }


  getCustomerDetails() {
    let data = {
      'walletMobileNum': this.formModel.controls['type'].value == 'phone' ? this.formModel.controls['wallet'].value.toString().substring(1) : '',
      'walletVIBAN': this.formModel.controls['type'].value == 'iban' ? this.formModel.controls['wallet'].value : '',
    }
    this.uRPayService.getCustomerDetails(data).subscribe(result => {
      if (result) {
        this.formModel.controls['walletCustomerName'].setValue((this.translate.currentLang == 'ar') ? result.customerNameAR : result.customerNameEN)
        this.formModel.controls['walletCustomerName'].disable()
        this.formModel.controls['wallet'].disable()
        this.getAccountsAndPurposes()
        this.wizardStep++
      }
    })
  }


  getWalletDTO() {
    let account = this.formModel.controls['account'].value
    return {
      remitterName: JSON.parse(this.storage.retrieve('currentUser'))['company']['companyName'],
      remitterIBAN: account.ibanNumber,
      accountForm: account,
      topupAmount: {
        amount: this.formModel.controls['amount'].value,
        currency: 'SAR',
      },
      // reason: (this.translate.currentLang == 'ar') ? this.formModel.controls['purpose'].value.purposeDescriptionAr : this.formModel.controls['purpose'].value.purposeDescriptionEn,
      walletMobileNum: this.formModel.controls['type'].value == 'phone' ? this.formModel.controls['wallet'].value.toString().substring(1) : '',
      walletVIBAN: this.formModel.controls['type'].value == 'iban' ? this.formModel.controls['wallet'].value : '',
      remarks: this.formModel.controls['details'].value,
    }
  }

  validateTopUp() {
    this.uRPayService.validateTopUp(this.getWalletDTO()).subscribe(result => {
      if (result) {
        if (result.checkAndSeparateInitiatitionPermission.notAllowed.length > 0) {
          this.smq.publish('error-mq', this.translate.instant('uRPay.notAllowed'))
        } else {
          this.validateRes = result
          this.generateChallengeAndOTP = result.generateChallengeAndOTP
          this.wizardStep++
        }
      }
    })
  }


  getBatchDTO() {
    return {
      batchList: this.validateRes.checkAndSeparateInitiatitionPermission,
      totalAmountProcess: this.validateRes.totalAmountProcess,
      requestValidate: this.isAuthorize() ? this.requestValidate : null,
      listbatchToDelete: [],
      emailChecked: '',
      typeBatchList: 'batchListSelectedLocal',
    }
  }

  initiateTopUp() {
    this.uRPayService.initiateTopUp(this.getBatchDTO()).subscribe((result) => {
      if (result) {
        this.wizardStep++
        this.pageName = 'STEEPER'
      }
    })
  }

}
