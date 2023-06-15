import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { BillPaymentService } from '../bill-payments/bill-payment.service'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  templateUrl: './add-bill.component.html',
})
export class AddBillComponent implements OnInit, OnDestroy {
  @ViewChild('authorization') authorization: any

  wizardStep: number
  wizardData: any = {}

  addBillStatus: boolean
  private searchresult: any[] = []
  data: any = {}
  dataValidate: any = {}
  statusOk = true

  billCodes: any[] = []
  /*In case billcodes have to be categorized*/
  bill: any[] = []
  group: any[] = []
  selected: string

  requestValidate: RequestValidate

  constructor(
    public translate: TranslateService,
    public billPaymentService: BillPaymentService,
  ) {
    this.requestValidate = new RequestValidate()
  }

  next() {
    this.billPaymentService
      .validateNewBill(
        this.wizardData.unityServiceProvider.billCode,
        this.wizardData.subscriberNumber,
        this.wizardData.nickName,
      )
      .subscribe((result) => {
        this.dataValidate = result
        if (this.dataValidate.errorCode === '0') {
          this.wizardStep = this.wizardStep + 1
        }
      })
  }

  back() {
    this.wizardStep = this.wizardStep - 1
  }

  finish() {
    this.statusOk = true
    this.billPaymentService
      .addNewBill(this.dataValidate.billAddBatch, this.requestValidate)
      .subscribe((result) => {
        this.data = result
        this.statusOk = !this.data.error
        this.addBillStatus = true
        if (result.errorCode === '0') {
          this.wizardStep = this.wizardStep + 1
        }
      })
  }

  ngOnInit() {
    this.wizardStep = 1
    ;(this.addBillStatus = false), this.getSingleBillCodes()
  }

  ngOnDestroy() {
    this.wizardStep = 1
  }

  getSingleBillCodes() {
    this.billPaymentService.getBillCodes().subscribe((result) => {
      if (result.error) {
        //console.log("Error" + result.error);
      } else {
        this.billCodes = result.billCodes
        this.group = this.billCodes
      }
    })
  }

  /*In case billcodes have to be categorized*/
  getBillCodes() {
    this.billPaymentService.getBillCodes().subscribe((result) => {
      if (result.error) {
        //console.log("Error" + result.error);
      } else {
        this.billCodes = result.billCodes
        let actualResult
        for (let i = 0; i < this.billCodes.length; i++) {
          let notRepeat = true
          actualResult = this.billCodes[i]
          if (i === 0) {
            this.bill[i] = actualResult
            //console.log(actualResult);
          }
          for (let j = 0; j < this.bill.length; j++) {
            if (
              actualResult['categoryEn'] === this.bill[j]['categoryEn'] ||
              actualResult['categoryEn'] === null ||
              actualResult['categoryEn'] === ''
            ) {
              notRepeat = false
            }
          }
          if (notRepeat) {
            //console.log(actualResult);
            this.bill.push(actualResult)
          }
        }
      }
    })
  }

  /*In case billcodes have to be categorized*/
  searchByGroup(group) {
    if (group) {
      this.group = this.billCodes.filter(
        (bill) => bill['categoryEn'] === group['categoryEn'],
      )
      if (this.wizardData.unityServiceProvider) {
        this.wizardData.unityServiceProvider = null
      }
    } else {
      this.group = []
      this.wizardData.unityServiceProvider = null
    }
  }

  validForm() {
    if (!this.wizardData.unityServiceProvider) {
      return false
    }
    if (!this.wizardData.subscriberNumber) {
      return false
    }
    if (!this.wizardData.nickName) {
      return false
    }
    return true
  }

  validAuthForm() {
    if (this.authorization) {
      return this.authorization.valid()
    }
    return true
  }

  getBill() {
    return this.billCodes
  }

  isPending() {
    if (
      this.dataValidate.generateChallengeAndOTP &&
      (this.dataValidate.generateChallengeAndOTP.typeAuthentication ===
        'STATIC' ||
        this.dataValidate.generateChallengeAndOTP.typeAuthentication ===
          'OTP' ||
        this.dataValidate.generateChallengeAndOTP.typeAuthentication ===
          'CHALLENGE')
    ) {
      return false
    } else {
      return true
    }
  }
}
