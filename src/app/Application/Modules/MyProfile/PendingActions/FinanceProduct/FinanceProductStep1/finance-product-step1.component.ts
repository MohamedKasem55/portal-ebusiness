import { Component, OnDestroy, OnInit, Input } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { FinanceProductService } from '../finance-product.service'

@Component({
  selector: 'finance-product-step1',
  templateUrl: './finance-product-step1.component.html',
  styleUrls: ['./finance-product-step1.component.scss'],
})
export class FinanceProductStep1Component implements OnInit, OnDestroy {
  @Input() formModel: any

  public combosData: any = {}
  public today: Date
  public bsConfig: any

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public translate: TranslateService,
    private financeProductService: FinanceProductService,
  ) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
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

    this.formModel.disable()
    this.formModel.controls['typeOfBusiness'].enable()
    this.formModel.controls['patternDescription'].enable()
    this.formModel.controls['firstRepaymentDate'].enable()

    this.financeProductService
      .getLOV('financeBusinessOutletsType')
      .subscribe((result) => {
        if (result !== null) {
          this.combosData.typeOfBusiness = result
          if (!this.formModel.controls['typeOfBusiness'].value.key) {
            this.combosData.typeOfBusiness.forEach((element) => {
              if (
                element.key == this.formModel.controls['typeOfBusiness'].value
              ) {
                this.formModel.controls['typeOfBusiness'].patchValue(element)
              }
            })
          }
        }
      })

    this.financeProductService
      .getLOV('financeBusinessModelSalesDesc')
      .subscribe((result) => {
        if (result !== null) {
          this.combosData.patternDescription = result
          if (!this.formModel.controls['patternDescription'].value.key) {
            this.combosData.patternDescription.forEach((element) => {
              if (
                element.key ==
                this.formModel.controls['patternDescription'].value
              ) {
                this.formModel.controls['patternDescription'].patchValue(
                  element,
                )
              }
            })
          }
        }
      })

    this.financeProductService
      .getLOV('financeAccountType')
      .subscribe((result) => {
        if (result !== null) {
          this.combosData.accountType = result
          if (!this.formModel.controls['c_accountType'].value.key) {
            this.combosData.accountType.forEach((element) => {
              if (
                element.key == this.formModel.controls['c_accountType'].value
              ) {
                this.formModel.controls['c_accountType'].patchValue(element)
              }
              if (
                element.key == this.formModel.controls['l_accountType'].value
              ) {
                this.formModel.controls['l_accountType'].patchValue(element)
              }
              if (
                element.key == this.formModel.controls['p_accountType'].value
              ) {
                this.formModel.controls['p_accountType'].patchValue(element)
              }
            })
          }
        }
      })
  }
}
