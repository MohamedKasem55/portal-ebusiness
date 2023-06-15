import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { AbstractWizardComponent } from '../Common/Components/Abstract/abstract-wizard.component'
import { ResponseGenerateChallenge } from '../../Model/responsegeneratechallenge.type'
import { RequestValidate } from '../../Model/requestvalidateType'
import { MRCCService } from './mrcc.service'
import { FinanceProductCodeService } from '../FinanceProduct/finance-product-code.service'


@Component({
  selector: 'mrcc',
  templateUrl: './mrcc.component.html',
  styleUrls: ['./mrcc.component.scss'],
})
export class MRCCComponent
  extends AbstractWizardComponent
  implements OnInit, OnDestroy {

  public cardDetailsFormModel: FormGroup

  public pageName = 'OTP'
  public generateChallengeAndOTP: ResponseGenerateChallenge
  public requestValidate: RequestValidate = new RequestValidate()
  public mandatoryDocuments: any = {}
  public accounts: any = []
  public isSummary: boolean = false

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public translate: TranslateService,
    public mrccService: MRCCService,
    private financeProductCode: FinanceProductCodeService,
  ) {
    super(fb, translate, router)
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.wizardStep = 1
    this.initiate()
  }

  back() {
    this.wizardStep--
  }

  getWizardStepsCount() {
  }

  isDisabled() {
  }

  next() {
    this.wizardStep++
  }

  onInitStep(step, events) {
  }

  valid() {
  }

  proceed() {
    switch (this.pageName) {
      case 'OTP':
        this.validateInitialOffer()
        break
      case 'STEPER':
        switch (this.wizardStep) {
          case 1:
            this.isSummary = true
            this.cardDetailsFormModel.disable()
            this.next()
            break
          case 2:
            this.confirmOpenDossier()
            break
        }
        break
    }
  }

  goBack() {
    switch (this.pageName) {
      case 'OTP':
        this.router.navigate(['/']).then(() => {
        })
        break
      case 'STEPER':
        switch (this.wizardStep) {
          case 1:
            this.pageName = 'OTP'
            break
          case 2:
            this.isSummary = false
            this.cardDetailsFormModel.enable()
            this.back()
            break
        }
        break
    }
  }

  canProceed() {
    switch (this.pageName) {
      case 'OTP':
        return !this.requestValidate.valid()
      case 'STEPER':
        if (this.wizardStep === 1) {
          let termsAccept = this.cardDetailsFormModel.controls['termsAccept'].value
          return !(termsAccept && this.cardDetailsFormModel.valid)
        } else {
          return false
        }
      default:
        return false
    }
  }

  initiate() {
    this.mrccService.initiate().subscribe((result) => {
      if (result === null) {
        this.onError(result)
      } else {
        this.generateChallengeAndOTP = result.generateChallengeAndOTP
      }
    })
  }

  validateInitialOffer() {
    this.mrccService
      .validateInitialOffer(this.requestValidate)
      .subscribe((result) => {
        if (result === null) {
          this.onError(result)
        } else {
          this.pageName = 'STEPER'
          this.cardDetailsFormModel = this.mrccService.createCardDetailsForm(
            result.financeEligibleProductKey,
          )
          this.getMandatoryDocuments()
          this.getCustomerData()
        }
      })
  }


  getCustomerData() {
    this.mrccService.getCustomerData().subscribe((result) => {
      if (result === null) {
        this.onError(result)
      } else {
        this.accounts = result.companyDetails.accountNumberList
      }
    })
  }


  confirmOpenDossier() {

    let data = {
      financeProductBatchDSO: {
        financeProductCode: this.financeProductCode.MRCC_PRODUCT_CODE(),
        accountNumber: this.cardDetailsFormModel.controls['account'].value,
        cardBusinessDataDetails: {
          embossingName: this.cardDetailsFormModel.controls['embossingName'].value,
          companyEmbossingName: this.cardDetailsFormModel.controls['embossingCompanyName'].value,
          creditLimitAmt: this.cardDetailsFormModel.controls['amount'].value,
          dueAmt: this.cardDetailsFormModel.controls['repaymentOption'].value,
        },
      },
    }

    this.mrccService.confirmOpenDossier(data).subscribe((result) => {
      if (result === null) {
        this.onError(result)
      } else {
        let dossierId: string
        if (result.dossierId && result.dossierId !== '') {
          dossierId = result.dossierId
        } else {
          dossierId = result.batchId
        }
        this.cardDetailsFormModel.controls['dossierId'].setValue(dossierId)

        this.uploadFiles(dossierId)

        this.next()
      }
    })
  }

  uploadFiles(dossierId) {
    this.mandatoryDocuments.forEach((element) => {
      element.uploadStatus = 0
      const file = this.cardDetailsFormModel.controls[element.documentCode]
        .value
      this.mrccService.convertFileToURL(file).then((dataURL) => {
        this.mrccService
          .attachDocument(
            dossierId,
            element.documentCode,
            this.cardDetailsFormModel.controls[element.documentCode].value,
            dataURL,
          )
          .subscribe((result: any) => {
            if (result === null) {
              element.uploadStatus = 1
            } else {
              if (result.errorCode !== '0') {
                element.uploadStatus = 1
              } else {
                element.uploadStatus = 2
              }
            }
          })
      })
    })
  }


  getMandatoryDocuments() {
    this.mrccService.getMandatoryDocuments().subscribe((result) => {
      if (result !== null) {
        this.mandatoryDocuments = result.documentInfos

        this.mandatoryDocuments.forEach((element) => {
          this.cardDetailsFormModel.addControl(
            element.documentCode,
            new FormControl('', Validators.required),
          )
          element.file = null
        })
      }
    })
  }

  cancel() {
    this.router.navigate(['/']).then(() => {
    })
  }
}
