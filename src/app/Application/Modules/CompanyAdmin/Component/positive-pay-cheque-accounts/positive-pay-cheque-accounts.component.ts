import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { CompanyAdminPositivePayChequeAccountsService } from '../../Services/positive-pay-cheque-accounts/positive-pay-cheque-accounts.service'
import { CompanyAdminPositivePayChequeAccountsStep1Component } from './positive-pay-cheque-accounts-step1.component'
import { CompanyAdminPositivePayChequeAccountsStep2Component } from './positive-pay-cheque-accounts-step2.component'
import { CompanyAdminPositivePayChequeAccountsStep3Component } from './positive-pay-cheque-accounts-step3.component'

@Component({
  templateUrl:
    '../../View/positive-pay-cheque-accounts/positive-pay-cheque-accounts.component.html',
})
export class CompanyAdminPositivePayChequeAccountsComponent implements OnInit {
  @ViewChild(CompanyAdminPositivePayChequeAccountsStep1Component)
  step1: CompanyAdminPositivePayChequeAccountsStep1Component
  @ViewChild(CompanyAdminPositivePayChequeAccountsStep2Component)
  step2: CompanyAdminPositivePayChequeAccountsStep2Component
  @ViewChild(CompanyAdminPositivePayChequeAccountsStep3Component)
  step3: CompanyAdminPositivePayChequeAccountsStep3Component

  accounts: any
  form: any
  step: number
  tableSelected: any[] = []
  accountNotSelected: any[] = []
  subscriptions: Subscription[] = []
  tableAccounts: any = {}
  tableDisplaySize = 20
  pageNumber = 1
  messageError: any
  option: string
  authorizeSubscription: Subscription
  confirmdData: any = {}
  valActivData: any[] = []

  constructor(
    public service: CompanyAdminPositivePayChequeAccountsService,
    private router: Router,
  ) {
    this.step = 1
  }

  ngOnInit() {}

  onInitStep1(events) {
    this.step1 = events
  }

  onInitStep2(events) {
    this.step2 = events
  }

  onInitStep3(events) {
    this.step3 = events
  }

  onError(error: any) {
    const res = error
    //console.log(res.error);
    this.messageError['code'] = res.error.errorCode
    this.messageError['description'] = res.error.errorDescription
  }

  isDisabled() {
    return !this.form.valid
  }

  next() {
    switch (this.step) {
      case 1:
        this.validateAccounts(this.tableSelected)
        break
      case 2:
        this.confirmAprove()
        break
      case 3:
        this.finish()
        break
    }
  }

  nextStep() {
    this.step = ++this.step % 4
    if (this.step === 0) {
      this.step = 1
      this.option = null
    }
  }

  previous() {
    this.step = --this.step % 4
    if (this.step === 0) {
      this.step = 1
      this.option = null
    }
  }

  confirmAprove() {
    //console.log(this.valActivData);

    if (this.valActivData['positivePayCheckOutput']) {
      const accounts: any[] = []
      for (const account of this.valActivData['positivePayCheckOutput']) {
        accounts.push(account.account.fullAccountNumber)
      }
      this.confirmdData.listAccountPositivePay = accounts
    }
    if (this.accountNotSelected) {
      const accounts: any[] = []
      for (const account of this.accountNotSelected) {
        accounts.push(account.fullAccountNumber)
      }
      this.confirmdData.listAccountPositivePayDelete = accounts
    }

    //console.log(this.confirmdData);
    this.authorizeSubscription = this.service
      .confirm(this.confirmdData)
      .subscribe((result) => {
        if (!result.error) {
          this.nextStep()
        }
        this.authorizeSubscription.unsubscribe()
      })
  }

  validateAccounts(tableSelected) {
    this.service.validateAccounts(tableSelected).subscribe((response) => {
      if (response.errorCode && response.errorCode !== '0') {
        this.onError(response)
      } else {
        this.valActivData = response
        this.accountNotSelected = []
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.step1.tableAccounts.accountList.length; i++) {
          if (
            tableSelected
              .map((a) => a.fullAccountNumber)
              .indexOf(
                this.step1.tableAccounts.accountList[i].fullAccountNumber,
              ) == -1
          ) {
            this.accountNotSelected.push(
              this.step1.tableAccounts.accountList[i],
            )
          }
        }
        //console.log(this.valActivData);
        this.nextStep()
      }
    })
  }

  finish() {
    this.step = 1
  }
}
