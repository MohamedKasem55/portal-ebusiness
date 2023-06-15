import {
  Component,
  EventEmitter,
  Inject,
  Injector,
  Input,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { Account } from '../../../../../Application/Model/account'
import { Beneficiary } from '../../../../../Application/Model/beneficiary'
import { StorageService } from '../../../../../core/storage/storage.service'
import { Exception } from '../../../../Model/exception'
import { StaticService } from '../../../Common/Services/static.service'
import { TransferInternationalService } from '../../Services/transfer-international.service'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { AmountCurrencyPipe } from '../../../../Components/common/Pipes/amount-currency.pipe'

@Component({
  selector: 'quick-international-transfer-step4',
  templateUrl:
    '../../View/international/home-quick-tranfer-international-step4.html',
})
export class QuickTransferStep4InternationalWidget
  implements OnInit, OnDestroy
{
  @ViewChild('authorization', { static: true }) authorization: any
  @Input() form: FormGroup
  @Input() reasons: any
  @Input() buttonLabel: string
  @Input() accounts: Account[]
  @Input() beneficiaries: Beneficiary[]
  @Input() totalAmount: number
  @Input() confirmSave: any
  @Output() onNext = new EventEmitter<boolean>()
  @Output() onInit = new EventEmitter<Component>()

  currenciesUsers: any[] = []
  totalCurrenciesDesc: any[][] = []
  totalCurrenciesID: any[][] = []
  allCurrencies: string[] = []
  accountsFrom: any

  errorMessage: any = {}
  subscriptions: Subscription[] = []

  requestValidate: RequestValidate
  public vat: number

  selectedCurrency: string
  selectedPropose: string

  constructor(
    private fb: FormBuilder,
    private staticService: StaticService,
    public translate: TranslateService,
    private service: TransferInternationalService,
    private _storage: StorageService,
    private injector: Injector,
    @Inject(LOCALE_ID) private locale: string,
  ) {
    this.accountsFrom = []
    this.requestValidate = new RequestValidate()
  }

  ngOnInit() {
    this.requestValidate = new RequestValidate()

    this.form.disable()
    const combosSolicitados = ['currency']

    this.staticService
      .getAllCombos(combosSolicitados)
      .subscribe((comboData) => {
        const data: any = comboData
        this.allCurrencies =
          data[combosSolicitados.indexOf('currency')]['values']

        for (let i = 0; i < this.beneficiaries.length; i++) {
          this.currenciesUsers.push(
            this.beneficiaries[i]['beneficiaryCurrency'],
          )
        }

        //For each currency of beneficiary get the description
        for (let i = 0; i < this.currenciesUsers.length; i++) {
          // Initialite arrays
          this.totalCurrenciesID[i] = []
          this.totalCurrenciesDesc[i] = []

          this.totalCurrenciesID[i].push(this.currenciesUsers[i]) // Id currency
          this.totalCurrenciesDesc[i].push(
            this.allCurrencies[this.currenciesUsers[i]],
          ) // Desc currency

          // If no exist Saudi Riyal currency
          if (this.currenciesUsers[i] != '608') {
            this.totalCurrenciesID[i].push('608') // Add Saudi Riyal Id currency
            this.totalCurrenciesDesc[i].push(this.allCurrencies['608']) // Add Saudi Riyal Currency
          }
        }
      })

    this.accountsFrom = this.extractAccountKeyValue(this.accounts)
    this.onInit.emit(this as Component)

    const beneficiary = this.form.controls.beneficiaries.value[0]
    this.selectedCurrency = this.allCurrencies[beneficiary.currency]
    const purpose = JSON.parse(beneficiary.propose)
    this.selectedPropose = purpose.purposeDescription

    this.form.addControl('currency', new FormControl(beneficiary.currency))
    this.form.addControl('propose', new FormControl(this.selectedPropose))

    this.calculateVat()
  }

  extractAccountKeyValue(account: any) {
    const accountKeyValue = []
    for (let i = 0; account.length > i; i++) {
      accountKeyValue.push({ key: i, value: account[i] })
    }
    return accountKeyValue
  }

  isAdditionalInfo(value) {
    if (value) {
      const object = JSON.parse(value)
      return object.additionalInfoFlag != 0
    }
    return false
  }

  getLabelAdditionalInfo1(value) {
    if (value) {
      const object = JSON.parse(value)
      return object.additionalInfo1
    }
  }

  getLabelAdditionalInfo2(value) {
    if (value) {
      const object = JSON.parse(value)
      return object.additionalInfo2
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  cancel() {
    this.form.enable()
    this.onNext.emit(false)
  }

  submit() {
    this.subscriptions.push(
      this.service
        .finalizeInit(this.confirmSave, this.requestValidate)
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            this.errorMessage = {}
            this.onNext.emit(true)
          }
        }),
    )
  }

  onError(error: any) {
    const res = error
    this.errorMessage['code'] = res.error.errorCode
    this.errorMessage['description'] = res.error.errorDescription
  }

  valid() {
    return this.authorization ? this.authorization.valid() : true
  }

  getLevelMapKey(value: string) {
    //console.log('value',this.confirmSave['mapSecurity'][value.trim()]);
    return this.confirmSave['mapSecurity'][value.trim()]
  }

  private calculateVat(): void {
    const totalFees = this.confirmSave.generateChallengeAndOTP
      ? this.confirmSave.totalFeeProcess
      : this.confirmSave.totalFeeAuthorize
    const feesAmount = 0 + this.form.controls.beneficiaries.value[0].fees

    this.vat = totalFees - feesAmount
  }

  getCurrencyCode(value: any): string {
    return value ? value : '608'
  }

  getCurrencyDecimalDigitsCount(value: any) {
    const v1 = new AmountCurrencyPipe(this.injector, this.locale).transform(
      1,
      this.getCurrencyCode(value),
    )
    const n1 = (v1 + '.00').split('.')
    return n1[1] ? n1[1].length : 2
  }

  updateAmountByCurrency(item: FormGroup) {
    if (
      !item.controls.currency ||
      item.controls.currency.value === '' ||
      item.controls.currency.value === null ||
      item.controls.currency.value === undefined
    ) {
      return
    }
    if (
      item.controls.amount &&
      item.controls.amount.value !== '' &&
      item.controls.amount.value !== null &&
      item.controls.amount.value !== undefined
    ) {
      const value = parseFloat(item.controls.amount.value) + 0.0
      const size = this.getCurrencyDecimalDigitsCount(
        item.controls.currency.value,
      )
      item.controls.amount.setValue(value.toFixed(size ? size : 2))
      item.controls.amount.markAsTouched()
      return
    }
  }
}
