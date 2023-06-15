import { Location } from '@angular/common'
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
// Import service
import { Subscription } from 'rxjs'
// Import required to work with a shared data model.
import { FormData } from '../Model/shared-form-Data.model'
import { FormDataService } from '../Services/shared-form-data.service'
import { ChequeBookAdd } from './accounts-cheque-book-step2.service'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  templateUrl: './accounts-cheque-book-step2.component.html',
})
export class AddChequeBookStep2 implements OnInit, OnDestroy {
  @Input() formData: FormData
  @ViewChild('authorization', { static: true }) authorization: any

  subscription: Subscription
  requestValidate: RequestValidate
  errorAccountValidation: boolean

  constructor(
    public formDataService: FormDataService,
    public service: ChequeBookAdd,
    public _location: Location,
    public router: Router,
  ) {
    this.requestValidate = new RequestValidate()
  }

  step3ChequeBook() {
    //SAVE
    // const data = {
    //     "accountNumber": this.formData.account,
    //     "chequeType": this.formData.chequeType,
    //     "sendType": ""
    // }

    this.subscription = this.service
      .postResults(this.formData, this.requestValidate)
      .subscribe((responseMsg) => {
        //console.log(responseMsg);
        if (responseMsg['errorCode'] === '0') {
          //OK
          this.router.navigate(['/accounts/chequeBookStep3'])
        }

        this.subscription.unsubscribe()
      })
  }

  goBack() {
    this.router.navigate(['/accounts/chequeBookStep1'])
  }

  ngOnInit() {
    this.formData = this.formDataService.getData()
  }

  valid(): boolean {
    if (this.authorization) {
      return this.authorization.valid()
    } else {
      return true
    }
  }

  ngOnDestroy() {}
}
