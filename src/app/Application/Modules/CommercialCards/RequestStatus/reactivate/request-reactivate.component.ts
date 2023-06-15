import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Event, NavigationEnd, Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { StorageService } from '../../../../../core/storage/storage.service'
import { Exception } from '../../../../Model/exception'
import { RequestStatusService } from '../request-status.service'
import { RequestReactivateStep1Component } from './request-reactivate-step1.component'
import { RequestReactivateStep2Component } from './request-reactivate-step2.component'
import { RequestReactivateService } from './request-reactivate.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { CommercialCardsService } from '../../commercial-cards.service'
import { Combo } from '../../CardPayment/cardPayment.models'
import { StopPaymentService } from 'app/Application/Modules/ChequebookManagement/stopPayment/stop-payment.service'
import { isObject } from 'util'
import {
  BusinessCardsList,
  BusinessCardsListItems,
} from '../../commercial-cards-models'

@Component({
  selector: 'app-request-reactivate',
  templateUrl: './request-reactivate.component.html',
  styleUrls: ['./request-reactivate.component.scss'],
})
export class RequestReactivateComponent implements OnInit, OnDestroy {
  @ViewChild(RequestReactivateStep1Component)
  step1RequestReactivate: RequestReactivateStep1Component
  @ViewChild(RequestReactivateStep2Component)
  step2RequestReactivate: RequestReactivateStep2Component

  public step: number
  public option = 'initiate'
  public operation: string
  public DeleteOption = 'delete'
  public InitiateOption = 'initiate'
  public subscriptions: Subscription[] = []
  public mensajeError: any = {}
  public requestReactivate = {}
  public requestReactivateOld = {}
  public accounts: any
  public generateChallengeAndOTP: ResponseGenerateChallenge
  public requestValidate: RequestValidate
  public initiateBatch: any
  public form: FormGroup
  public comboAccounts: Combo[]
  private businessCardList: BusinessCardsListItems[]

  constructor(
    public service: RequestReactivateService,
    public sarAccountStopPaymentService: StopPaymentService,
    private fb: FormBuilder,
    private router: Router,
    public translate: TranslateService,
    private requestStatusService: RequestStatusService,
    public storage: StorageService,
    public commercialCardsService: CommercialCardsService,
  ) {
    this.step = 1
    const hoy = new Date()
    this.requestValidate = new RequestValidate()
    this.form = this.fb.group({
      account: [null, Validators.required],
      amount: [null, Validators.required],
      paymentOption: [null, Validators.required],
    })
  }

  ngOnInit() {
    this.subscriptions.push(
      this.sarAccountStopPaymentService.getAccounts().subscribe((result) => {
        this.accounts = result
        this.comboAccounts = this.extractAccountKeyValue(this.accounts)
        this.requestReactivate['initialBatch'] =
          this.requestStatusService.getCardDetails()
        this.createForm(this.requestReactivate['initialBatch'])
        if (this.commercialCardsService.getBusinessCardsList()) {
          this.businessCardList =
            this.commercialCardsService.getBusinessCardsList()
          this.completeBatch()
        }
      }),
    )
  }

  private completeBatch(): void {
    const card = this.businessCardList.find(
      (item) =>
        item.cardSeqNumber === this.requestReactivate['initialBatch'].cardId,
    )

    this.requestReactivate['initialBatch'] = {
      ...this.requestReactivate['initialBatch'],
      holderName: card.embossingName,
    }
    this.initiateBatch = {
      ...this.initiateBatch,
      holderName: card.embossingName,
    }
  }

  createForm(data) {
    if (data) {
      this.form.controls['amount'].patchValue(data.amount)
      this.form.controls['paymentOption'].patchValue(+data.paymentOption)
      this.form.controls['account'].patchValue(data.accountNumber)
    }
  }

  extractAccountKeyValue(account: any) {
    const accountKeyValue = []
    if (account && account.length > 0) {
      for (let i = 0; account.length > i; i++) {
        accountKeyValue.push({ key: i, value: account[i] })
      }
    }
    return accountKeyValue
  }

  getKeyAccount(account: any) {
    if (account) {
      for (let i = this.accounts.length - 1; i >= 0; i--) {
        if (this.accounts[i].value.accountNumber == account) {
          return this.accounts[i].key
        }
      }
    }
    return
  }

  onInitStep1(events) {
    this.step1RequestReactivate = events
  }

  onInitStep2(events) {
    this.step2RequestReactivate = events
  }

  next() {
    switch (this.step) {
      case 1:
        this.initiate()
        break
      case 2:
        if (this.option == this.InitiateOption) {
          this.subscriptions.push(
            this.service
              .save(
                this.step2RequestReactivate.batch,
                this.step2RequestReactivate.requestValidate,
                this.requestReactivateOld,
              )
              .subscribe((result) => {
                if (result instanceof Exception) {
                  this.onError(result)
                  this.option = null
                  return
                } else {
                  this.requestReactivate['initiate'] = result
                  this.nextStep()
                }
              }),
          )
        } else if (this.option == this.DeleteOption) {
          this.subscriptions.push(
            this.service.delete(this.initiateBatch).subscribe((result) => {
              if (result instanceof Exception) {
                this.onError(result)
                this.option = null
                return
              } else {
                this.nextStep()
              }
            }),
          )
        }
        break
      case 3:
        this.nextStep()

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

  isValidForm() {
    return this.step2RequestReactivate.valid()
  }

  isValidStep1Form() {
    return this.step1RequestReactivate.valid()
  }

  delete() {
    this.option = this.DeleteOption
    this.initiateBatch = this.requestReactivate['initialBatch']
    this.nextStep()
  }

  initiate() {
    this.option = this.InitiateOption
    this.requestReactivate['initialBatch']['amount'] =
      this.step1RequestReactivate.form.controls['amount'].value
    this.requestReactivate['initialBatch']['paymentOption'] =
      this.step1RequestReactivate.form.controls['paymentOption'].value
    this.requestReactivate['initialBatch']['account'] =
      this.step1RequestReactivate.form.controls['account'].value

    this.subscriptions.push(
      this.service
        .validate(this.requestReactivate['initialBatch'])
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            this.option = null
            return
          } else {
            this.initiateBatch = result.businessCardPaymentBatch
            if (!this.initiateBatch.rejectedReason) {
              this.initiateBatch = {
                ...this.initiateBatch,
                rejectedReason:
                  this.requestReactivate['initialBatch'].rejectedReason,
              }
            }
            this.completeBatch()
            this.generateChallengeAndOTP = result.generateChallengeAndOTP
            this.requestReactivateOld = result.oldBusinessCardPaymentBatch
            this.nextStep()
          }
        }),
    )
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  onError(error: any) {
    const res = error
    this.mensajeError['code'] = res.errorCode
    this.mensajeError['description'] = res.errorDescription
  }

  finish() {
    this.step = 1
    this.router.navigate(['/businessCards/requeststatus'])
  }
}
