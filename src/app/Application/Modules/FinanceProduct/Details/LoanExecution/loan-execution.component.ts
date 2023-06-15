import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { AbstractWizardComponent } from 'app/Application/Modules/Common/Components/Abstract/abstract-wizard.component'
import { FinanceProductDetailsService } from '../finance-product-details.service'
import { ResponseGenerateChallenge } from '../../../../Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { DatePipe } from '@angular/common'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { saveAs } from 'file-saver'
import { FinanceProductCodeService } from '../../finance-product-code.service'
import { AuthenticationService } from '../../../../../core/security/authentication.service'

@Component({
  selector: 'loan-execution',
  templateUrl: './loan-execution.component.html',
  styleUrls: ['./loan-execution.component.scss'],
})
export class LoanExecutionComponent
  extends AbstractWizardComponent
  implements OnInit, OnDestroy {

  @ViewChild('RejectConfirm') public rejectConfirm: ModalDirective
  @ViewChild('errorModal', { static: true }) errorModal: ModalDirective

  private dossierID = ''
  private amount = ''
  public productCode = ''
  public status = ''
  public hasDisbursmentDossier = ''
  private acctNum = ''
  public finalOfferFormModel: FormGroup
  public commodityForm: FormGroup
  public pageName: String = 'STEEPER'
  public generateChallengeAndOTP: ResponseGenerateChallenge
  public requestValidate: RequestValidate = new RequestValidate()
  public isSanad: boolean = false
  public digitalSignatureStatusInterval = null
  public POS_PRODUCT_CODE = ''
  public MRCC_PRODUCT_CODE = ''
  public showSignAtBranch: boolean = false
  public showIVRReceived: boolean = false

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public translate: TranslateService,
    private detailsService: FinanceProductDetailsService,
    private datePipe: DatePipe,
    public financeProductCodeService: FinanceProductCodeService,
    public authenticationService: AuthenticationService,
  ) {
    super(fb, translate, router)
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.POS_PRODUCT_CODE = this.financeProductCodeService.POS_PRODUCT_CODE()
    this.MRCC_PRODUCT_CODE = this.financeProductCodeService.MRCC_PRODUCT_CODE()
    const data = JSON.parse(localStorage.getItem('FINANCE_PRODUCT_EXECUTION'))
    this.dossierID = data.dossierID
    this.amount = data.amount
    this.productCode = data.productCode
    this.status = data.status
    this.hasDisbursmentDossier = data.hasDisbursmentDossier
    this.getTrackingDataInquiry()
    this.showSignAtBranch = this.authenticationService.activateOption('POS_FINANCE_SING_AT_BRANCH', [], [])
  }

  setStatus() {
    switch (this.status) {
      case 'DDP':
        this.pageName = 'STEEPER'
        this.wizardStep = 2
        break
      case 'DDW':
        this.getCommodityDetails(3, 'STEEPER')
        break
      case 'DBD':
        this.getCommodityDetails(4, 'STEEPER')
        break
      case 'DCS':
        this.getCommodityDetails(4, 'STEEPER')
        break
      // case 'DSS':
      //   this.getCommodityDetails(5, 'STEEPER')
      //   break
    }
  }

  onInitStep(step: any, events: any) {
  }

  isDisabled() {
  }

  valid() {
  }

  back() {
    switch (this.pageName) {
      case 'SELLCOMMODITY':
        this.pageName = 'STEEPER'
        break
      case 'STEEPER':
        if (this.wizardStep === 1) {
          localStorage.setItem('FINANCE_PRODUCT_TAB', '2')
          this.router.navigate(['/financeProduct/details'])
        } else {
          this.wizardStep--
        }
        break
      case 'OTP':
        this.pageName = 'SELLCOMMODITY'
        break
    }
  }

  next() {
    switch (this.pageName) {
      case 'STEEPER':
        switch (this.wizardStep) {
          case 2:
            this.buyCommodity()
            break
          case 3:
            this.initiateDigitalSignature()
            break
          case 4:
            this.initiateSellCommodity()
            break
        }
        break
      case 'OTP':
        this.sellCommodity()
        break
    }
  }

  getWizardStepsCount() {
  }


  cancel() {
    if (this.digitalSignatureStatusInterval) {
      clearInterval(this.digitalSignatureStatusInterval)
      this.digitalSignatureStatusInterval = null
    }
    localStorage.setItem('FINANCE_PRODUCT_TAB', '2')
    this.router.navigate(['/financeProduct/details'])
  }

  canProceed() {
    switch (this.pageName) {
      case 'OTP':
        return !this.requestValidate.valid()
      case 'STEEPER':
        switch (this.wizardStep) {
          case 3:
            return !this.commodityForm.controls['acceptContract'].value
          case 4:
            return !this.commodityForm.controls['iAuthorizeCommodity'].value
        }
        return false
      default:
        return false
    }
  }

  reject(): void {
    this.rejectConfirm.show()
  }

  approved(): void {
    this.detailsService
      .openDisbursmentDossier(this.dossierID, this.productCode, this.acctNum)
      .subscribe((result) => {
        if (result !== null) {
          this.pageName = 'STEEPER'
          this.wizardStep++
        }
      })
  }

  getTrackingDataInquiry(): void {
    this.detailsService
      .getTrackingDataInquiry(this.dossierID)
      .subscribe((result) => {
        if (result !== null) {
          this.acctNum = result.offer.acctNum
          this.finalOfferFormModel = this.detailsService.createFinalOfferForm(
            result,
            this.dossierID,
            this.productCode,
          )
        }
        this.setStatus()
      })
  }

  buyCommodity(): void {
    this.detailsService
      .buyCommodity(this.dossierID, this.productCode)
      .subscribe((result) => {
        if (result !== null) {
          if (result.commodityItems.length > 0) {
            result.commodityItems[0].amount = this.amount
            result.commodityItems[0].settlementDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
            this.commodityForm = this.detailsService.createCommodityForm(
              result.commodityItems[0],
              this.dossierID,
              this.productCode,
            )
            this.wizardStep++
          }
        }
      })
  }


  initiateSellCommodity(): void {
    this.detailsService.initiateSellCommodity().subscribe((result) => {
      if (result !== null) {
        this.generateChallengeAndOTP = result.generateChallengeAndOTP
        this.pageName = 'OTP'
      }
    })
  }

  sellCommodity(): void {
    this.detailsService
      .sellCommodity(this.dossierID, this.productCode, this.requestValidate)
      .subscribe((result) => {
        if (result !== null) {
          this.pageName='STEEPER'
          this.isSanad = true
          this.wizardStep++
        }
      })
  }

  setSanadPNCreation(): void {
    this.detailsService
      .setSanadPNCreation(this.dossierID, this.productCode)
      .subscribe((result) => {
        if (result !== null) {
          this.isSanad = false
          this.wizardStep++
        }
      })
  }

  createSanadGroup(): void {
    this.detailsService.createSanadGroup(this.dossierID).subscribe((result) => {
      if (result !== null) {
        this.isSanad = true
        this.wizardStep++
      }
    })
  }

  getCommodityDetails(step, pageName) {
    this.detailsService
      .getCommodityDetails(this.dossierID)
      .subscribe((result) => {
        if (result !== null) {
          let data = {
            commodityAmt: result['commodityUnits'],
            commodityQuantity: result['commoditiesQuantity'],
            amount: this.amount,
            settlementDate: result['settlementDate'],
          }
          this.commodityForm = this.detailsService.createCommodityForm(
            data,
            this.dossierID,
            this.productCode,
          )
          this.pageName = pageName
          this.wizardStep = step
        }
      })
  }

  callReceived() {
    this.getDigitalSignatureStatus()
  }

  finish() {
    this.router.navigate(['/']).then(() => {
    })
  }

  closeModal(flag) {
    this.rejectConfirm.hide()
    if (flag) {
      this.detailsService
        .rejectCreditLineDosier(this.dossierID)
        .subscribe((result) => {
          if (result !== null) {
            localStorage.setItem('FINANCE_PRODUCT_TAB', '2')
            this.router.navigate(['/financeProduct/details']).then(() => {
            })
          }
        })
    }
  }

  initiateDigitalSignature(): void {
    if (this.commodityForm.controls['contractDownloaded'].value == true) {
      this.detailsService
        .initiateDigitalSignature(this.commodityForm.controls['productCode'].value, this.dossierID)
        .subscribe((result) => {
          if (result !== null) {
            this.commodityForm.controls['bankTrxnRef'].setValue(result.bankTrxnRef)
            this.showIVRReceived = false
            this.pageName = 'IVR'
            let count = 0
            this.digitalSignatureStatusInterval = setInterval(() => {
              count++
              if (count > 1) {
                this.getDigitalSignatureStatus()
                if (count == 4) {
                  this.showIVRReceived = true
                  clearInterval(this.digitalSignatureStatusInterval)
                  this.digitalSignatureStatusInterval = null
                }
              }
            }, 10000)
          }
        })
    } else {
      this.errorModal.show()
    }
  }

  getDigitalSignatureStatus(): void {
    this.detailsService
      .getDigitalSignatureStatus(this.commodityForm.controls['bankTrxnRef'].value)
      .subscribe((result) => {
        if (result !== null) {
          if (result.rqStatusCd == '05' || result.rqStatusCd == '06' || result.rqStatusCd == '07') {
            clearInterval(this.digitalSignatureStatusInterval)
            this.digitalSignatureStatusInterval = null
            this.pageName = 'IVC'
          } else if (result.rqStatusCd == '02' || result.rqStatusCd == '04') {
            clearInterval(this.digitalSignatureStatusInterval)
            this.digitalSignatureStatusInterval = null
            this.router.navigate(['/']).then(() => {
            })
          }
        }
      })
  }

  closeErrorModal(flag) {
    this.errorModal.hide()
    if (flag) {
      this.detailsService
        .getPrintableDocuments(
          'POS_LAC',
          this.commodityForm.controls['financeID'].value,
          'Contract Of Commodity Sale',
          this.commodityForm.controls['productCode'].value)
        .subscribe((res) => {
          if (res != null) {
            this.commodityForm.controls['contractDownloaded'].setValue(true)
            saveAs(res.file, res.fileName)
          }
        })
    }
  }
}
