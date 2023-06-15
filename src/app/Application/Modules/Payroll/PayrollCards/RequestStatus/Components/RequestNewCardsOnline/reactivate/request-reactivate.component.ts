import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'

import { FormBuilder } from '@angular/forms'

import { RequestReactivateNewCardStep1Component } from './request-reactivate-step1.component'
import { RequestReactivateNewCardStep2Component } from './request-reactivate-step2.component'

import { TranslateService } from '@ngx-translate/core'
import { StorageService } from '../../../../../../../../core/storage/storage.service'
import { Exception } from '../../../../../../../Model/exception'
import { RequestStatusService } from '../../../request-status.service'
import { RequestReactivateNewCardService } from './request-reactivate.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  selector: 'app-request-reactivate-new-card-payment',
  templateUrl: './request-reactivate.component.html',
  styleUrls: ['./request-reactivate.component.scss'],
})
export class RequestReactivateNewCardComponent implements OnInit, OnDestroy {
  @ViewChild(RequestReactivateNewCardStep1Component)
  step1RequestReactivate: RequestReactivateNewCardStep1Component
  @ViewChild(RequestReactivateNewCardStep2Component)
  step2RequestReactivate: RequestReactivateNewCardStep2Component

  step: number
  option: string

  DeleteOption = 'delete'
  InitiateOption = 'initiate'

  subscriptions: Subscription[] = []
  mensajeError: any = {}

  salaryPayment: any
  paymentDate: any

  requestReactivate = {}

  generateChallengeAndOTP: ResponseGenerateChallenge
  requestValidate: RequestValidate

  initiateBatch: any

  cic: any
  companyName: any

  constructor(
    public service: RequestReactivateNewCardService,
    private fb: FormBuilder,
    private router: Router,
    public translate: TranslateService,
    private requestStatusService: RequestStatusService,
    public storage: StorageService,
  ) {
    this.step = 1
    const hoy = new Date()
    this.requestValidate = new RequestValidate()
    this.cic = JSON.parse(storage.retrieve('currentUser'))['company'][
      'profileNumber'
    ]
    this.companyName = JSON.parse(storage.retrieve('currentUser'))['company'][
      'companyName'
    ]
  }

  ngOnInit() {
    this.requestReactivate['initialBatch'] =
      this.requestStatusService.getNewCardOnline()
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
        break
      case 2:
        if (this.option == this.InitiateOption) {
          this.subscriptions.push(
            this.service
              .saveNewCard(
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
              .deleteNewCard(this.step2RequestReactivate.batch)
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

  isValid() {
    return this.step1RequestReactivate.valid()
  }

  isValidForm() {
    return this.step2RequestReactivate.valid()
  }

  delete() {
    this.option = this.DeleteOption
    this.nextStep()
  }

  initiate() {
    this.option = this.InitiateOption
    this.subscriptions.push(
      this.service
        .reInitiateNewCard(this.step1RequestReactivate.batch)
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            this.option = null
            return
          } else {
            this.requestReactivate['initiate'] = result
            this.generateChallengeAndOTP = result.generateChallengeAndOTP
            this.initiateBatch =
              this.requestReactivate['initiate'].cardsFeesInquiryDTO
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
    this.router.navigate(['/payroll/payroll-cards/request-status'])
  }
}
