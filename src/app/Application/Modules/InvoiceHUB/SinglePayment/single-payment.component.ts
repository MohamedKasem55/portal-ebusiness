import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { Exception } from 'app/Application/Model/exception'
import { SinglePaymentService } from './single-payment.service'

@Component({
  selector: 'app-single-payment',
  templateUrl: './single-payment.component.html',
  styleUrls: ['./single-payment.component.scss'],
})
export class SinglePaymentComponent implements OnInit, OnDestroy {
  sharedData: any = {}
  wizardStep: number
  currentComponent: any

  subscriptions: Subscription[] = []

  constructor(
    private service: SinglePaymentService,
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

  nextStep() {
    switch (this.wizardStep) {
      case 1:
        this.subscriptions.push(
          this.service.list(this.sharedData).subscribe((result) => {
            if (
              result.hasOwnProperty('error') &&
              (<any>result).error instanceof Exception
            ) {
              return
            } else {
              this.sharedData['accounts'] = this.extractAccountKeyValue(
                result.accountsWithSaudiRials,
              )
              if (
                this.sharedData['accounts'] &&
                this.sharedData['accounts'].length == 1
              ) {
                this.sharedData['selectedAccount'] =
                  this.sharedData['accounts'][0].key
              }
              this.sharedData['listBatch'] = result.listBatch
              this.sharedData['invoice'] = result.listBatch.items[0]
              if (this.sharedData.invoice.billCategory == 'PARTIAL') {
                this.sharedData['invoice'].amountPayment = 0
              } else {
                this.sharedData['invoice'].amountPayment =
                  this.sharedData['invoice'].amountDue
              }
              this.next()
            }
          }),
        )
        break
      case 2:
        this.sharedData['account'] = this.getAccountByKey(
          this.sharedData['selectedAccount'],
        )
        this.sharedData['invoice'].accountNumber =
          this.sharedData['account'].fullAccountNumber
        this.subscriptions.push(
          this.service.validate(this.sharedData).subscribe((result) => {
            if (
              result.hasOwnProperty('error') &&
              (<any>result).error instanceof Exception
            ) {
              return
            } else if (result['errors']) {
              this.sharedData['errors'] = result['errors']
            } else {
              this.sharedData['futureSecurityLevelsDTOList'] =
                this.extractFutureSecurityLevelsDTOList(result)
              this.sharedData['generateChallengeAndOTP'] =
                result.generateChallengeAndOTP
              this.sharedData['requestValidate'] = {}
              this.sharedData['batchList'] = result.batchList
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
              result.hasOwnProperty('error') &&
              (<any>result).error instanceof Exception
            ) {
              return
            } else {
              this.sharedData['batchsFailed'] = result.batchsFailed
              this.sharedData['batchsSuccessful'] = result.batchsSuccessful
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

  extractFutureSecurityLevelsDTOList(result: any) {
    if (
      result['batchList']['toAuthorize'] &&
      result['batchList']['toAuthorize'].length > 0
    ) {
      return result['batchList']['toAuthorize'][0].futureSecurityLevelsDTOList
    }
    if (
      result['batchList']['toProcess'] &&
      result['batchList']['toProcess'].length > 0
    ) {
      return result['batchList']['toProcess'][0].futureSecurityLevelsDTOList
    }
    return null
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
    this.router.navigate(['/invoiceHUB/single-payment/step' + this.wizardStep])
  }

  backButton() {
    this.wizardStep--
    this.router.navigate(['/invoiceHUB/single-payment/step' + this.wizardStep])
  }

  finish() {
    this.wizardStep = 1
    this.sharedData = {}
    this.router.navigate(['/invoiceHUB/single-payment/step' + this.wizardStep])
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }
}
