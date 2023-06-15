import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { Exception } from 'app/Application/Model/exception'
import { MultiPaymentService } from './multi-payment.service'

@Component({
  selector: 'app-multi-payment',
  templateUrl: './multi-payment.component.html',
  styleUrls: ['./multi-payment.component.scss'],
})
export class MultiPaymentComponent implements OnInit, OnDestroy {
  sharedData: any = {}
  wizardStep: number
  currentComponent: any

  subscriptions: Subscription[] = []

  constructor(
    private service: MultiPaymentService,
    public translate: TranslateService,
    public router: Router,
  ) {
    this.wizardStep = 1
  }

  componentAdded(component) {
    this.currentComponent = component
    component.sharedData = this.sharedData
    this.wizardStep = component.step
  }

  isDisabled() {
    return !this.currentComponent.valid()
  }

  validSearch() {
    if (
      this.sharedData.searchCriteria.amountFrom == '' ||
      this.sharedData.searchCriteria.amountFrom == null ||
      this.sharedData.searchCriteria.amountTo == '' ||
      this.sharedData.searchCriteria.amountTo == null
    ) {
      return true
    }
    return (
      +this.sharedData.searchCriteria.amountFrom <=
      +this.sharedData.searchCriteria.amountTo
    )
  }
  nextStep() {
    switch (this.wizardStep) {
      case 1:
        this.sharedData['isSearchError'] = !this.validSearch()
        if (this.sharedData['isSearchError']) {
          return
        }

        this.sharedData['selectedByPage'] = {}
        this.sharedData['selectedAccount'] = null
        this.sharedData['totalAmount'] = 0
        this.sharedData['totalSelected'] = 0
        this.sharedData['rows'] = 50
        this.subscriptions.push(
          this.service.list(this.sharedData).subscribe((result) => {
            if (
              result.hasOwnProperty('errorCode') &&
              <any>result instanceof Exception
            ) {
              this.sharedData.tableSelectedRows = []
              return
            } else {
              this.sharedData['accounts'] = this.extractAccountKeyValue(
                result.accountsWithSaudiRials,
              )
              if (this.sharedData['accounts'].length == 1) {
                this.sharedData['selectedAccount'] =
                  this.sharedData['accounts'][0].key
              }
              this.sharedData['listBatch'] = result.listBatch
              this.sharedData['errors'] = []
              for (
                let i = 0;
                i < this.sharedData['listBatch'].items.length;
                ++i
              ) {
                this.sharedData['listBatch'].items[i].amountPayment =
                  this.sharedData['listBatch'].items[i].amountDue
                this.sharedData['listBatch'].items[i].errors = { error: false }
              }
              this.next()
            }
          }),
        )
        break
      case 2:
        for (let i = 0; i < this.sharedData.tableSelectedRows.length; ++i) {
          this.sharedData.tableSelectedRows[i].accountNumber =
            this.getAccountByKey(
              this.sharedData['selectedAccount'],
            ).fullAccountNumber
        }
        this.sharedData['account'] = this.getAccountByKey(
          this.sharedData['selectedAccount'],
        )
        this.subscriptions.push(
          this.service.validate(this.sharedData).subscribe((result) => {
            if (
              result.hasOwnProperty('errorCode') &&
              <any>result instanceof Exception
            ) {
              return
            } else if (result['errors']) {
              this.sharedData['errors'] = result['errors']
            } else {
              this.sharedData['generateChallengeAndOTP'] =
                result.generateChallengeAndOTP
              this.sharedData['requestValidate'] = {}
              this.sharedData['batchList'] = result.batchList
              this.sharedData['batch'] = this.extractBatch(result.batchList)
              this.sharedData['errors'] = result.errors
              this.next()
            }
          }),
        )
        break
      case 3:
        this.subscriptions.push(
          this.service.confirm(this.sharedData, false).subscribe((result) => {
            if (
              result.hasOwnProperty('errorCode') &&
              <any>result instanceof Exception
            ) {
              return
            } else {
              this.sharedData['fileName'] = result.fileName
              this.next()
            }
          }),
        )
        break
      case 4:
        this.finish()
        break
    }
  }

  extractBatch(batchList) {
    const list: any = []
    for (let i = 0; i < batchList.notAllowed.length; i++) {
      list.push(batchList.notAllowed[i])
    }
    for (let i = 0; i < batchList.toProcess.length; i++) {
      list.push(batchList.toProcess[i])
    }
    for (let i = 0; i < batchList.toAuthorize.length; i++) {
      list.push(batchList.toAuthorize[i])
    }
    return list
  }

  extractAccountKeyValue(account: any) {
    const accountKeyValue = []
    for (let i = 0; account.length > i; i++) {
      accountKeyValue.push({ key: i, value: account[i] })
    }
    return accountKeyValue
  }

  getAccountByKey(i) {
    for (let k = 0; k < this.sharedData.accounts.length; ++k) {
      if (this.sharedData.accounts[k].key == i) {
        return this.sharedData.accounts[k].value
      }
    }
    return null
  }

  next() {
    this.wizardStep++
    this.router.navigate(['/invoiceHUB/multi-payment/step' + this.wizardStep])
  }

  backButton() {
    this.wizardStep--
    this.router.navigate(['/invoiceHUB/multi-payment/step' + this.wizardStep])
  }

  finish() {
    this.wizardStep = 1
    this.sharedData = {}
    this.router.navigate(['/invoiceHUB/multi-payment/step' + this.wizardStep])
  }

  ngOnInit(): void {
    this.sharedData.totalAmount = 0
    this.sharedData.totalSelected = 0
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }
}
