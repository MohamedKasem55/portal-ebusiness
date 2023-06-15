import {
  Component,
  OnDestroy,
  OnInit,
  Input, Output, EventEmitter,
} from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { FinanceProductNewRequestService } from '../finance-product-new-request.service'
import { saveAs } from 'file-saver'

@Component({
  selector: 'finance-product-new-request-initial-offer',
  templateUrl: './initial-offer.component.html',
  styleUrls: ['./initial-offer.component.scss'],
})
export class InitialOfferComponent implements OnInit, OnDestroy {
  @Input() formModel: any
  @Output() reCalculate = new EventEmitter<any>()
  @Input() productType;

  public combosData: any = {}
  public today: Date
  public bsConfig: any = {}
  public maxFinanceAmount = 0

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public translate: TranslateService,
    private newRequestService: FinanceProductNewRequestService,
  ) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.maxFinanceAmount = this.formModel.controls['financingAmount'].value
    this.today = new Date()
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        dateInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-dark-blue',
      },
    )
    let repaymentPeriod = '';
    if (this.productType === 'financeProduct.ecommerceFinance' ) {
      repaymentPeriod = 'financeECOMRePaymentPeriod';
    } else if (this.productType === 'financeProduct.fleetFinance') {
      repaymentPeriod = 'financeFleetRePaymentPeriod';
    } else {
      repaymentPeriod = 'financeRePaymentPeriod';
    }
    this.formModel.enable()
    this.newRequestService
      .getModel(repaymentPeriod)
      .subscribe((result) => {
        if (result !== null) {
          this.combosData.repaymentPeriod = result
          this.setRepaymentPeriod()
        }
      })

    this.formModel.controls['initiationDate'].disable()
    this.formModel.controls['profitRate'].disable()
    this.formModel.controls['fees'].disable()
    this.formModel.controls['installmentAmt'].disable()
  }

  openTermsConditions() {
    this.newRequestService.getPDFFile('pos_finance_terns_and_conditions.pdf', 'Finance Terms and Conditions').subscribe((res) => {
      if (res != null) {
        saveAs(res.file, res.fileName)
      }
    })
  }

  setRepaymentPeriod() {
    if (!this.formModel.controls['repaymentPeriod'].value.key) {
      this.combosData.repaymentPeriod.forEach((element) => {
        if (
          element.key == this.formModel.controls['repaymentPeriod'].value.toString()
        ) {
          this.formModel.controls['repaymentPeriod'].patchValue(element)
        }
      })
    }
  }


  recalculate(financeEligibleProductKey) {
    this.formModel.controls['initiationDate'].patchValue(new Date(financeEligibleProductKey.startDateInfo.timestamp))
    this.formModel.controls['financingAmount'].patchValue(financeEligibleProductKey.financingAmt)
    this.formModel.controls['profitRate'].patchValue(financeEligibleProductKey.profitRate + '%')
    this.formModel.controls['fees'].patchValue(financeEligibleProductKey.feesPercentage + '%')
    this.formModel.controls['installmentAmt'].patchValue(financeEligibleProductKey.installmentAmt)
    this.formModel.controls['repaymentPeriod'].setValue(financeEligibleProductKey.rePymtPeriod)
    this.setRepaymentPeriod()
  }

  onChangeInput(event) {
    const financeAmount = this.formModel.controls['financingAmount'].valid
    if (financeAmount) {
      this.reCalculate.emit()
    }
  }
}
