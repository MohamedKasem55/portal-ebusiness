import { Component, OnDestroy, OnInit, Input } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { FinanceProductNewRequestService } from '../finance-product-new-request.service'
import { SimpleMQ } from 'ng2-simple-mq'

@Component({
  selector: 'finance-product-information-details',
  templateUrl: './information-details.component.html',
  styleUrls: ['./information-details.component.scss'],
})
export class InformationDetailsComponent implements OnInit, OnDestroy {
  @Input() formModel: FormGroup
  @Input() mandatoryDocuments: any = []
  @Input() accounts: []
  @Input() productType: string;

  public combosData: any = {}
  public today: Date
  public bsConfig: any
  public showMoreList = [true, true, true, true, true, true]
  public completeList = [false, false, false, false, false, false]

  constructor(
      public fb: FormBuilder,
      public router: Router,
      public translate: TranslateService,
      private newRequestService: FinanceProductNewRequestService,
      private smq: SimpleMQ,
  ) {
  }

  ngOnDestroy(): void {
  }

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

    this.accounts.forEach((element) => {
      if (element == this.formModel.controls['account'].value) {
        this.formModel.controls['account'].patchValue(element)
        this.modelChange(0)
      }
    })

    this.newRequestService.getModel('saudiCities').subscribe((result: any) => {
      if (result !== null) {
        this.loadLocationOfBusiness(result)
      }
    })

    this.newRequestService.getList(['financeBusinessOutletsType', 'financeAccountType']).subscribe((result: any) => {
      if (result !== null) {
        result.forEach(element => {
          switch (element.key) {
            case 'financeBusinessOutletsType':
              this.loadTypeOfBusiness(element.value)
              break
            case 'financeAccountType':
              this.loadFinanceAccountType(element.value)
              break

          }
        })
      }
    })
  }


  loadLocationOfBusiness(data) {
    this.combosData.locationOfBusiness = data

    if (this.formModel.controls['locationOfBusiness'].value?.key) {
      this.combosData.locationOfBusiness.forEach((element) => {
        if (
            element.key == this.formModel.controls['locationOfBusiness'].value.key
        ) {
          this.formModel.controls['locationOfBusiness'].patchValue(element)
          this.modelChange(1)
        }
      })
    }
  }

  loadTypeOfBusiness(data) {
    this.combosData.typeOfBusiness = data
    if (this.formModel.controls['typeOfBusiness'].value?.key) {
      this.combosData.typeOfBusiness.forEach((element) => {
        if (
            element.key == this.formModel.controls['typeOfBusiness'].value.key
        ) {
          this.formModel.controls['typeOfBusiness'].patchValue(element)
          this.modelChange(1)
        }
      })
    }
  }

  loadFinanceAccountType(data) {
    this.combosData.accountType = data
    if (!this.formModel.controls['c_accountType'].value?.key) {
      this.combosData.accountType.forEach((element) => {
        if (element.key == this.formModel.controls['c_accountType'].value) {
          this.formModel.controls['c_accountType'].patchValue(element)
        }
        if (element.key == this.formModel.controls['l_accountType'].value) {
          this.formModel.controls['l_accountType'].patchValue(element)
        }
        if (element.key == this.formModel.controls['p_accountType'].value) {
          this.formModel.controls['p_accountType'].patchValue(element)
        }
      })
      this.modelChange(2)
      this.modelChange(3)
      this.modelChange(4)
    }
  }


  fileUploadChange(event, item) {
    const fileList: FileList = event.target.files
    if (fileList.length > 0) {
      if (this.isAllowedType(fileList[0].name)) {
        if (fileList[0].size < 5242880) {
          item.file = fileList[0].name
          this.formModel.controls[item.documentCode].setValue(fileList[0])
        } else {
          event.target.value = null
          this.formModel.controls[item.documentCode].setValue(null)
          this.smq.publish('error-mq', this.translate.instant('financeProduct.newRequest.fileTypeError'))
        }
      } else {
        event.target.value = null
        this.formModel.controls[item.documentCode].setValue(null)
        this.smq.publish('error-mq', this.translate.instant('financeProduct.newRequest.fileSizeError'))
      }
    }
  }

  isAllowedType(name: string) {
    const type = name.split('.').pop().toLowerCase()
    return type == 'pdf' || type == 'jpeg' || type == 'jpg' || type == 'gif' || type == 'png'
  }

  showMore(index) {
    this.showMoreList[index] = !this.showMoreList[index]
  }

  modelChange(index) {
    switch (index) {
      case 0:
        this.completeList[index] = !!this.formModel.controls['account'].value
        break

      case 1:
        this.completeList[index] = !!(this.formModel.controls['numberOfBusiness'].value &&
            this.formModel.controls['typeOfBusiness'].value &&
            this.formModel.controls['patternDescription'].value &&
            this.formModel.controls['locationOfBusiness'].value)
        break

      case 2:
        this.completeList[index] = !!(this.formModel.controls['c_fromDate'].value &&
            this.formModel.controls['c_toDate'].value &&
            (this.productType == "financeProduct.posFinance" ? this.formModel.controls['c_accountType'].value : true) &&
            this.formModel.controls['c_salesTurnover'].value &&
            this.formModel.controls['c_grossProfit'].value &&
            this.formModel.controls['c_netProfit'].value)
        break

      case 3:
        this.completeList[index] = !!(this.formModel.controls['l_fromDate'].value &&
            this.formModel.controls['l_toDate'].value &&
            (this.productType == "financeProduct.posFinance" ? this.formModel.controls['l_accountType'].value : true) &&
            this.formModel.controls['l_salesTurnover'].value &&
            this.formModel.controls['l_grossProfit'].value &&
            this.formModel.controls['l_netProfit'].value)
        break

      case 4:
        this.completeList[index] = this.productType == "financeProduct.posFinance" ? (!!(this.formModel.controls['p_fromDate'].value &&
            this.formModel.controls['p_toDate'].value &&
            this.formModel.controls['p_accountType'].value &&
            this.formModel.controls['p_salesTurnover'].value &&
            this.formModel.controls['p_grossProfit'].value &&
            this.formModel.controls['p_netProfit'].value)) : true;
        break
    }
  }
}
