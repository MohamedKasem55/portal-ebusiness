import { Component, OnInit, OnDestroy } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Breadcrumb } from 'app/Application/Modules/FinanceProduct/shared/models/common'
import { FinanceFleetNewReqService } from '../../../../fleet-finance.service'
import { Subscription } from 'rxjs'
import { PurposeUse, VehiclesLstItem } from '../../../../models/request'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { TenureLimit } from 'app/Application/Modules/FinanceProduct/shared/custom_validators/tenure'
import { DownPayment } from 'app/Application/Modules/FinanceProduct/shared/custom_validators/downPayment'

@Component({
  selector: 'product-select',
  templateUrl: './product-select.component.html',
  styleUrls: ['./product-select.component.scss'],
})
export class ProductSelectComponent implements OnInit, OnDestroy {
  yearsList: any = []
  internalQuotationForm: FormGroup
  breadCrumb: Breadcrumb[] = []
  colors: any[] = []
  subscriptions: Subscription[] = []
  brandList: VehiclesLstItem[] = []
  dealersList: VehiclesLstItem[]
  modelList: VehiclesLstItem[] = []
  variantList: VehiclesLstItem[] = []
  vehiclePrice: number = 0
  variantListWithDuplicates: VehiclesLstItem[] = []
  purposeOfUseList: PurposeUse[] = []
  brandName: string
  modelName: string
  personalUse: boolean = false
  purposeValue: number = 0
  InQuotationList = []
  editMode: boolean = false
  selectedInternalQuotationObj
  quotationIndex
  deafultValues: boolean = false
  tenureRef: number = 0
  maxFinanceTenure: number
  minDownPmt: number

  constructor(
    public translate: TranslateService,
    private financeFleetNewReqService: FinanceFleetNewReqService,
    private formBuilder: FormBuilder,
    public router: Router,
  ) {
    this.internalQuotationForm = formBuilder.group({
      brandName: ['', Validators.required],
      modelName: ['', Validators.required],
      modelYear: ['', Validators.required],
      vehicleVariant: ['', Validators.required],
      dealerName: ['', Validators.required],
      vehiclesNum: [
        '',
        Validators.compose([
          Validators.required,
          Validators.max(300),
          Validators.min(1),
        ]),
      ],
      purposeOfUse: ['', Validators.required],
      vehicleColor: ['', Validators.required],
      tenure: [null, Validators.required],
      downPmt: [null, Validators.required],
      campaign: ['Standard Product'],
      vehicleType: ['New Vehicle'],
      gracePeriod: ['0'],
      gracePeriodType: [''],
      profitRate: [0],
      pmtFrequency: [''],
      ballonPmt: [0],
    })
  }

  ngOnInit(): void {
    this.getBrands()
    this.getDealers()
    this.colors = this.financeFleetNewReqService.colors
    this.purposeOfUseList = this.financeFleetNewReqService.purposeOfUse
    this.quotationIndex = this.financeFleetNewReqService.QuotationIndex

    this.checkSelectedQuotation()

    this.translate.get('fleet').subscribe((data) => {
      this.breadCrumb = [
        { txt: data.newRequest.Finance, active: false },
        { txt: data.newRequest.NoteligibleTitle, active: true },
      ]
    })
  }
  checkSelectedQuotation() {
    this.selectedInternalQuotationObj =
      this.financeFleetNewReqService.selectedInternalQuotationObj?.purposes[0]
    if (this.selectedInternalQuotationObj) {
      this.editMode = true
      this.getModelByBrandId(this.selectedInternalQuotationObj.brandName)
      // this.setForm(this.financeFleetNewReqService.selectedInternalQuotationObj.purposes[0]);
    }
  }
  setForm(formValue) {
    this.internalQuotationForm.patchValue(formValue)
    this.purposeValue = formValue.purposeValue
    this.vehiclePrice = formValue.vehiclePrice
    this.editMode = false
    this.financeFleetNewReqService.selectedInternalQuotationObj = null
  }
  getBrands() {
    this.subscriptions.push(
      this.financeFleetNewReqService.getBrands().subscribe(
        (response: any) => {
          if (response === null) {
            this.router.navigate(['/']).then(() => {})
          } else {
            Array.isArray(response.vehiclesLstItem)
              ? (this.brandList = response.vehiclesLstItem)
              : (this.brandList = [])
          }
        },
        (error) => {
          this.router.navigate(['/']).then(() => {})
        },
      ),
    )
  }
  getDealers() {
    this.subscriptions.push(
      this.financeFleetNewReqService.getDealers().subscribe(
        (response: any) => {
          if (response === null) {
            this.router.navigate(['/']).then(() => {})
          } else {
            Array.isArray(response.vehiclesLstItem)
              ? (this.dealersList = response.vehiclesLstItem)
              : (this.dealersList = [])
          }
        },
        (error) => {
          this.router.navigate(['/']).then(() => {})
        },
      ),
    )
  }

  getModelByBrandId(brandName: any) {
    this.subscriptions.push(
      this.financeFleetNewReqService.getModelsBybrandName(brandName).subscribe(
        (response) => {
          if (response === null) {
            this.router.navigate(['/']).then(() => {})
          } else {
            Array.isArray(response.vehiclesLstItem)
              ? (this.modelList = response.vehiclesLstItem)
              : (this.modelList = [])
            if (this.editMode) {
              this.getVariantByBrandModel(
                this.selectedInternalQuotationObj.brandName,
                this.selectedInternalQuotationObj.modelName,
              )
            }
          }
        },
        (error) => {
          this.router.navigate(['/']).then(() => {})
        },
      ),
    )
  }

  getVariantByBrandModel(brandName, modelName) {
    this.subscriptions.push(
      this.financeFleetNewReqService
        .getVariantBybrandModel(brandName, modelName)
        .subscribe(
          (response: any) => {
            if (response === null) {
              this.router.navigate(['/']).then(() => {})
            } else {
              Array.isArray(response.vehiclesLstItem)
                ? (this.variantListWithDuplicates = response.vehiclesLstItem)
                : (this.variantList = [])
              this.variantList = this.removeVariantDuplicates(
                this.variantListWithDuplicates,
              )
              if (this.editMode) {
                this.getvariantYearsandDefaultValues(
                  this.selectedInternalQuotationObj.vehicleVariant,
                )
                this.setForm(this.selectedInternalQuotationObj)
              }
            }
          },
          (error) => {
            this.router.navigate(['/']).then(() => {})
          },
        ),
    )
  }

  removeVariantDuplicates(arr) {
    return Array.from(new Set(arr.map((a) => a.vehicleVariant))).map(
      (vehicleVariant) => {
        return arr.find((a, index) => a.vehicleVariant === vehicleVariant)
      },
    )
  }
  getvariantYearsandDefaultValues(selectedVarient) {
    this.internalQuotationForm.controls['modelYear'].setValue(null)
    this.getDefaultValues()
    this.yearsList = this.variantListWithDuplicates.filter((element) => {
      return element.vehicleVariant === selectedVarient
    })
  }

  getDefaultValues() {
    let body = {
      brandName: this.internalQuotationForm.get('brandName').value,
      modelName: this.internalQuotationForm.get('modelName').value,
      purpose: this.internalQuotationForm.get('purposeOfUse').value,
      variant: this.internalQuotationForm.get('vehicleVariant').value,
    }

    if (body.purpose != '' && body.variant != '') {
      this.financeFleetNewReqService
        .getDefaultValues(body)
        .subscribe((response) => {
          this.internalQuotationForm.controls['tenure'].setValidators([
            Validators.required,
            TenureLimit(response.maxFinanceTenure),
          ])
          this.internalQuotationForm.controls['tenure'].updateValueAndValidity()
          this.internalQuotationForm.controls['downPmt'].setValidators([
            Validators.required,
            DownPayment(response.minDownPmt),
          ])
          this.internalQuotationForm.controls[
            'downPmt'
          ].updateValueAndValidity()
          this.internalQuotationForm
            .get('tenure')
            .setValue(response.maxFinanceTenure)
          this.internalQuotationForm
            .get('downPmt')
            .setValue(response.minDownPmt)
          this.maxFinanceTenure = +response.maxFinanceTenure
          this.minDownPmt = +response.minDownPmt
        })
    }
  }

  getPrice(price) {
    this.vehiclePrice = price
    this.purposeValue =
      +this.vehiclePrice *
      this.internalQuotationForm.controls['vehiclesNum'].value
  }
  calPurposeValueNTotalPrice(from?) {
    this.internalQuotationForm.controls['purposeOfUse'].value ==
      'MSB_FLEET_PERSONAL_VEH' &&
    this.internalQuotationForm.controls['vehiclesNum'].value > 3
      ? (this.personalUse = true)
      : (this.personalUse = false)
    this.purposeValue =
      this.vehiclePrice *
      this.internalQuotationForm.controls['vehiclesNum'].value
    //Call new Default Values
    if (from == 'personalUseChange') this.getDefaultValues()
  }
  uploadCustomerQuotation(formValue) {
    let staticObj = {
      quotationType: 'Internal',
      quotationNum: +1,
      quotationDate: new Date().toJSON().split('T')[0],
      documentInfo: null,
    }
    formValue = {
      ...formValue,
      ...{ vehiclePrice: this.vehiclePrice, purposeValue: this.purposeValue },
    }
    this.InQuotationList = JSON.parse(sessionStorage.getItem('InQuotations'))
    if (!JSON.parse(sessionStorage.getItem('InQuotations'))) {
      sessionStorage.setItem(
        'InQuotations',
        JSON.stringify({
          quotations: [{ ...staticObj, ...{ purposes: [formValue] } }],
        }),
      )
    } else {
      this.InQuotationList = JSON.parse(sessionStorage.getItem('InQuotations'))
      let Obj = { ...staticObj, ...{ purposes: [formValue] } }
      this.quotationIndex != null && this.quotationIndex >= 0
        ? (this.InQuotationList['quotations'][this.quotationIndex] = {
            ...staticObj,
            ...{ purposes: [formValue] },
          })
        : this.InQuotationList['quotations'].push(Obj)
      sessionStorage.setItem(
        'InQuotations',
        JSON.stringify(this.InQuotationList),
      )
    }
    this.financeFleetNewReqService.selectedInternalQuotation = null
    this.financeFleetNewReqService.QuotationIndex = null
    this.navigateTo()
  }
  navigateTo() {
    this.financeFleetNewReqService.setCurrentStep(3)
    this.router.navigate(['financeProduct/fleet/request/add-request'])
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe()
    })
  }
}
