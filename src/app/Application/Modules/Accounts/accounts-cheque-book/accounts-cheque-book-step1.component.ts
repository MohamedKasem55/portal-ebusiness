import { Location } from '@angular/common'
import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
// Import service
import { Subscription } from 'rxjs'
import { Exception } from 'app/Application/Model/exception'
// Import required to work with a shared data model.
import { FormData } from '../Model/shared-form-Data.model'
import { AccountsList } from '../Services/accounts-list-data.service'
import { FormDataService } from '../Services/shared-form-data.service'
import { AccountsChequeBookService } from './accounts-cheque-book.service'

@Component({
  templateUrl: './accounts-cheque-book-step1.component.html',
})
export class AddChequeBookStep1 implements OnInit, OnDestroy {
  @Input() formData: FormData
  subscription: Subscription
  accountList
  accountFrom

  constructor(
    public formDataService: FormDataService,
    public service: AccountsChequeBookService,
    public _location: Location,
    public router: Router,
    public listService: AccountsList,
  ) {
    this.formDataService.deleteData()
  }

  step2ChequeBook(): void {
    this.service
      .chequebookValidate(this.formData.chequeType, this.formData.account)
      .subscribe((result: any) => {
        if (
          (result.hasOwnProperty('error') &&
            (<any>result).error instanceof Exception) ||
          result.batch == null
        ) {
          this.onError(result)
          return
        } else {
          this.formDataService.setData(result)
          this.router.navigate(['/accounts/chequeBookStep2'])
        }
      })
  }

  ngOnInit() {
    this.formData = this.formDataService.getData()
    this.formData.chequeType = ''
    this.subscription = this.service.getAccountsCombo().subscribe((result) => {
      if (result === null) {
        this.onError(result)
      } else {
        this.formData.accounts = []
        for (let i = 0; i < result['listAlertsPermissionAccount'].length; i++) {
          const account = {
            fullAccountNumber:
              result['listAlertsPermissionAccount'][i]['fullAccountNumber'],
            alias: result['listAlertsPermissionAccount'][i]['alias'],
          }
          this.formData.accounts.push(account)
        }

        //console.log(result);
        this.accountList = result['listAlertsPermissionAccount']
        this.accountFrom = this.extractAccountKeyValue(this.accountList)
      }
      this.subscription.unsubscribe()
    })
    // this.listService.getAccountsList().subscribe(data =>{
    //     this.accountList = data;
    //     this.accountFrom = this.extractAccountKeyValue(this.accountList.accountList);
    //console.log(this.accountFrom);
    // })
  }

  extractAccountKeyValue(account: any) {
    const accountKeyValue = []
    for (let i = 0; account.length > i; i++) {
      accountKeyValue.push({ key: i, value: account[i] })
    }
    return accountKeyValue
  }

  onError(result) {
    //
  }

  ngOnDestroy() {
    // this.formDataService.setData(this.formData);
  }
}
