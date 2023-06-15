import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { StorageService } from '../../../../../core/storage/storage.service'
import { Exception } from '../../../../Model/exception'
import { BillPaymentService } from '../../bill/bill-payments/bill-payment.service'
import { RequestBillService } from '../../bill/request-bill/bill.request.service'
import { RequestBillReactivateBillStep1Component } from './request-reactivate-step1.component'
import { RequestBillReactivateBillStep2Component } from './request-reactivate-step2.component'
import { RequestBillReactivateBillService } from './request-reactivate.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  selector: 'app-request-reactivate-bill',
  templateUrl: './request-reactivate.component.html',
  styleUrls: ['./request-reactivate.component.scss'],
})
export class RequestBillReactivateBillComponent implements OnInit, OnDestroy {
  @ViewChild(RequestBillReactivateBillStep1Component)
  step1RequestReactivate: RequestBillReactivateBillStep1Component
  @ViewChild(RequestBillReactivateBillStep2Component)
  step2RequestReactivate: RequestBillReactivateBillStep2Component

  urlFinish = ['/payments/billPayments/request']
  step: number
  option: string

  DeleteOption = 'delete'
  InitiateOption = 'initiate'

  subscriptions: Subscription[] = []
  mensajeError: any = {}

  requestReactivate = {}

  generateChallengeAndOTP: ResponseGenerateChallenge
  requestValidate: RequestValidate

  initiateBatch: any

  comboAccounts: any
  accounts: any

  sharedData = {
    billCodes: [],
    bill: [],
    group: [],
    selected: null,
    selectedBill: null,
  }

  constructor(
    public service: RequestBillReactivateBillService,
    private fb: FormBuilder,
    private router: Router,
    public translate: TranslateService,
    private requestStatusService: RequestBillService,
    public storage: StorageService,
    public billPaymentService: BillPaymentService,
  ) {
    this.requestValidate = new RequestValidate()
  }

  ngOnInit() {
    this.getBillCodes()
    this.requestReactivate['initialBatch'] =
      this.requestStatusService.getElement()
    this.requestReactivate['initialBatch']['newAmount'] =
      this.requestReactivate['initialBatch']['amountPayment']
    //console.log(this.requestReactivate['initialBatch']);
  }

  getBillCodes() {
    this.billPaymentService.getBillCodes().subscribe((result) => {
      if (result.error) {
      } else {
        this.sharedData.billCodes = result.billCodes
        let actualResult
        for (let i = 0; i < this.sharedData.billCodes.length; i++) {
          let notRepeat = true
          actualResult = this.sharedData.billCodes[i]
          if (i === 0) {
            this.sharedData.bill[i] = actualResult
          }
          for (let j = 0; j < this.sharedData.bill.length; j++) {
            if (
              actualResult['categoryEn'] ===
              this.sharedData.bill[j]['categoryEn']
            ) {
              notRepeat = false
            }
          }
          if (notRepeat) {
            this.sharedData.bill.push(actualResult)
          }
        }
      }
      this.step = 1
    })
  }

  onInitStep1(events) {
    this.step1RequestReactivate = events
  }

  onInitStep2(events) {
    //console.log("onInitStep2", events);
    this.step2RequestReactivate = events
  }

  next() {
    switch (this.step) {
      case 1:
        break
      case 2:
        if (this.option == this.InitiateOption) {
          this.subscriptions.push(
            this.service
              .save(
                this.step2RequestReactivate.batch,
                this.step2RequestReactivate.requestValidate,
              )
              .subscribe((result) => {
                if (result instanceof Exception) {
                  this.onError(result)
                  this.option = null
                  return
                } else {
                  this.requestReactivate['final'] = result
                  this.nextStep()
                }
              }),
          )
        } else if (this.option == this.DeleteOption) {
          this.subscriptions.push(
            this.service
              .delete(this.step2RequestReactivate.batch)
              .subscribe((result) => {
                if (result instanceof Exception) {
                  this.onError(result)
                  this.option = null
                  return
                } else {
                  this.requestReactivate['final'] = result
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

  isValid() {
    return this.step1RequestReactivate.isValid()
  }

  delete() {
    this.option = this.DeleteOption
    this.initiateBatch = this.requestReactivate['initialBatch']
    this.nextStep()
  }

  initiate() {
    this.option = this.InitiateOption
    //console.log(this.step1RequestReactivate.batch.billCode);
    this.step1RequestReactivate.batch.billCode =
      this.sharedData.selectedBill.billCode
    //console.log(this.step1RequestReactivate.batch.billCode);
    this.subscriptions.push(
      this.service
        .reIinitiate(this.step1RequestReactivate.batch)
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            this.option = null
            return
          } else {
            this.requestReactivate['initiate'] = result
            this.generateChallengeAndOTP = result.generateChallengeAndOTP
            this.initiateBatch = this.requestReactivate['initiate'].batch
            //console.log("batch", this.initiateBatch);
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
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }

  finish() {
    this.step = 1
    this.router.navigate(this.urlFinish)
  }

  goCancel() {
    this.router.navigate(this.urlFinish)
  }
}
