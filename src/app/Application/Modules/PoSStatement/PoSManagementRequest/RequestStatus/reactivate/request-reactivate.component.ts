import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'

import { FormBuilder } from '@angular/forms'

import { Exception } from '../../../../../Model/exception'

import { RequestReactivateStep1Component } from './request-reactivate-step1.component'
import { RequestReactivateStep2Component } from './request-reactivate-step2.component'

import { TranslateService } from '@ngx-translate/core'
import { StorageService } from '../../../../../../core/storage/storage.service'
import { ManageRequestService } from '../../manage-request.service'
import { RequestStatusService } from '../request-status.service'
import { RequestReactivateService } from './request-reactivate.service'

@Component({
  selector: 'app-request-reactivate',
  templateUrl: './request-reactivate.component.html',
  styleUrls: ['./request-reactivate.component.scss'],
})
export class RequestReactivateComponent implements OnInit, OnDestroy {
  @ViewChild(RequestReactivateStep1Component, { static: false })
  step1RequestReactivate: RequestReactivateStep1Component
  @ViewChild(RequestReactivateStep2Component, { static: false })
  step2RequestReactivate: RequestReactivateStep2Component

  urlFinish = ['/posstatement/pos-manage-request/request-status']
  step: number
  option: string

  DeleteOption = 'delete'
  InitiateOption = 'initiate'

  subscriptions: Subscription[] = []
  mensajeError: any = {}

  requestReactivate = {}

  generateChallengeAndOTP: any
  requestValidate: any = {}

  initiateBatch: any

  comboTerminal: any
  terminals: any

  constructor(
    public service: RequestReactivateService,
    private fb: FormBuilder,
    private router: Router,
    public translate: TranslateService,
    private requestStatusService: RequestStatusService,
    public storage: StorageService,
    public serviceManage: ManageRequestService,
  ) {
    this.step = 1
  }

  ngOnInit() {
    this.requestReactivate['initialBatch'] =
      this.requestStatusService.getElement()
    this.subscriptions.push(
      this.serviceManage.getTerminals().subscribe((result) => {
        this.terminals = result.terminals
      }),
    )
  }

  onInitStep1(events) {
    this.step1RequestReactivate = events
  }

  onInitStep2(events) {
    //console.log('onInitStep2', events);
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

  delete() {
    this.option = this.DeleteOption
    this.initiateBatch = this.requestReactivate['initialBatch']
    this.nextStep()
  }

  initiate() {
    this.option = this.InitiateOption
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