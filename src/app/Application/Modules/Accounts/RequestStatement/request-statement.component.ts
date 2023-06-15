import { DatePipe } from '@angular/common'
import { Component, Injector, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { SimpleMQ } from 'ng2-simple-mq'
import { Subscription } from 'rxjs'
import {
  AccountStatementRequest,
  AccountStatementsService,
} from '../Services/account-statements.service'
import { RequestStatementService } from './request-statement.service'
import { Step1Component } from './Steps/Step1/step1.component'
import { Step2Component } from './Steps/Step2/step2.component'
import { Step3Component } from './Steps/Step3/step3.component'

@Component({
  selector: 'app-request-statement',
  templateUrl: './request-statement.component.html',
})
export class RequestStatementComponent implements OnInit, OnDestroy {
  showFinalMsg = false
  showFinalMsgErr = false

  step1: Step1Component
  step2: Step2Component
  step3: Step3Component
  wizardStep = 1
  subscriptions: Subscription[] = []
  existingFile: any

  constructor(
    private datePipe: DatePipe,
    private accountStatementService: AccountStatementsService,
    private smq: SimpleMQ,
    private injector: Injector,
    public translate: TranslateService,
    private router: Router,
    public requestService: RequestStatementService,
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  public deleteExistingFile(): void {
    const filenames = [this.existingFile]
    this.accountStatementService.delete(filenames).subscribe((r) => {
      if (r.errorCode === '0') {
        this.showFinalMsg = true
        this.wizardStep = 3
      } else {
        this.showFinalMsg = false
        this.handleError(r)
      }
    })
  }

  public requestFile(): void {
    const fdate = this.datePipe.transform(this.step1.fromDate, 'yyyy-MM-dd')
    const tdate = this.datePipe.transform(this.step1.toDate, 'yyyy-MM-dd')

    const filterBySelected = []
    if (this.step1.selectedFiltersList.length > 0) {
      this.step1.selectedFiltersList.forEach((item) => {
        filterBySelected.push(item['id'])
      })
    }

    const body: AccountStatementRequest = {
      accountNumber: this.step1.selectedAccount,
      amountFrom: this.step1.amountRangeFrom
        ? this.step1.amountRangeFrom.toString()
        : null,
      amountTo: this.step1.amountRangeTo
        ? this.step1.amountRangeTo.toString()
        : null,
      dateFrom: fdate,
      dateTo: tdate,
      language: this.step1.selectedLanguage,
      type: this.step1.selectedType,
      typeTransaction: +this.step1.transactions,
      filterBySelected,
    }

    this.accountStatementService.requestedNew(body).subscribe((r) => {
      if (r.errorCode === '0') {
        this.existingFile = r.fileName
        if (r.exists) {
          this.showFinalMsg = false
          this.wizardStep = 2
        } else {
          this.showFinalMsg = true
          this.wizardStep = 3
        }
      } else {
        this.handleError(r)
      }
    })
  }

  public back(): void {
    this.showFinalMsg = false
    this.wizardStep--
  }

  finish() {
    this.wizardStep = 1
    this.router.navigate(['/accounts/requestStatement'])
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

  handleError(output) {
    if (typeof output === 'string') {
      output = JSON.parse(output)
    }
    if (output.errorCode && output.errorCode !== '0') {
      let message: string

      if (output.errorCode === '-2') {
        message = 'Following fields contains error:<br/>'
        for (const entry of output.fieldErrors) {
          message =
            message +
            '<b> - Field: ' +
            entry.field +
            ' Error: ' +
            entry.message +
            '</b><br/>'
        }
      } else {
        if (output.errorResponse) {
          if (this.injector.get(TranslateService).currentLang === 'ar') {
            message = output.errorResponse.arabicMessage
          } else {
            message = output.errorResponse.englishMessage
          }
        }
      }

      if (!message || message === '') {
        message = output.errorDescription
      }

      if (!message || message === '') {
        message = 'Operation not available'
      }

      this.subscriptions.push(
        this.translate.get(message).subscribe((value) => {
          this.smq.publish('error-mq', value)
        }),
      )
    }
  }

  checkValidForm() {
    if (typeof this.step1.formulario === 'object') {
      return !this.step1.formulario.valid
    }
    return true
  }
  validCheck() {
    const check = this.requestService.getAmountCheck()
    return check
  }
}
