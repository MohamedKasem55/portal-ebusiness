import {ResponseGenerateChallenge} from 'app/Application/Model/responsegeneratechallenge.type'
import {PrePaidCardService} from '../prePaidCard.service'
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core'
import {Router} from '@angular/router'
import {Subscription} from 'rxjs'
import {ModalDirective} from 'ngx-bootstrap/modal'
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators,} from '@angular/forms'
import {PrePaidCardBlockStep1Component} from './prePaidCardBlock-step1.component'
import {PrePaidCardBlockStep2Component} from './prePaidCardBlock-step2.component'
import {PrePaidCardBlockStep3Component} from './prePaidCardBlock-step3.component'
import {TranslateService} from '@ngx-translate/core'
import {StorageService} from '../../../../core/storage/storage.service'
import {BatchListsContainer, BusinessCardsDetails, TargetsData,} from '../prePaidCardModels'
import {RequestValidate} from 'app/Application/Model/requestvalidateType'
import {PrePaidCardBlockService} from './prePaidCardBlock.service'
import {PrepaidCardItem} from '../PrePaidCardList/prePaidCardListModel'
import {ModelPipe} from 'app/Application/Components/common/Pipes/model-pipe'

@Component({
  selector: 'app-ActivateCards-Block',
  templateUrl: './prePaidCardBlock.component.html',
  styleUrls: ['./prePaidCardBlock.component.scss'],
})
export class PrePaidCardBlockComponent implements OnInit, OnDestroy {
  @ViewChild('modalErrorBlockCard') public modalErrorBlockCard: ModalDirective
  @ViewChild('modalErrorAccount') public modalErrorAccount: ModalDirective
  @ViewChild('modalConfirmBlock') public modalConfirmBlock: ModalDirective
  @ViewChild(PrePaidCardBlockStep1Component)
  step1: PrePaidCardBlockStep1Component
  @ViewChild(PrePaidCardBlockStep2Component)
  step2: PrePaidCardBlockStep2Component
  @ViewChild(PrePaidCardBlockStep3Component)
  step3: PrePaidCardBlockStep3Component

  public step: number
  public option: string
  public account: number
  public subscriptions: Subscription[] = []
  public mensajeError: any = {}
  public generateChallengeAndOTP: ResponseGenerateChallenge
  public requestValidate: RequestValidate = new RequestValidate()
  public typeOperation: string
  public stolenOpType: string
  public replaceOpType: string
  public closureOpType: string
  public targetData: TargetsData
  public cardDetails: BusinessCardsDetails
  public prepaidCardSelected: PrepaidCardItem
  public form: any
  public batchListsContainer: BatchListsContainer
  public routes: any[] = []
  public id: string
  public prePaidCardItem: PrepaidCardItem
  public selectedReason: string

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public translate: TranslateService,
    private modelPipe: ModelPipe,
    public storage: StorageService,
    public prePaidCardService: PrePaidCardService,
    public prePaidCardBlockService: PrePaidCardBlockService,
  ) {
    this.step = 1
    const hoy = new Date()
    this.initForm()
  }

  private initForm(): void {
    this.requiredIfReplaceOption = this.requiredIfReplaceOption.bind(this)
    // if (this.typeOperation !== this.closureOpType) {
    this.form = this.fb.group({
      reason: ['', Validators.required],
      account: ['', this.requiredIfReplaceOption],
    })
  }

  private requiredIfReplaceOption(
    control: AbstractControl,
  ): ValidationErrors | null {
    if (this.replaceOpType === this.typeOperation && !control.value) {
      return { requiredAccount: true }
    }
    return null
  }

  private getSelectedOperationAndTypes(): void {
    this.typeOperation = this.prePaidCardBlockService.getBlockOperationType()
    this.stolenOpType = PrePaidCardBlockService.STOLEN_OP_TYPE
    this.replaceOpType = PrePaidCardBlockService.REPLACE_OP_TYPE
    this.closureOpType = PrePaidCardBlockService.CLOSURE_OP_TYPE
  }

  getRoutes(): any[] {
    const routes = [['prePaidCard.name']]
    if (
      this.prePaidCardBlockService.getBlockOperationType() ===
      PrePaidCardBlockService.STOLEN_OP_TYPE
    ) {
      routes.push(['prePaidCard.cardLostStolen'])
    }
    if (
      this.prePaidCardBlockService.getBlockOperationType() ===
      PrePaidCardBlockService.CLOSURE_OP_TYPE
    ) {
      routes.push(['prePaidCard.cardClosureRequest'])
    }
    if (
      this.prePaidCardBlockService.getBlockOperationType() ===
      PrePaidCardBlockService.REPLACE_OP_TYPE
    ) {
      routes.push(['prePaidCard.cardReplacement'])
    }
    return routes
  }

  ngOnInit() {
    this.prepaidCardSelected = this.prePaidCardService.getPrepaidCardSelected()
    if (!this.prepaidCardSelected) {
      // this.router.navigate(['/prepaid-card/prepaidcardviewquery'])
    }
    this.account = this.prePaidCardService.getAccountNumber()
    this.id = this.prepaidCardSelected?.cardSeqNumber
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
    const typeOperation = this.prePaidCardBlockService.getBlockOperationType()
    const reasonBlock = this.form?.controls.reason.value
    this.prepaidCardSelected = this.prePaidCardService.getPrepaidCardSelected()
    switch (this.step) {
      case 1:
        this.selectedReason = reasonBlock
        if (typeOperation === PrePaidCardBlockService.STOLEN_OP_TYPE) {
          this.subscriptions.push(
            this.prePaidCardBlockService
              .validateStolenCard(
                this.prepaidCardSelected,
                reasonBlock,
                typeOperation,
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
                  this.nextStep()
                }
              }),
          )
        } else if (typeOperation === PrePaidCardBlockService.REPLACE_OP_TYPE) {
          const account = this.form.get('account').value
          this.subscriptions.push(
            this.prePaidCardBlockService
              .validateReplaceCard(
                this.prepaidCardSelected,
                reasonBlock,
                account,
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
                  this.nextStep()
                }
              }),
          )
        } else if (typeOperation === PrePaidCardBlockService.CLOSURE_OP_TYPE) {
          // CANCELLATION
          this.subscriptions.push(
            this.prePaidCardBlockService
              .validateClosureCard(this.prepaidCardSelected)
              .subscribe((result) => {
                if (result.errorCode != '0') {
                  this.onError(result)
                  this.option = null
                  this.resetFields(this.form, this.step)
                  return
                } else {
                  this.mensajeError = {}
                  this.generateChallengeAndOTP = result.generateChallengeAndOTP
                  this.nextStep()
                }
              }),
          )
        }
        break
      case 2:
        this.modalConfirmBlock.show()
        break
      case 3:
        this.finish()
        break
    }
  }

  blockConfirm() {
    const typeOperation = this.prePaidCardBlockService.getBlockOperationType()
    // const reasonBlock = this.step2.toTitleCase(this.modelPipe.transform('prepaidCardsLostStolen', this.form?.controls.reason.value));
    const reasonBlock = this.modelPipe.transform(
      'prepaidCardsLostStolen',
      this.form?.controls.reason.value,
    )

    if (typeOperation === PrePaidCardBlockService.STOLEN_OP_TYPE) {
      this.subscriptions.push(
        this.prePaidCardBlockService
          .confirmStolenCard(
            this.prepaidCardSelected,
            reasonBlock,
            this.step2.requestValidate,
            typeOperation,
          )
          .subscribe((result) => {
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
    } else if (typeOperation === PrePaidCardBlockService.REPLACE_OP_TYPE) {
      this.subscriptions.push(
        this.prePaidCardBlockService
          .confirmReplaceCard(
            this.prepaidCardSelected,
            this.step2.requestValidate,
          )
          .subscribe((result) => {
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
    } else if (typeOperation === PrePaidCardBlockService.CLOSURE_OP_TYPE) {
      this.subscriptions.push(
        this.prePaidCardBlockService
          .confirmClosureCard(
            this.prepaidCardSelected,
            this.step2.requestValidate,
          )
          .subscribe((result) => {
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
    }
  }

  blockCancel() {
    this.step2.requestValidate = new RequestValidate()
    this.step2.authorization.otpInput.nativeElement.focus()
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
    // this.router.navigate(['/prepaid-card/prepaidcardviewquery'])
  }

  isDisabled() {
    this.typeOperation = this.prePaidCardBlockService.getBlockOperationType();
    if (this.step === 1) {
      switch (this.typeOperation) {
        case this.replaceOpType:
          return !this.form?.get('reason').value

        case this.closureOpType:
          return false

        case this.stolenOpType:
          return !this.form?.get('reason').value

        default:
          return true
      }
    }
    if (this.step === 2) {
      return !this.step2.valid()
    }
    return !this.form?.valid
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

  validateStep1fields(): boolean {
    let fieldFillAll = false
    for (let i = 6; i < 13; i++) {
      if (this.form['controls'].digit['controls']['digit' + i].value) {
        fieldFillAll = true
      } else {
        fieldFillAll = false
        break
      }
    }
    return fieldFillAll
  }

  cancel() {
    this.form?.reset()
    // this.router.navigate(['/prepaid-card/prepaidcardviewquery'])
  }
  resetFields(form: FormGroup, step: number): void {
    if (step === 1 && this.form) {
      this.form.controls['reason'].value = ''
    }
  }
}
