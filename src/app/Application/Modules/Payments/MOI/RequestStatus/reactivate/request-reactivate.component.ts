import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { Subscription } from 'rxjs'
import { StorageService } from '../../../../../../core/storage/storage.service'
import { Exception } from '../../../../../Model/exception'
import { RequestStatusService } from '../request-status.service'
import { RequestReactivateStep1Component } from './request-reactivate-step1.component'
import { RequestReactivateStep2Component } from './request-reactivate-step2.component'
import { RequestReactivateService } from './request-reactivate.service'

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

  urlFinish = ['/payments/moi/request-status']
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

  accounts: any = []
  type: any

  data: any
  isActivating: boolean

  constructor(
    public service: RequestReactivateService,
    private fb: FormBuilder,
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
      this.requestStatusService.getElement()
    this.isActivating = this.requestStatusService.isActivating()

    if (typeof this.requestReactivate['initialBatch'] == 'undefined') {
      this.finish()
      return
    }

    this.accounts = []
    // tslint:disable-next-line:prefer-for-of
    for (
      let i = 0;
      i < this.requestReactivate['initialBatch'].listaccount.length;
      i++
    ) {
      this.accounts.push({
        key: this.requestReactivate['initialBatch'].listaccount[i]
          .fullAccountNumber,
        value: this.requestReactivate['initialBatch'].listaccount[i],
      })
    }

    this.data = this.service.getDataToSend(
      this.requestReactivate['initialBatch'].batch,
    )
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
        break
      case 2:
        if (this.option == this.InitiateOption) {
          this.subscriptions.push(
            this.service
              .save(
                this.requestReactivate['initialBatch'].batch.batchPk,
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
    if (this.step1RequestReactivate) {
      return this.step1RequestReactivate.isValid()
    } else {
      return false
    }
  }

  delete() {
    this.option = this.DeleteOption
    this.initiateBatch = this.requestReactivate['initialBatch'].batch
    this.nextStep()
  }

  initiate() {
    this.option = this.InitiateOption
    this.subscriptions.push(
      this.service
        .reInitiate(this.step1RequestReactivate.data)
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            this.option = null
            return
          } else {
            this.requestReactivate['initiate'] = result
            this.generateChallengeAndOTP = result.generateChallengeAndOTP
            this.initiateBatch = this.requestReactivate['initiate'].batch
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
