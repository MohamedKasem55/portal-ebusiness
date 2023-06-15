import { DecimalPipe } from '@angular/common'
import {
  Component,
  Inject,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { StorageService } from '../../../../../core/storage/storage.service'
import { Exception } from '../../../../Model/exception'
import { SearchByChequeNumberStep1Component } from './search-cheque-number-step1.component'
import { SearchByChequeNumberStep2Component } from './search-cheque-number-step2.component'
import { SearchByChequeNumberService } from './search-cheque-number.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'

@Component({
  selector: 'app-search-cheque-number',
  templateUrl: 'search-cheque-number.component.html',
})
export class SearchByChequeNumberComponent implements OnInit, OnDestroy {
  @ViewChild(SearchByChequeNumberStep1Component)
  step1: SearchByChequeNumberStep1Component
  @ViewChild(SearchByChequeNumberStep2Component)
  step2: SearchByChequeNumberStep2Component

  step: number
  option: string
  subscriptions: Subscription[] = []
  mensajeError: any = {}
  generateChallengeAndOTP: ResponseGenerateChallenge
  form: FormGroup
  accounts: any[] = []
  chequeSelected: any = {}
  chequeDelete: any = {}

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public translate: TranslateService,
    private service: SearchByChequeNumberService,
    public storage: StorageService,
    @Inject(LOCALE_ID) private locale: string,
  ) {
    this.step = 0
    this.form = fb.group({
      account: ['', Validators.required],
      chequeNumber: ['', Validators.required],
    })
  }

  ngOnInit() {
    this.getAccounts()
  }

  onInitStep1(events) {
    //console.log('onInitStep1', events);
    this.step1 = events
  }

  onInitStep2(events) {
    //console.log('onInitStep2', events);
    this.step2 = events
  }

  next() {
    switch (this.step) {
      case 0:
        this.getChequeNumber()
        break
      case 1:
        this.nextStep()
        break
      case 2:
        this.deleteChequeNumber()
        break
      case 3:
        this.finish()
        break
    }
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

  getChequeNumber() {
    const data = {
      accountNumber: this.form.controls['account'].value,
      checkNumber: this.form.controls['chequeNumber'].value,
      page: 1,
      rows: 1,
    }

    this.subscriptions.push(
      this.service.getChequeNumber(data).subscribe((result) => {
        if (result instanceof Exception) {
          this.onError(result)
          return
        } else {
          this.chequeSelected = result
          if (
            this.chequeSelected.positivePayCheckAccountsOutDTO[0]
              .checkStatus === '0'
          ) {
            this.chequeSelected.positivePayCheckAccountsOutDTO[0].checkStatusMsg =
              'chequebook.unpaid'
          } else {
            this.chequeSelected.positivePayCheckAccountsOutDTO[0].checkStatusMsg =
              'chequebook.paid'
          }
          this.nextStep()
        }
      }),
    )
  }

  deleteChequeNumber() {
    const decimalPipe = new DecimalPipe(this.locale)
    const ammount: number =
      this.chequeSelected.positivePayCheckAccountsOutDTO[0].amount
    const noSeparator = decimalPipe.transform(ammount, '1.2-2')
    this.chequeSelected.positivePayCheckAccountsOutDTO[0].amount =
      noSeparator.replace(/,/g, '')

    this.subscriptions.push(
      this.service
        .deleteChequeNumber(
          this.chequeSelected.account.fullAccountNumber,
          this.chequeSelected.positivePayCheckAccountsOutDTO[0].amount,
          this.chequeSelected.positivePayCheckAccountsOutDTO[0].checkNumber,
        )
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            this.chequeDelete = result
            this.nextStep()
          }
        }),
    )
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
    // if (this.step === 0) {
    //     this.step = 1;
    //     this.option = null;
    // }
  }

  finish() {
    this.step = 1
    this.router.navigate(['/accounts/chequebook'])
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  isDisabled() {
    return !this.form.valid
  }
  onError(error: any) {
    const res = error
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }
}
