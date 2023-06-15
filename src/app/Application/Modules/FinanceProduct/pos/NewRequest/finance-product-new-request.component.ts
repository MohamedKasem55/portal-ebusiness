import {
  Component,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { FinanceProductNewRequestService } from './finance-product-new-request.service'
import { DatePipe } from '@angular/common'
import { InitialOfferComponent } from './InitialOffer/initial-offer.component'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { AbstractWizardComponent } from 'app/Application/Modules/Common/Components/Abstract/abstract-wizard.component'
import { FinanceProductCodeService } from '../../finance-product-code.service'
import { take } from 'rxjs/operators'

@Component({
  selector: 'finance-product-new-request',
  templateUrl: './finance-product-new-request.component.html',
  styleUrls: ['./finance-product-new-request.component.scss'],
})
export class FinancProductNewRequestComponent
  extends AbstractWizardComponent
  implements OnInit, OnDestroy {

  @ViewChild('CancelConfirm') public cancelConfirm: ModalDirective

  @ViewChild(InitialOfferComponent)
  initialOfferComponent: InitialOfferComponent

  public iniatFormModel: FormGroup
  public informationFormModel: FormGroup

  public pageName = 'OTP'
  public generateChallengeAndOTP: ResponseGenerateChallenge
  public requestValidate: RequestValidate = new RequestValidate()
  public mandatoryDocuments: any = {}
  public accounts = []
  public showCROption = false
  public productName = "POS Finance"
  public productCode;

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public translate: TranslateService,
    public newRequestService: FinanceProductNewRequestService,
    public injector: Injector,
    private financeProductCode: FinanceProductCodeService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
  ) {
    super(fb, translate, router)
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.wizardStep = 1
    this.pageName = 'OTP'
    this.route.queryParams
      .subscribe((params) => {
        this.productName = params.productName;
        if (this.productName == 'financeProduct.posFinance') {
          this.productCode = this.financeProductCode.POS_PRODUCT_CODE();
        } else if (this.productName == 'financeProduct.bifFinance') {
          this.productCode = this.financeProductCode.BIF_PRODUCT_CODE();
        } else if (this. productName == 'financeProduct.ecommerceFinance') {
          this.productCode = this.financeProductCode.Ecommerce_PRODUCT_CODE();
        }
        this.initiate();
      });
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
      case 'STEPPER':
        if (this.wizardStep == 3) {
          this.confirmOpenDossier()
        } else {
          if (this.wizardStep == 1) {
            this.getCustomerData()
          } else {
            this.next()
          }
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
      case 'STEPPER':
        if (this.wizardStep === 1) {
          this.pageName = 'OTP'
        } else {
          this.back()
        }
        break
    }
  }

  canProceed() {
    switch (this.pageName) {
      case 'OTP':
        return !this.requestValidate.valid()
      case 'STEPPER':
        if (this.wizardStep === 1) {
          const termsAccept = this.iniatFormModel.controls['termsAccept'].value
          const financeAmount = this.iniatFormModel.controls['financingAmount'].valid
          return !(termsAccept && financeAmount)
        }
        if (this.wizardStep === 2) {
          return !this.informationFormModel.valid
        }
        return false
      default:
        return false
    }
  }

  initiate() {
    this.newRequestService.initiate(this.productCode).subscribe((result) => {
      if (result === null) {
        this.onError(result)
        this.router.navigate(['/']).then(() => {
        })
      } else {
        this.generateChallengeAndOTP = result.generateChallengeAndOTP
      }
    })
  }

  validateInitialOffer() {
    this.newRequestService
      .validateInitialOffer(this.requestValidate, this.productCode)
      .subscribe((result) => {
        if (result === null) {
        } else {
          if (result === 'CR_NUMBER_EXPIRED') {
            this.showCROption = true
          } else {
            this.iniatFormModel = this.newRequestService.createIniatForm(
              result.financeEligibleProductKey,
            )
            this.pageName = 'STEPPER'
          }
        }
      })
  }

  recalculate() {
    const rePymtPeriod =
      this.iniatFormModel.controls['repaymentPeriod'].value.key
    const startDate = this.iniatFormModel.controls['initiationDate'].value
    const requiredAmt = this.iniatFormModel.controls['financingAmount'].value
    this.newRequestService
      .reCalculate(rePymtPeriod, requiredAmt, this.productCode)
      .subscribe((result) => {
        if (result === null) {
          this.initialOfferComponent.recalculate({
            financingAmt: 0,
            profitRate: 0,
            feesPercentage: 0,
            installmentAmt: 0,
            rePymtPeriod: rePymtPeriod,
            startDateInfo: {
              timestamp: startDate,
            },
          })
          this.onError(result)
        } else {
          this.initialOfferComponent.recalculate(
            result.financeEligibleProductKey,
          )
        }
      })
  }

  getCustomerData() {
    this.newRequestService.getCustomerData(this.productCode).subscribe((result) => {
      if (result === null) {
        this.onError(result)
      } else {
        this.informationFormModel =
          this.newRequestService.createInformationForm(result,this.productCode)
        this.accounts = result.companyDetails.accountNumberList
        this.getMandatoryDocuments()
      }
    })
  }

  confirmOpenDossier() {
    let data = {
      financeProductBatchDSO: {
        financeProductCode: this.productCode,
        businessLocation:
        this.informationFormModel.controls['locationOfBusiness'].value.key,
        accountNumber: this.informationFormModel.controls['account'].value,
        startDateInfo: this.datePipe.transform(
            this.iniatFormModel.controls['initiationDate'].value,
            'yyyy-MM-dd',
        ),
        financingAmt: this.iniatFormModel.controls['financingAmount'].value,
        profitRate: this.iniatFormModel.controls['profitRate'].value.slice(
            0,
            -1,
        ),
        feesPercentage: this.iniatFormModel.controls['fees'].value.slice(0, -1),
        rePymtPeriod: this.iniatFormModel.controls['repaymentPeriod'].value.key,
        businessOutletsNum:
        this.informationFormModel.controls['numberOfBusiness'].value,
        businessOutletsType:
        this.informationFormModel.controls['typeOfBusiness'].value.key,
        businessModelSalesDesc:
        this.informationFormModel.controls['patternDescription'].value,

        previouseYearFromDate: this.datePipe.transform(
            this.informationFormModel.controls['p_fromDate'].value,
            'yyyy-MM-dd',
        ),
        previouseYearToDate: this.datePipe.transform(
            this.informationFormModel.controls['p_toDate'].value,
            'yyyy-MM-dd',
        ),
        previouseYearAcctType:
        this.informationFormModel.controls['p_accountType'].value?.key,
        previouseYearSalesTurnOver:
        this.informationFormModel.controls['p_salesTurnover'].value,
        previouseYearGrossProfit:
        this.informationFormModel.controls['p_grossProfit'].value,
        previouseYearNetProfit:
        this.informationFormModel.controls['p_netProfit'].value,
        previouseYearFullYearAcct: false,

        currentYearFromDate: this.datePipe.transform(
            this.informationFormModel.controls['c_fromDate'].value,
            'yyyy-MM-dd',
        ),
        currentYearToDate: this.datePipe.transform(
            this.informationFormModel.controls['c_toDate'].value,
            'yyyy-MM-dd',
        ),
        currentYearAcctType:
        this.productName == 'financeProduct.posFinance' ? this.informationFormModel.controls['c_accountType'].value?.key: '001',
        currentYearSalesTurnOver:
        this.informationFormModel.controls['c_salesTurnover'].value,
        currentYearGrossProfit:
        this.informationFormModel.controls['c_grossProfit'].value,
        currentYearNetProfit:
        this.informationFormModel.controls['c_netProfit'].value,
        currentYearFullYearAcct:
        this.informationFormModel.controls['c_fullYearAccount'].value != null ?this.informationFormModel.controls['c_fullYearAccount'].value: false,

        lastYearFromDate: this.datePipe.transform(
            this.informationFormModel.controls['l_fromDate'].value,
            'yyyy-MM-dd',
        ),
        lastYearToDate: this.datePipe.transform(
            this.informationFormModel.controls['l_toDate'].value,
            'yyyy-MM-dd',
        ),
        lastYearAcctType:
            this.productName == 'financeProduct.posFinance' ? this.informationFormModel.controls['l_accountType'].value?.key: '001',
        lastYearSalesTurnOver:
        this.informationFormModel.controls['l_salesTurnover'].value,
        lastYearGrossProfit:
        this.informationFormModel.controls['l_grossProfit'].value,
        lastYearNetProfit:
        this.informationFormModel.controls['l_netProfit'].value,
        lastYearFullYearAcct: false,
      },
    }
    this.newRequestService.confirmOpenDossier(data).subscribe((result) => {
      if (result === null) {
        this.onError(result)
      } else {
        let dossierId: string
        if (result.dossierId && result.dossierId !== '') {
          dossierId = result.dossierId
        } else {
          dossierId = result.batchId
        }
        this.iniatFormModel.controls['dossierId'].setValue(dossierId)

        this.uploadFiles(dossierId)

        this.next()
      }
    })
  }

  uploadFiles(dossierId) {
    this.mandatoryDocuments.forEach((element) => {
      const file = this.informationFormModel.controls[element.documentCode]
        .value
      element.uploadStatus = 0
      this.newRequestService.convertFileToURL(file).then((dataURL) => {
        this.newRequestService
          .attachDocument(dossierId, element.documentCode, file, dataURL)
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
    this.newRequestService.getMandatoryDocuments(this.productCode).subscribe((result) => {
      if (result !== null) {
        this.mandatoryDocuments = result.documentInfos

        this.mandatoryDocuments.forEach((element) => {
          this.informationFormModel.addControl(
            element.documentCode,
            new FormControl('', Validators.required),
          )
          element.file = null
        })
        this.pageName = 'STEPPER'
        this.next()
      }
    })
  }

  cancel() {
    this.cancelConfirm.show()
  }

  finish() {
    this.router.navigate(['/financeProduct/details']).then(() => {
    })
  }

  openUpdateCR() {
    this.router.navigate(['/companyadmin/updatecr']).then(() => {
    })
  }

  closeModal(flag) {
    this.cancelConfirm.hide()
    if (flag) {
      this.router.navigate(['/']).then(() => {
      })
    }
  }

}
