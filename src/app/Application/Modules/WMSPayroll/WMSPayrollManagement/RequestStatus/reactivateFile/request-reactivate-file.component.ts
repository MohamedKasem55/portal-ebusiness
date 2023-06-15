import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { FormBuilder } from '@angular/forms'
import { Exception } from '../../../../../Model/exception'

import { RequestReactivateFileStep1Component } from './request-reactivate-file-step1.component'
import { RequestReactivateFileStep2Component } from './request-reactivate-file-step2.component'

import { TranslateService } from '@ngx-translate/core'
import { StorageService } from '../../../../../../core/storage/storage.service'
import { RequestStatusService } from '../request-status.service'
import { RequestReactivateFileService } from './request-reactivate-file.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  selector: 'app-request-reactivate-file',
  templateUrl: './request-reactivate-file.component.html',
  styleUrls: ['./request-reactivate-file.component.scss'],
})
export class RequestReactivateFileComponent implements OnInit, OnDestroy {
  @ViewChild(RequestReactivateFileStep1Component)
  step1RequestReactivate: RequestReactivateFileStep1Component
  @ViewChild(RequestReactivateFileStep2Component)
  step2RequestReactivate: RequestReactivateFileStep2Component

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

  step1Errors: string[]

  constructor(
    public service: RequestReactivateFileService,
    private fb: FormBuilder,
    private router: Router,
    public translate: TranslateService,
    private requestStatusService: RequestStatusService,
    public storage: StorageService,
  ) {
    this.step = 1
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
      this.requestStatusService.getPaymentFile()
    this.step1Errors = this.requestReactivate['initialBatch'].errors
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
              .saveSalaryPayments(
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
              .deleteSalaryPayments(this.step2RequestReactivate.batch)
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
      this.step1Errors = []
    }
  }

  previous() {
    this.step = --this.step % 4
    if (this.step === 0) {
      this.step = 1
      this.option = null
      this.step1Errors = []
    }
  }

  isValidForm() {
    return this.step2RequestReactivate.valid()
  }

  delete() {
    this.option = this.DeleteOption
    this.initiateBatch =
      this.requestReactivate['initialBatch'].payrollUploadBatch
    this.nextStep()
  }

  initiate() {
    this.option = this.InitiateOption
    this.subscriptions.push(
      this.service
        .reIinistSalaryPayment(this.step1RequestReactivate.batch)
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            this.option = null
            return
          } else {
            this.requestReactivate['initiate'] = result
            this.generateChallengeAndOTP = result.generateChallengeAndOTP
            this.initiateBatch =
              this.requestReactivate['initiate'].newPayrollBatch
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
    this.router.navigate(['/wmspayroll/wmspayroll-management/request-status'])
    this.step1Errors = []
  }
}
