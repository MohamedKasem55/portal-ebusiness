import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { CommercialCardsService } from '../commercial-cards.service'
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { BlockCardsStep1Component } from './blockCards-step1.component'
import { BlockCardsStep2Component } from './blockCards-step2.component'
import { BlockCardsStep3Component } from './blockCards-step3.component'
import { TranslateService } from '@ngx-translate/core'
import { StorageService } from '../../../../core/storage/storage.service'
import {
  BusinessCardsDetails,
  BusinessCardsListItems,
  BusinessDetailAndList,
} from '../commercial-cards-models'
import { BlockCardsService } from './blockCards.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { User } from 'app/Application/Model/user'
@Component({
  selector: 'app-block-card',
  templateUrl: './blockCards.component.html',
  styleUrls: ['./blockCards.component.scss'],
})
export class BlockCardsComponent implements OnInit, OnDestroy {
  @ViewChild('modalErrorBlockCard') public modalErrorBlockCard: ModalDirective
  @ViewChild('modalErrorAccount') public modalErrorAccount: ModalDirective
  @ViewChild('modalErrorCodeOTP') public modalErrorCodeOTP: ModalDirective
  @ViewChild(BlockCardsStep1Component)
  step1: BlockCardsStep1Component
  @ViewChild(BlockCardsStep2Component)
  step2: BlockCardsStep2Component
  @ViewChild(BlockCardsStep3Component)
  step3: BlockCardsStep3Component

  public step: number
  public option: string
  public account: number
  public subscriptions: Subscription[] = []
  public mensajeError: any = {}
  public generateChallengeAndOTP: ResponseGenerateChallenge
  public requestValidate: RequestValidate = new RequestValidate()
  public blockOpType: string
  public unblockOpType: string
  public blockReplOpType: string
  public confirm: Subscription
  public businessCardsDetails: BusinessCardsDetails
  public businessDetailAndList: BusinessDetailAndList
  public businessCardObject: BusinessDetailAndList
  public businessCardItem: BusinessCardsListItems
  public form: any
  public id: string
  public currentUser: User

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public translate: TranslateService,
    public storage: StorageService,
    public commercialCardsService: CommercialCardsService,
    public blockCardsService: BlockCardsService,
    private storageService: StorageService,
  ) {
    this.step = 1
    const hoy = new Date()
    this.form = fb.group({
      reason: ['', Validators.required],
    })
  }

  ngOnInit() {
    const userStorage = JSON.parse(this.storageService.retrieve('currentUser'))
    this.currentUser = userStorage.user
    // Cogemos los datos de la lista y el detalle de la tarjeta
    this.businessCardObject =
      this.commercialCardsService.getBusinessCardsDetailsAndList()
    this.businessCardItem = this.businessCardObject.list
    // this.account = this.commercialCardsService.getAccountNumber();
    this.blockOpType = BlockCardsService.BLOCK_OP_TYPE
    this.blockReplOpType = BlockCardsService.BLOCK_REPL_OP_TYPE
    this.unblockOpType = BlockCardsService.UNBLOCK_OP_TYPE
    this.id = this.businessCardItem.cardSeqNumber
  }

  onInitStep1(events) {
    this.step1 = events
  }

  onInitStep2(events) {
    this.step2 = events
  }
  onInitStep3(events) {
    this.step3 = events
  }

  next() {
    this.businessDetailAndList =
      this.commercialCardsService.getBusinessCardsDetailsAndList()
    const operationType = this.blockCardsService.getBlockOperationType()
    switch (this.step) {
      case 1:
        const reasonBlock = this.form.controls.reason.value

        this.subscriptions.push(
          this.blockCardsService
            .validateBlockCard(
              this.businessDetailAndList.details.businessCardsDetails,
              reasonBlock,
              operationType,
            )
            .subscribe((result) => {
              if (result.errorCode != '0') {
                this.onError(result)
                this.option = null
                this.resetFields(this.form, this.step)
                return
              } else {
                this.mensajeError = {}
                this.generateChallengeAndOTP = result.generateChallengeAndOTP
                this.businessCardsDetails = result.businessCardsDetails
                this.nextStep()
              }
            }),
        )
        break
      case 2:
        this.subscriptions.push(
          this.blockCardsService
            .confirmBlockCard(
              this.businessCardsDetails,
              this.step2.requestValidate,
              operationType,
            )
            .subscribe((result) => {
              if (result.errorCode != '0') {
                this.onError(result)
                this.option = null
                return
              } else {
                this.onError(result)
                this.mensajeError = {}
                this.nextStep()
              }
            }),
        )
        break
      case 3:
        this.finish()
        break
    }
  }

  blockConfirm() {
    this.next()
  }
  blockCancel() {
    this.step = --this.step % 4
    this.form.controls['reason'].value = ''
  }
  nextStep() {
    this.step = ++this.step % 4
    if (this.step === 0) {
      this.step = 1
      this.option = null
    }
  }
  modalErrorhide() {
    this.resetFields(this.form, this.step)
    this.modalErrorAccount.hide()
  }

  previous() {
    this.step = --this.step % 4
    if (this.step === 0) {
      this.step = 1
      this.option = null
    }
    if (this.step === 1) {
      this.resetFields(this.form, this.step)
    }
  }

  finish() {
    this.step = 1
    this.router.navigate(['/businessCards/viewquerycards'])
  }

  isDisabled() {
    if (this.step === 1) {
      if (this.form.controls['reason'].value) {
        return false
      } else {
        return true
      }
    }
    if (this.step === 2) {
      if (this.step2 && this.step2.valid()) {
        return false
      } else {
        return true
      }
    }

    return !this.form.valid
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

  cancel() {
    this.form.reset()
    this.router.navigate(['/businessCards/viewquerycards'])
  }
  resetFields(form: FormGroup, step: number): void {
    if (step === 1) {
      this.form.controls['reason'].value = ''
    }
  }

  public isBloackAndReplace(): boolean {
    return (
      this.blockCardsService.getBlockOperationType() === this.blockReplOpType &&
      this.currentUser.type === 'CA'
    )
  }
}
