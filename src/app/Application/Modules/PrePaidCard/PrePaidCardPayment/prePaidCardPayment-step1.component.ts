import { AbstractControl } from '@angular/forms'
import { Validators, ValidatorFn } from '@angular/forms'
import { FormControl } from '@angular/forms'
import { PrePaidCardService } from '../prePaidCard.service'
import { ListWithSelect, TargetsData } from '../prePaidCardModels'
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
import { FormBuilder } from '@angular/forms'
import { StaticService } from '../../Common/Services/static.service'
import { PrePaidCardPaymentService } from './prePaidCardPayment.service'
import { PrepaidCardItem } from '../PrePaidCardList/prePaidCardListModel'
import { StopPaymentService } from '../../ChequebookManagement/stopPayment/stop-payment.service'
import { StorageService } from 'app/core/storage/storage.service'
import { User } from 'app/Application/Model/user'
import { PrepaidCardDetails } from '../PrePaidCardViewQuery/prePaidCardDetailModel'

export class Combo {
  key: number
  value: Account
}
/* tslint:disable:max-classes-per-file */
@Component({
  selector: 'app-step1',
  templateUrl: './prePaidCardPayment-step1.component.html',
  styleUrls: ['./prePaidCardPayment.component.scss'],
})
export class PrePaidCardPaymentStep1Component implements OnInit, OnDestroy {
  @Input() form: any
  @Output() onInit = new EventEmitter<Component>()
  public sharedData: any = {}
  public subscriptions: Subscription[] = []
  public deliveryMethods: any[] = []
  public mensajeError: any = {}
  public accounts: Account[]
  public detailsCard: TargetsData
  public data: ListWithSelect = { id: 0, targetsData: [] }
  public comboAccounts: Combo[]
  public id: string
  public prepaidCardSelected: PrepaidCardItem
  public typeOperation: string
  public refundType: string
  public currentUser: User
  public prepaidCardDetails: PrepaidCardDetails
  constructor(
    private fb: FormBuilder,
    public sarAccountStopPaymentService: StopPaymentService,
    public staticService: StaticService,
    public prePaidCardPaymentService: PrePaidCardPaymentService,
    public prePaidCardService: PrePaidCardService,
    private storageService: StorageService,
  ) {}

  ngOnInit() {
    // get current user from storage
    const infoUser = JSON.parse(this.storageService.retrieve('currentUser'))
    this.currentUser = infoUser.user
    this.refundType = PrePaidCardPaymentService.REFUND_FUNDS_TYPE
    this.typeOperation = this.prePaidCardService.getPaymentTypeFunds()
    this.prepaidCardSelected = this.prePaidCardService.getPrepaidCardSelected()
    this.prepaidCardDetails = this.prePaidCardService.getPreaidCardDetail()
    this.id = this.prepaidCardSelected?.cardSequence
    this.subscriptions.push(
      this.sarAccountStopPaymentService.getAccounts().subscribe((result) => {
        this.accounts = result
        this.comboAccounts = this.extractAccountKeyValue(this.accounts)
        if (this.prepaidCardSelected) {
          this.setAccountValidator()
        }
      }),
    )
    this.onInit.emit(this as Component)
  }

  private setAccountValidator() {
    if (
      this.comboAccounts.some(
        (account) =>
          account.value.fullAccountNumber ===
          this.prepaidCardSelected.sibAccountNumber,
      )
    ) {
      ;(this.form.get('accountFrom') as FormControl).patchValue(
        this.prepaidCardSelected.sibAccountNumber,
      )
    }

    const accountControl = this.form.get('accountFrom') as FormControl
    accountControl.setValidators([
      Validators.required,
      this.accountBalanceValidator(),
    ])
    accountControl.updateValueAndValidity()
  }

  private accountBalanceValidator(): ValidatorFn | null {
    return (control: AbstractControl) => {
      if (
        control.value &&
        this.typeOperation === PrePaidCardPaymentService.LOAD_FUNDS_TYPE &&
        this.accounts.find(
          (account) => account.fullAccountNumber === control.value,
        ).availableBalance <= 0
      ) {
        return { errorEmptyAccount: true }
      }
      // if (control.value && this.accounts
      //   .find((account) => account.fullAccountNumber === control.value).availableBalance <= 0) {
      //   return { errorEmptyAccount: true }
      // }
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

  extractAccountKeyValue(account: Account[]): Combo[] {
    const accountKeyValue: Combo[] = []
    for (let i = 0; account.length > i; i++) {
      accountKeyValue.push({ key: i, value: account[i] })
    }
    return accountKeyValue
  }

  public isLoadFunds(): boolean {
    return this.typeOperation === PrePaidCardPaymentService.LOAD_FUNDS_TYPE
  }

  public isRefundFunds(): boolean {
    return this.typeOperation === PrePaidCardPaymentService.REFUND_FUNDS_TYPE
  }
}
