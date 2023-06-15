import {
  Component,
  Inject,
  Injector,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Subscription } from 'rxjs'

import { DecimalPipe } from '@angular/common'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { SimpleMQ } from 'ng2-simple-mq'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { StorageService } from '../../../../../core/storage/storage.service'
import { Exception } from '../../../../Model/exception'
import { DetailsPositivePayStep1Component } from './details-positive-pay-step1.component'
import { DetailsPositivePayStep2Component } from './details-positive-pay-step2.component'
import { HistoricalDataService } from './historical-data.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'

@Component({
  selector: 'app-historical-data',
  templateUrl: './historical-data.component.html',
})
export class HistoricalDataComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('historicalTable') table: any
  @ViewChild(DetailsPositivePayStep1Component)
  step1: DetailsPositivePayStep1Component
  @ViewChild(DetailsPositivePayStep2Component)
  step2: DetailsPositivePayStep2Component

  step: number
  option: string
  subscriptions: Subscription[] = []
  mensajeError: any = {}
  generateChallengeAndOTP: ResponseGenerateChallenge
  form: FormGroup
  accounts: any[] = []
  status: any[] = []
  tablePageSize = 20

  positivePayRequest: any = {}
  positivePayDetails: any = {}

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public translate: TranslateService,
    private service: HistoricalDataService,
    public storage: StorageService,
    @Inject(LOCALE_ID) private locale: string,
    private injector: Injector,
    private smq: SimpleMQ,
  ) {
    super()
    this.step = 0
    this.form = fb.group({
      account: ['', Validators.required],
      status: ['', Validators.required],
    })
  }

  createStatus() {
    this.status = [
      {
        value: 'chequebook.unpaid',
        key: 0,
      },
      {
        value: 'chequebook.paid',
        key: 1,
      },
    ]
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }
  ngOnInit() {
    super.ngOnInit()
    this.getAccounts()
    this.createStatus()
  }

  onInitStep1(events) {
    //console.log('onInitStep1', events);
    this.step1 = events
  }

  onInitStep2(events) {
    //console.log('onInitStep2', events);
    this.step2 = events
  }

  getAccounts() {
    this.subscriptions.push(
      this.service.getAccounts().subscribe((result: any) => {
        if (result instanceof Exception) {
          this.onError(result)
          return
        } else {
          this.accounts = result
        }
      }),
    )
  }

  goToDetails(value, row) {
    this.positivePayDetails = row
    const decimalPipe = new DecimalPipe(this.locale)
    //const ammount: number = this.positivePayDetails.amount;
    //this.positivePayDetails.amount = amount;//decimalPipe.transform(ammount, "1.2-2");
    //console.log(this.positivePayDetails.amount);
    this.positivePayDetails.fullAccountNumber =
      this.positivePayRequest.fullAccountNumber
    this.nextStep()
  }

  downloadFile(blob, name) {
    if (blob === null) {
    } else {
      const blobObject = blob
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blobObject, name)
      } else {
        const downloadUrl = URL.createObjectURL(blobObject)
        const link = document.createElement('a')
        link.download = name
        link.href = downloadUrl
        document.body.appendChild(link)
        link.click()
      }
    }
  }

  getXlsx() {
    const data = {
      accountNumber: this.form.controls['account'].value,
      page: 1,
      rows: this.positivePayRequest.totalElements,
      status: this.form.controls['status'].value,
    }
    this.subscriptions.push(
      this.service.getXlsx(data).subscribe((res) => {
        //console.log(res.type);
        if (
          res.hasOwnProperty('error') &&
          (<any>res).error instanceof Exception
        ) {
          this.onError(res)
          return
        } else if (res.type == 'text/xml' || res.type == '') {
          const reader = new FileReader()
          reader.addEventListener(
            'loadend',
            function () {
              const output = JSON.parse(JSON.stringify(reader.result))
              this.handleError(output)
            }.bind(this),
          )
          reader.readAsText(res)
        } else {
          this.downloadFile(res, 'PositivePayCheque.xls')
        }
      }),
    )
  }

  getPdf() {
    const data = {
      accountNumber: this.form.controls['account'].value,
      page: 1,
      rows: this.positivePayRequest.totalElements,
      status: this.form.controls['status'].value,
    }
    this.subscriptions.push(
      this.service.getPdf(data).subscribe((res) => {
        if (
          res.hasOwnProperty('error') &&
          (<any>res).error instanceof Exception
        ) {
          this.onError(res)
          return
        } else if (res.type == 'text/xml' || res.type == '') {
          const reader = new FileReader()
          reader.addEventListener(
            'loadend',
            function () {
              const output = JSON.parse(JSON.stringify(reader.result))
              this.handleError(output)
            }.bind(this),
          )
          reader.readAsText(res)
        } else {
          this.downloadFile(res, 'PositivePayCheque.pdf')
        }
      }),
    )
  }

  goToUpdatePositivePay() {
    this.option = 'update'
    this.nextStep()
  }

  goToDeletePositivePay() {
    this.option = 'delete'
    this.nextStep()
  }

  updatePositivePay() {
    const data = {
      accountNumber: this.positivePayDetails.fullAccountNumber,
      amount: (+this.positivePayDetails.amount).toFixed(2),
      checkNumber: this.positivePayDetails.checkNumber,
    }

    const decimalPipe = new DecimalPipe(this.locale)
    const ammount = data.amount

    const noSeparator = decimalPipe.transform(ammount, '1.2-2')
    data.amount = noSeparator.replace(/,/g, '')

    this.subscriptions.push(
      this.service.updatePositivePay(data).subscribe((result: any) => {
        if (result instanceof Exception) {
          this.onError(result)
          return
        } else {
          this.positivePayDetails = result

          if (
            this.positivePayDetails.positivePayCheckAccountsOutDTO
              .checkStatus === '0'
          ) {
            this.positivePayDetails.positivePayCheckAccountsOutDTO.checkStatusMsg =
              'chequebook.unpaid'
          } else {
            this.positivePayDetails.positivePayCheckAccountsOutDTO.checkStatusMsg =
              'chequebook.paid'
          }
        }
        this.nextStep()
      }),
    )
  }

  deletePositivePay() {
    const data = {
      accountNumber: this.positivePayDetails.fullAccountNumber,
      amount: (+this.positivePayDetails.amount).toFixed(2),
      checkNumber: this.positivePayDetails.checkNumber,
    }
    this.subscriptions.push(
      this.service.deletePositivePay(data).subscribe((result: any) => {
        if (result instanceof Exception) {
          this.onError(result)
          return
        } else {
          this.positivePayDetails = result
        }
        this.nextStep()
      }),
    )
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }

    const data = {
      accountNumber: this.form.controls['account'].value,
      page: pageInfo.offset + 1,
      rows: this.tablePageSize,
      status: this.form.controls['status'].value,
    }

    this.service.getchequebookList(data).subscribe((result: any) => {
      if (result instanceof Exception) {
        this.onError(result)
        return
      } else {
        this.positivePayRequest = result
        if (this.positivePayRequest.items.length === 0) {
          this.previous()
          this.router.navigate([
            '/accounts/chequebook/positive-payment/historical-data',
          ])
          return
        }
        for (let i = 0; i < this.positivePayRequest.items.length; i++) {
          if (this.positivePayRequest.items[i].checkStatus === '0') {
            this.positivePayRequest.items[i].checkStatusMsg =
              'chequebook.unpaid'
          } else {
            this.positivePayRequest.items[i].checkStatusMsg = 'chequebook.paid'
          }
        }
      }
    })
  }

  next() {
    switch (this.step) {
      case 0:
        this.setPage(null)
        this.nextStep()
        break
      case 1:
        this.nextStep()
        break
      case 2:
        this.nextStep()
        break
      case 3:
        if (this.option === 'update') {
          this.updatePositivePay()
        } else if (this.option === 'delete') {
          this.deletePositivePay()
        }
        break
      case 4:
        this.finish()
        break
    }
  }
  nextStep() {
    this.step = ++this.step % 5
    if (this.step === 0) {
      this.step = 1
      this.option = null
    }
  }

  previous() {
    this.step = --this.step % 5
    // if (this.step === 0) {
    //     this.step = 1;
    //     this.option = null;
    // }
  }

  finish() {
    this.step = 1
    this.router.navigate(['/accounts/chequebook/positive-payment'])
  }

  isDisabled() {
    return !this.form.valid
    // return false;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  onError(error: any) {
    const res = error
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }

  handleError(output) {
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
}
