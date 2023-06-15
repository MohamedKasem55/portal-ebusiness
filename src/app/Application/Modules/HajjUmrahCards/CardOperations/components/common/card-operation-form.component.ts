import { DecimalPipe } from '@angular/common'
import {
  Component,
  Inject,
  Injector,
  Input,
  LOCALE_ID,
  OnDestroy,
  OnInit,
} from '@angular/core'
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { AuthenticationService } from '../../../../../../core/security/authentication.service'
import { ModelPipe } from '../../../../../Components/common/Pipes/model-pipe'
import { CardOperationsEntityService } from '../../card-opeartions-entity.service'

@Component({
  selector: 'app-card-operation-form',
  templateUrl: './card-operation-form.component.html',
})
export class CardOperationFormComponent implements OnInit, OnDestroy {
  @Input() form: FormGroup
  selectedCardOperations: any
  operationType: any

  subscriptions: Subscription[] = []

  constructor(
    public fb: FormBuilder,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    private injector: Injector,
    public router: Router,
    private serviceData: CardOperationsEntityService,
    @Inject(LOCALE_ID) private locale: string,
  ) {}

  ngOnInit() {
    this.operationType = this.serviceData.getSelectedData().operationType
    if (this.serviceData.getSelectedData().batchDTO.toAuthorize.length > 0) {
      this.selectedCardOperations =
        this.serviceData.getSelectedData().batchDTO.toAuthorize
    } else {
      this.selectedCardOperations =
        this.serviceData.getSelectedData().batchDTO.toProcess
    }

    if (this.selectedCardOperations != null) {
      for (let i = 0; this.selectedCardOperations.length > i; i++) {
        this.createCardOperationForm(this.form, this.selectedCardOperations[i])
      }
    }

    this.configureCalculateGrandAmountAndRefund()
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  createCardOperationForm(form: FormGroup, cardOperation: any) {
    form.addControl('amountToProcess', this.fb.control(null, []))
    form.addControl('amountToRefund', this.fb.control(null, []))
    const control = form.controls['cardOperations'] as FormArray
    control.push(this.initCardOperationForm(cardOperation))
  }

  get cardOperations(): FormGroup[] {
    return this.form.controls['cardOperations']['controls']
  }

  initCardOperationForm(cardOperation: any) {
    const decimalPipe = new DecimalPipe(this.locale)
    const cardForm = this.fb.group({
      accountNo: [
        cardOperation != null ? cardOperation.cardNumber : cardOperation,
        null,
      ],
      cardHolderName: [
        cardOperation != null ? cardOperation.cardHolderName : cardOperation,
        null,
      ],
      passportNumber: [
        cardOperation != null ? cardOperation.passportNumber : cardOperation,
        null,
      ],
      visaNumber: [
        cardOperation != null ? cardOperation.visaNumber : cardOperation,
        null,
      ],
      visaExpiryDate: [
        cardOperation != null ? cardOperation.visaExpiryDate : cardOperation,
        null,
      ],
      cardAllocationDate: [
        cardOperation != null
          ? cardOperation.cardAllocationDate
          : cardOperation,
        null,
      ],
      cardExpiryDate: [
        cardOperation != null ? cardOperation.cardExpiryDate : cardOperation,
        null,
      ],
      totalAmount: [
        cardOperation != null && cardOperation.totalAmountLoaded != null
          ? decimalPipe
              .transform(cardOperation.totalAmountLoaded, '1.2-2')
              .replace(/,/g, '')
          : null,
        null,
      ],
      currentBalance: [
        cardOperation != null && cardOperation.currentBalance != null
          ? decimalPipe
              .transform(cardOperation.currentBalance, '1.2-2')
              .replace(/,/g, '')
          : null,
        null,
      ],
      feesAmount: [
        cardOperation != null && cardOperation.expectedFees != null
          ? decimalPipe
              .transform(cardOperation.expectedFees, '1.2-2')
              .replace(/,/g, '')
          : null,
        null,
      ],
      status: [
        cardOperation != null
          ? new ModelPipe(this.injector).transform(
              'hajjCardsStatus',
              cardOperation.cardStatus,
            )
          : cardOperation,
        null,
      ],
      futureSecurityLevels: [
        cardOperation != null
          ? cardOperation.futureSecurityLevelsDTOList
          : cardOperation,
        null,
      ],
    })
    switch (this.operationType) {
      case 'SC':
        cardForm.addControl(
          'cardNumber',
          this.fb.control('', [Validators.required]),
        )
        break
      case 'PR':
        cardForm.addControl(
          'refundAmount',
          this.fb.control(decimalPipe.transform(0, '1.2-2').replace(/,/g, ''), [
            Validators.required,
            Validators.maxLength(10),
            Validators.pattern('^[0-9]*.?[0-9]*$'),
          ]),
        )
        break
      case 'LD':
        cardForm.addControl(
          'loadAmount',
          this.fb.control(decimalPipe.transform(0, '1.2-2').replace(/,/g, ''), [
            Validators.required,
            Validators.maxLength(10),
            Validators.pattern('^[0-9]*.?[0-9]*$'),
          ]),
        )
        break
      case 'UD':
        cardForm.addControl(
          'address',
          this.fb.control(
            cardOperation != null ? cardOperation.address : cardOperation,
            [Validators.required],
          ),
        )
        cardForm.addControl(
          'country',
          this.fb.control(
            cardOperation != null ? cardOperation.country : cardOperation,
            null,
          ),
        )
        cardForm.addControl(
          'city',
          this.fb.control(
            cardOperation != null ? cardOperation.city : cardOperation,
            [Validators.required],
          ),
        )
        cardForm.addControl(
          'email',
          this.fb.control(
            cardOperation != null ? cardOperation.email : cardOperation,
            [Validators.required, this.mailFormat, Validators.maxLength(40)],
          ),
        )
        cardForm.addControl(
          'mobileKSA',
          this.fb.control(
            cardOperation != null ? cardOperation.mobileKSA : cardOperation,
            [Validators.required],
          ),
        )
        cardForm.addControl(
          'mobileNumber',
          this.fb.control(
            cardOperation != null ? cardOperation.mobileNumber : cardOperation,
            [Validators.required, Validators.maxLength(15)],
          ),
        )
        cardForm.addControl(
          'postalCode',
          this.fb.control(
            cardOperation != null ? cardOperation.postalCode : cardOperation,
            [Validators.required],
          ),
        )
        cardForm.addControl(
          'stateRegion',
          this.fb.control(
            cardOperation != null ? cardOperation.stateRegion : cardOperation,
            [Validators.required],
          ),
        )
        cardForm.addControl(
          'passport',
          this.fb.control(
            cardOperation != null
              ? cardOperation.passportNumber
              : cardOperation,
            [Validators.required],
          ),
        )
        break
    }
    return cardForm
  }

  mailFormat(control: FormControl): any {
    if (
      control === null ||
      control === undefined ||
      control.value === null ||
      control.value === undefined
    ) {
      return null
    }
    const EMAIL_REGEXP =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (
      control.value != '' &&
      (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))
    ) {
      return { incorrectMailFormat: true }
    }
    return null
  }

  configureCalculateGrandAmountAndRefund(): void {
    switch (this.operationType) {
      case 'LD':
        for (
          let i = 0;
          i <
          (this.form.controls['cardOperations'] as FormArray).controls.length;
          i++
        ) {
          const cardForm = (this.form.controls['cardOperations'] as FormArray)
            .controls[i]
          this.subscriptions.push(
            cardForm.get('loadAmount').valueChanges.subscribe((value) => {
              this.calculateAmountToProcess()
            }),
          )
        }
        break
      case 'PR':
        ;(this.form.controls['cardOperations'] as FormArray).controls.forEach(
          (cardForm: FormGroup) => {
            this.subscriptions.push(
              cardForm.get('refundAmount').valueChanges.subscribe((value) => {
                this.calculateAmountToRefund()
              }),
            )
          },
        )
        break
    }
  }

  calculateAmountToProcess() {
    let amountToProcess = 0
    ;(this.form.controls['cardOperations'] as FormArray).controls.forEach(
      (cardForm: FormGroup) => {
        amountToProcess += parseFloat(
          cardForm.get('loadAmount').value
            ? cardForm.get('loadAmount').value
            : 0,
        )
      },
    )
    this.form.controls['amountToProcess'].setValue(amountToProcess)
  }

  calculateAmountToRefund() {
    let amountToRefund = 0
    ;(this.form.controls['cardOperations'] as FormArray).controls.forEach(
      (cardForm: FormGroup) => {
        amountToRefund += parseFloat(
          cardForm.get('refundAmount').value
            ? cardForm.get('refundAmount').value
            : 0,
        )
      },
    )
    this.form.controls['amountToRefund'].setValue(amountToRefund)
  }

  validateTwoDecimals(e: any) {
    const input = e.target.value
    const reg = /^\d*\.?\d{0,1}$/
    if (!reg.test(input)) {
      e.preventDefault()
    }
  }
}
