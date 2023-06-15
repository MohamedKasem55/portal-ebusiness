import { ActivateCardsService } from './activateCards.service'
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  Input,
} from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import {
  FormControl,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { ActivateCardsStep1Component } from './activateCards-step1.component'
import { ActivateCardsStep2Component } from './activateCards-step2.component'
import { ActivateCardsStep3Component } from './activateCards-step3.component'
import { TranslateService } from '@ngx-translate/core'
import { StorageService } from '../../../../core/storage/storage.service'
import { CommercialCardsService } from '../commercial-cards.service'
import {
  BusinessCardsListItems,
  BusinessCardsDetailsResponse,
  BusinessDetailAndList,
} from '../commercial-cards-models'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { ResetPINService } from '../ResetPIN/resetPIN.service'
@Component({
  selector: 'app-ActivateCards',
  templateUrl: './activateCards.component.html',
  styleUrls: ['./activateCards.component.scss'],
})
export class ActivateCardsComponent implements OnInit, OnDestroy {
  @ViewChild('modalErrorAccount') public modalErrorAccount: ModalDirective
  @ViewChild('modalErrorCodeOTP') public modalErrorCodeOTP: ModalDirective
  @ViewChild(ActivateCardsStep1Component)
  step1: ActivateCardsStep1Component
  @ViewChild(ActivateCardsStep2Component)
  step2: ActivateCardsStep2Component
  @ViewChild(ActivateCardsStep3Component)
  step3: ActivateCardsStep2Component

  public step: number
  public option: string
  public accountNumber: number
  public subscriptions: Subscription[] = []
  public mensajeError: any = {}
  public validateAccount: Subscription
  public validateOTP: Subscription
  public confirmActive: Subscription
  public registerNewPin: Subscription
  public generateChallengeAndOTP: ResponseGenerateChallenge
  public requestValidate: RequestValidate = new RequestValidate()
  public businessCardList: BusinessCardsListItems
  public businessCardsDetails: BusinessCardsDetailsResponse
  public businessCardObject: BusinessDetailAndList
  public businessCardItem: BusinessCardsListItems

  constructor(
    private router: Router,
    public translate: TranslateService,
    public storage: StorageService,
    public commercialCardsService: CommercialCardsService,
    public resetPINService: ResetPINService,
    public activateCardsService: ActivateCardsService,
  ) {
    this.step = 1
  }

  ngOnInit() {
    this.businessCardObject =
      this.commercialCardsService.getBusinessCardsDetailsAndList()
    if (!this.businessCardObject) {
      this.router.navigate(['businessCards/viewquerycards'])
    }
    this.businessCardList = this.businessCardObject?.list
    this.businessCardsDetails = this.businessCardObject?.details
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

  getRoutes(): any[] {
    const routes = [
      ['commercialCards.name', ['/businessCards/menu']],
      ['commercialCards.cardActivation'],
    ]
    return routes
  }

  next() {
    switch (this.step) {
      case 1:
        this.subscriptions.push(
          this.activateCardsService
            .validateActivate(this.businessCardObject)
            .subscribe((result) => {
              if (result.errorCode != '0') {
                this.onError(result)
                this.option = null
                return
              } else {
                this.mensajeError = {}
                this.generateChallengeAndOTP = result.generateChallengeAndOTP
                console.warn('typeAuthentication', this.generateChallengeAndOTP)
                this.nextStep()
              }
            }),
        )
        break
      case 2:
        this.subscriptions.push(
          this.activateCardsService
            .confirmActivate(
              this.businessCardObject,
              this.step2.requestValidate,
            )
            .subscribe((result) => {
              console.warn('result', result)
              if (result.errorCode != '0') {
                this.onError(result)
                this.option = null
                return
              } else {
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

  nextStep() {
    this.step = ++this.step % 5
    if (this.step === 0) {
      this.step = 1
      this.option = null
    }
  }

  previous() {
    this.step = --this.step % 5
    if (this.step === 0) {
      this.step = 1
      this.option = null
    }
  }

  finish() {
    this.step = 1
    this.router.navigate(['/businessCards/viewquerycards'])
  }

  isDisabled() {
    if (this.step === 2) {
      return !this.step2?.valid()
    }
    return false
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

  cardActivationError() {
    this.router.navigate(['/businessCards/menu'])
  }

  goActivateCards() {
    this.router.navigate(['/businessCards/activatecards'])
  }

  modalErrorhide() {
    this.modalErrorAccount.hide()
  }

  tryAgain() {
    this.modalErrorCodeOTP.hide()
    this.onInitStep3(null)
    this.router.navigate(['/businessCards/activatecards'])
    this.step = 3
  }

  goToReset(component) {
    this.resetPINService.setResetOperationType(ResetPINService.RESET_OP_TYPE)
    this.commercialCardsService.setBusinessCardsDetailsAndList(
      this.businessCardObject,
    )
    this.router.navigate(['/businessCards/resetpin'])
  }

  cancel() {
    this.router.navigate(['/businessCards/viewquerycards'])
  }
}
