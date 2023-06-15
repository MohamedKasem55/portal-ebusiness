import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  EventEmitter,
  Output,
} from '@angular/core'
import { FormBuilder, FormControl } from '@angular/forms'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { Account } from 'app/Application/Model/account'
import { Subscription } from 'rxjs'
import { StopPaymentService } from '../../ChequebookManagement/stopPayment/stop-payment.service'
import { StaticService } from '../../Common/Services/static.service'
import { PrePaidCardService } from '../prePaidCard.service'
import { PrepaidCardItem } from '../PrePaidCardList/prePaidCardListModel'
import { Combo } from '../PrePaidCardPayment/prePaidCardPayment-step1.component'
import { PrePaidCardBlockService } from './prePaidCardBlock.service'

@Component({
  selector: 'app-step1',
  templateUrl: './prePaidCardBlock-step1.component.html',
  styleUrls: ['./prePaidCardBlock.component.scss'],
})
export class PrePaidCardBlockStep1Component implements OnInit, OnDestroy {
  @Input() form: any
  @Output() onInit = new EventEmitter<Component>()
  reasonsCombo = []
  operationType: string
  closureOpType: string
  replaceOpType: string
  selectedPrepaidCard: PrepaidCardItem
  subscriptions: Subscription[] = []
  public accounts: Account[]
  public comboAccounts: Combo[]
  constructor(
    private fb: FormBuilder,
    public staticService: StaticService,
    public prepaidCardBlockService: PrePaidCardBlockService,
    private prepaidCardService: PrePaidCardService,
    public translate: TranslateService,
    public sarAccountStopPaymentService: StopPaymentService,
  ) {}

  ngOnInit() {
    this.form?.enable()
    this.onInit.emit(this as Component)
    this.selectedPrepaidCard = this.prepaidCardService.getPrepaidCardSelected()
    this.operationType = this.prepaidCardBlockService.getBlockOperationType()
    this.closureOpType = PrePaidCardBlockService.CLOSURE_OP_TYPE
    this.replaceOpType = PrePaidCardBlockService.REPLACE_OP_TYPE
    // if (this.closureOpType !== this.operationType) {
    this.getDeactivationReasons()
    if (this.replaceOpType === this.operationType) {
      this.getAccounts()
    }
    this.onLanguajeChange()
  }

  public onLanguajeChange() {
    this.subscriptions.push(
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.refreshData()
      }),
    )
  }
  refreshData() {
    this.reasonsCombo = []
    this.getDeactivationReasons()
  }

  private getAccounts(): void {
    this.subscriptions.push(
      this.sarAccountStopPaymentService.getAccounts().subscribe((result) => {
        this.accounts = result
        this.comboAccounts = this.extractAccountKeyValue(this.accounts)
        // Set card account if it is one of user's authorized accounts
        const cardAccount =
          this.prepaidCardService.getPreaidCardDetail().accountNumber
        if (
          this.comboAccounts.some(
            (account) => account.value.fullAccountNumber === cardAccount,
          )
        ) {
          this.form.get('account').patchValue(cardAccount)
        }
      }),
    )
  }

  private extractAccountKeyValue(account: Account[]): Combo[] {
    const accountKeyValue: Combo[] = []
    for (let i = 0; account.length > i; i++) {
      accountKeyValue.push({ key: i, value: account[i] })
    }
    return accountKeyValue
  }

  private getDeactivationReasons(): void {
    this.subscriptions.push(
      this.staticService
        .getAllCombos(['prepaidCardsLostStolen'])
        .subscribe((res) => {
          this.mapComboKeys(res)
          // Temporary make sure closed must not appear
          // this.reasonsCombo = this.reasonsCombo.filter((combo) => combo.value !== 'CLOSED');
        }),
    )
  }

  private mapComboKeys(comboRes): void {
    const keys = Object.keys(comboRes[0].values)
    for (const i in keys) {
      if (keys[i]) {
        this.reasonsCombo.push({
          key: keys[i],
          value: comboRes[0].values[keys[i]],
        })
      }
    }
  }

  public checkRequiredReason(): string | null {
    return this.form.controls.reason.hasError('required') &&
      this.form.controls.reason.touched
      ? 'marginTopAccounts'
      : null
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }
}
