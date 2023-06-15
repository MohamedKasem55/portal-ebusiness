import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Subscription } from 'rxjs'
import { CompanyAdminAccountsService } from '../Services/company-admin-account.service'
import { CompanyAdminPOSAccountsStep1Component } from './pos-accounts/pos-accounts-step1.component'
import { Router } from '@angular/router'
import { CompanyAdminPOSAccountsStep2Component } from './pos-accounts/pos-accounts-step2.component'
import { CompanyAdminPOSAccountsStep3Component } from './pos-accounts/pos-accounts-step3.component'

@Component({
  templateUrl: '../View/company-admin-account.component.html',
})
export class CompanyAdminAccounts implements OnInit, OnDestroy {
  @ViewChild(CompanyAdminPOSAccountsStep1Component)
  step1: CompanyAdminPOSAccountsStep1Component
  @ViewChild(CompanyAdminPOSAccountsStep2Component)
  step2: CompanyAdminPOSAccountsStep2Component
  @ViewChild(CompanyAdminPOSAccountsStep3Component)
  step3: CompanyAdminPOSAccountsStep3Component

  accounts: any
  step: number
  accountNotSelected: any[] = []
  permissionList: any[] = []
  subscriptions: Subscription[] = []
  tableAccounts: any = {}
  accountSelected: any[] = []
  tableDisplaySize = 20
  pageNumber = 1
  messageError: any
  authorizeSubscription: Subscription

  constructor(
    public service: CompanyAdminAccountsService,
    private router: Router,
  ) {
    this.step = 1
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

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
    this.messageError['code'] = res.error.errorCode
    this.messageError['description'] = res.error.errorDescription
  }

  isDisabled() {
    return false
  }

  next() {
    switch (this.step) {
      case 1:
        this.validateApprove()
        break
      case 2:
        this.confirmApprove()
        break
      case 3:
        this.finish()
        break
    }
  }

  validateApprove() {
    this.accountNotSelected.splice(0, this.accountNotSelected.length)
    this.accountSelected.splice(0, this.accountSelected.length)
    this.permissionList.splice(0, this.permissionList.length)
    this.tableAccounts = this.step1.tableAccounts
    this.accountSelected = this.step1.tableSelected
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.tableAccounts.accountListDTO.length; i++) {
      if (
        this.accountSelected
          .map((a) => a.fullAccountNumber)
          .indexOf(this.tableAccounts.accountListDTO[i].fullAccountNumber) == -1
      ) {
        this.accountNotSelected.push(this.tableAccounts.accountListDTO[i])
      }
      this.permissionList.push(
        !(
          this.accountSelected
            .map((a) => a.fullAccountNumber)
            .indexOf(this.tableAccounts.accountListDTO[i].fullAccountNumber) ==
          -1
        ),
      )
    }
    this.nextStep()
  }

  confirmApprove() {
    this.step2.tableAccounts.permissionList = this.permissionList
    this.authorizeSubscription = this.service
      .saveAccount(this.step2.tableAccounts)
      .subscribe((result) => {
        if (!result.error) {
          this.nextStep()
        }
        this.authorizeSubscription.unsubscribe()
      })
  }

  nextStep() {
    this.step = ++this.step % 4
    if (this.step === 0) {
      this.step = 1
    }
  }

  previous() {
    this.step = --this.step % 4
    if (this.step === 0) {
      this.step = 1
    }
  }

  finish() {
    this.step = 1
  }
}
