import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms'
import { Router } from '@angular/router'
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
import { PrePaidCardRequestService } from '../../PrePaidCardRequest/pre-paid-card-request.service'
import { Combo } from '../../prePaidCardModels'
import { PrePaidCardBlockService } from '../../PrePaidCardBlock/prePaidCardBlock.service'

@Component({
  selector: 'app-request-reactivate',
  templateUrl: './request-reactivate.component.html',
  styleUrls: ['./request-reactivate.component.scss'],
  providers: [PrePaidCardRequestService],
})
export class RequestReactivateComponent implements OnInit, OnDestroy {
  @ViewChild(RequestReactivateStep1Component)
  step1RequestReactivate: RequestReactivateStep1Component
  @ViewChild(RequestReactivateStep2Component)
  step2RequestReactivate: RequestReactivateStep2Component
  step: number
  option: string
  DeleteOption = 'delete'
  InitiateOption = 'initiate'
  mensajeError: any = {}
  salaryPayment: any
  paymentDate: any
  requestReactivate: any = {}
  accounts: any
  generateChallengeAndOTP: ResponseGenerateChallenge
  requestValidate: RequestValidate
  initiateBatch: any
  form: FormGroup
  private subscriptions: Subscription[] = []
  public comboAccounts: Combo[]

  constructor(
    public service: RequestReactivateService,
    private fb: FormBuilder,
    private router: Router,
    public translate: TranslateService,
    private requestStatusService: RequestStatusService,
    public storage: StorageService,
    private requestPrepaidCardService: PrePaidCardRequestService,
  ) {
    this.step = 1
    const hoy = new Date()
    this.requestValidate = new RequestValidate()
    this.requiredIfNotReplace = this.requiredIfNotReplace.bind(this)
    this.form = this.fb.group({
      account: [null, this.requiredIfNotReplace],
      amount: [null, this.requiredIfNotReplace],
      customerName: [{ value: null, disabled: true }],
      customerId: [{ value: null, disabled: true }],
    })
  }

  private requiredIfNotReplace(control: AbstractControl) {
    if (
      this.requestReactivate?.initialBatch?.typeOperation !==
        PrePaidCardBlockService.REPLACE_OP_TYPE &&
      !control.value
    ) {
      return { errorRequired: true }
    }
    return null
  }

  ngOnInit() {
    this.subscriptions.push(
      this.requestPrepaidCardService.getSarAccounts().subscribe((result) => {
        this.accounts = result
        this.comboAccounts = this.extractAccountKeyValue(this.accounts)
        this.getDetailBatch()
        this.createForm(this.requestReactivate['initialBatch'])
      }),
    )
  }

  createForm(data) {
    if (data) {
      this.form.controls['amount'].patchValue(data.amount)
      this.form.controls['customerName'].patchValue(null)
      this.form.controls['customerId'].patchValue(data.passNumber)
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
          if (!this.isReplaceMode()) {
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
                    this.nextStep()
                  }
                }),
            )
          } else {
            this.subscriptions.push(
              this.service
                .saveReplace(
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
                    this.nextStep()
                  }
                }),
            )
          }
        } else if (this.option == this.DeleteOption) {
          if (!this.isReplaceMode()) {
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
          } else {
            this.subscriptions.push(
              this.service
                .deleteReplace(this.initiateBatch)
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
    this.requestReactivate['initialBatch']['accountNumber'] =
      this.step1RequestReactivate.form.controls['account'].value

    if (!this.isReplaceMode()) {
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
              this.generateChallengeAndOTP = result.generateChallengeAndOTP
              this.nextStep()
            }
          }),
      )
    } else {
      this.subscriptions.push(
        this.service
          .validateReplace(this.requestReactivate['initialBatch'])
          .subscribe((result) => {
            if (result instanceof Exception) {
              this.onError(result)
              this.option = null
              return
            } else {
              this.initiateBatch = result.batch
              this.generateChallengeAndOTP = result.generateChallengeAndOTP
              this.nextStep()
            }
          }),
      )
    }
  }

  private getDetailBatch(): void {
    this.requestStatusService.getCardDetails()
      ? (this.requestReactivate['initialBatch'] =
          this.requestStatusService.getCardDetails())
      : this.router.navigate(['/prepaid-card/requeststatus'])
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
    this.router.navigate(['/prepaid-card/requeststatus'])
  }

  public isReplaceMode(): boolean {
    return (
      this.requestReactivate?.initialBatch?.typeOperation ===
      PrePaidCardBlockService.REPLACE_OP_TYPE
    )
  }
}
