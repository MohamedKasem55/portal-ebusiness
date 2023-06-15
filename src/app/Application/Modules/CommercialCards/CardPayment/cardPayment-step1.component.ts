import {
  BusinessCardsListItems,
  BusinessDetailAndList,
} from '../commercial-cards-models'
import { CommercialCardsService } from '../commercial-cards.service'
import { CardPaymentService } from './cardPayment.service'
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  EventEmitter,
  Output,
} from '@angular/core'
import { Account } from '../../../Model/account'
import { Subscription } from 'rxjs'
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms'
import { StaticService } from '../../Common/Services/static.service'
import { StopPaymentService } from '../../ChequebookManagement/stopPayment/stop-payment.service'
import { Combo } from './cardPayment.models'

/* tslint:disable:max-classes-per-file */
@Component({
  selector: 'app-CardPayment-step1',
  templateUrl: './cardPayment-step1.component.html',
})
export class CardPaymentStep1Component implements OnInit, OnDestroy {
  @Input() form: any
  @Output() onInit = new EventEmitter<Component>()
  public sharedData: any = {}
  public subscriptions: Subscription[] = []
  public obtainData: Subscription
  public deliveryMethods: any[] = []
  public mensajeError: any = {}
  public accounts: Account[]
  public indexSelected: number
  public comboAccounts: Combo[]
  public businessCardObject: BusinessDetailAndList
  public businessCardItem: BusinessCardsListItems
  constructor(
    private fb: FormBuilder,
    public sarAccountStopPaymentService: StopPaymentService,
    public staticService: StaticService,
    public commercialCardsService: CommercialCardsService,
    public cardPaymentService: CardPaymentService,
  ) {}

  ngOnInit() {
    this.businessCardObject =
      this.commercialCardsService.getBusinessCardsDetailsAndList()
    this.businessCardItem = this.businessCardObject.list
    this.subscriptions.push(
      this.sarAccountStopPaymentService.getAccounts().subscribe((result) => {
        this.accounts = result
        this.comboAccounts = this.extractAccountKeyValue(this.accounts)
        this.setAccountValue()
      }),
    )
    this.setAmountValidators()
    this.onInit.emit(this as Component)
  }

  private setAccountValue(): void {
    if (
      this.comboAccounts.some(
        (account) =>
          account.value.fullAccountNumber ===
          this.businessCardItem.sibAccountNumber,
      )
    ) {
      ;(this.form.get('accountFrom') as FormControl).patchValue(
        this.businessCardItem.sibAccountNumber,
      )
    }
    const accountControl = this.form.get('accountFrom') as FormControl
    // Se añade validacion para cuentas con balance superior a 0.
    accountControl.setValidators([
      Validators.required,
      this.accountBalanceValidator(),
    ])
    accountControl.updateValueAndValidity()
  }

  private setAmountValidators(): void {
    const amountControl = this.form.get('amount') as FormControl
    amountControl.setValidators([
      Validators.required,
      Validators.min(CardPaymentService.MIN_PAYMENT_AMOUNT),
      Validators.max(CardPaymentService.MAX_PAYMENT_AMOUNT),
    ])
    amountControl.updateValueAndValidity()
  }

  private accountBalanceValidator(): ValidatorFn | null {
    return (control: AbstractControl) => {
      if (
        control.value &&
        this.accounts.find(
          (account) => account.fullAccountNumber === control.value,
        ).availableBalance === 0
      ) {
        return { errorEmptyAccount: true }
      }
      return null
    }
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

  extractAccountKeyValue(account: any): Combo[] {
    const accountKeyValue = []
    for (let i = 0; account.length > i; i++) {
      accountKeyValue.push({ key: i, value: account[i] })
    }
    return accountKeyValue
  }

  resetAmount() {
    if (this.form.controls.paymentType.value != 2) {
      if (this.form.get('paymentType').value === 0) {
        this.form
          .get('amount')
          .patchValue(
            this.cardPaymentService.payValueTransform(
              this.businessCardObject?.details?.businessCardsDetails?.stmtAmt,
            ),
          )
      } else if (this.form.get('paymentType').value === 1) {
        this.form
          .get('amount')
          .patchValue(
            this.cardPaymentService.payValueTransform(
              this.businessCardObject?.details?.businessCardsDetails
                ?.unbilledAmt,
            ),
          )
      }
      this.form.controls['amount'].disable()
    } else {
      this.form.controls['amount'].patchValue('')
      this.form.controls['amount'].enable()
    }
  }
}
