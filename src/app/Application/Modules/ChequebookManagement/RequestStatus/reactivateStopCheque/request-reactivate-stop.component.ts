import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { StorageService } from '../../../../../core/storage/storage.service'
import { Exception } from '../../../../Model/exception'
import { RequestStatusService } from '../request-status.service'
import { RequestReactivateStopStep1Component } from './request-reactivate-stop-step1.component'
import { RequestReactivateStopStep2Component } from './request-reactivate-stop-step2.component'
import { RequestReactivateStopService } from './request-reactivate-stop.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  selector: 'app-request-stop-reactivate',
  templateUrl: './request-reactivate-stop.component.html',
})
export class RequestReactivateStopComponent implements OnInit, OnDestroy {
  @ViewChild(RequestReactivateStopStep1Component)
  step1RequestReactivate: RequestReactivateStopStep1Component
  @ViewChild(RequestReactivateStopStep2Component)
  step2RequestReactivate: RequestReactivateStopStep2Component

  step: number
  option: string

  DeleteOption = 'delete'
  InitiateOption = 'initiate'

  subscriptions: Subscription[] = []
  mensajeError: any = {}

  salaryPayment: any
  paymentDate: any

  requestReactivate: any = {}

  generateChallengeAndOTP: ResponseGenerateChallenge
  requestValidate: RequestValidate

  initiateBatch: any

  constructor(
    public service: RequestReactivateStopService,
    private router: Router,
    public translate: TranslateService,
    private requestStatusService: RequestStatusService,
    public storage: StorageService,
  ) {
    this.step = 1
    this.requestValidate = new RequestValidate()
  }

  ngOnInit() {
    this.requestReactivate['initialBatch'] =
      this.requestStatusService.getrecoverData()
    // this.createForm(this.requestReactivate['initialBatch']);

    //console.log(JSON.parse(this.storage.retrieve("currentUser")), this.storage.retrieve("welcome"));
  }

  extractAccountKeyValue(account: any) {
    const accountKeyValue = []
    for (let i = 0; account.length > i; i++) {
      accountKeyValue.push({
        key: account[i].accountNumber,
        value: account[i],
      })
    }
    return accountKeyValue
  }

  onInitStep1(events) {
    //console.log('onInitStep1', events);
    this.step1RequestReactivate = events
  }

  onInitStep2(events) {
    //console.log('onInitStep2', events);
    this.step2RequestReactivate = events
  }

  next() {
    switch (this.step) {
      case 1:
        this.nextStep()
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
                  this.requestReactivate['initiate'] = result
                  this.generateChallengeAndOTP = result.generateChallengeAndOTP
                  this.initiateBatch =
                    this.requestReactivate['initiate'].batchList
                  this.nextStep()
                }
              }),
          )
        } else if (this.option == this.DeleteOption) {
          this.subscriptions.push(
            this.service
              .delete(this.requestReactivate['initialBatch'])
              .subscribe((result) => {
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

  delete() {
    this.option = this.DeleteOption
    this.initiateBatch = this.requestReactivate['initialBatch']
    this.nextStep()
  }

  initiate() {
    this.option = this.InitiateOption
    this.subscriptions.push(
      this.service
        .validate(this.step1RequestReactivate.batch)
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            this.option = null
            return
          } else {
            this.requestReactivate['initiate'] = result
            this.generateChallengeAndOTP = result.generateChallengeAndOTP
            this.initiateBatch = this.requestReactivate['initiate'].batchList
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
    this.router.navigate(['/accounts/chequebook/request-status'])
  }

  accept() {
    this.step = 1
    this.router.navigate(['/accounts/chequebook/request-status'])
  }

  reject() {
    this.step = 1
    this.router.navigate(['/accounts/chequebook/request-status'])
  }

  edit() {
    this.step = ++this.step % 4
    if (this.step === 0) {
      this.step = 1
      this.option = null
    }
  }
}
