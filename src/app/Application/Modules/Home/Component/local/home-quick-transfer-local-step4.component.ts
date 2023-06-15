import {
  Component,
  EventEmitter,
  Inject,
  Input,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms'
import { Subscription } from 'rxjs'
import { Account } from '../../../../Model/account'
import { Beneficiary } from '../../../../Model/beneficiary'
import { Exception } from '../../../../Model/exception'
import { TransferLocalService } from '../../Services/transfer-local.service'
import { StaticService } from '../../../Common/Services/static.service'
import { DecimalPipe } from '@angular/common'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  selector: 'quick-local-transfer-step4',
  templateUrl: '../../View/local/home-quick-tranfer-local-step4.html',
})
export class QuickTransferStep4LocalWidget implements OnInit, OnDestroy {
  @ViewChild('authorization', { static: true }) authorization: any

  @Input() form: FormGroup
  @Input() buttonLabel: string
  @Input() accounts: Account[]
  @Input() beneficiaries: Beneficiary[]
  @Input() confirmSave: any
  @Input() totalAmount: number
  @Input() currencies: any
  @Output() onNext = new EventEmitter<boolean>()
  @Output() onInit = new EventEmitter<Component>()

  totalFeesAmount: number
  accountsFrom: any
  reasons: any

  mensajeError: any = {}
  subscriptions: Subscription[] = []

  sharedData: any = {}
  requestValidate: RequestValidate

  constructor(
    public fb: FormBuilder,
    public staticService: StaticService,
    public service: TransferLocalService,
    @Inject(LOCALE_ID) private locale: string,
  ) {
    this.accountsFrom = []
  }

  ngOnInit() {
    //console.log('emit init 3');

    this.requestValidate = new RequestValidate()

    this.form.disable()

    this.accountsFrom = this.extractAccountKeyValue(this.accounts)
    this.totalFeesAmount =
      (this.confirmSave.totalFeeProcess
        ? this.confirmSave.totalFeeProcess
        : 0) +
      (this.confirmSave.totalFeeAuthorize
        ? this.confirmSave.totalFeeAuthorize
        : 0) +
      (this.confirmSave.totalFeeNotAllowed
        ? this.confirmSave.totalFeeNotAllowed
        : 0)

    this.onInit.emit(this as Component)
    ;(<FormArray>this.form.controls.beneficiaries).controls.forEach(
      (item, i) => {
        this.formatAmount(this.form, i)
      },
    )
  }

  extractAccountKeyValue(account: any) {
    const accountKeyValue = []
    for (let i = 0; account.length > i; i++) {
      accountKeyValue.push({ key: i, value: account[i] })
    }
    return accountKeyValue
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
            this.mensajeError = {}

            //console.log('emito submit');
            this.onNext.emit(true)
          }
        }),
    )
    //console.log('submit 3');
  }

  onError(error: any) {
    const res = error
    //console.log(res.error);
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }

  valid() {
    return this.authorization ? this.authorization.valid() : true
  }

  accountFrom21To18(account) {
    let account21 = account
    //console.log('account ',account, account.length);

    if (account.length == 21) {
      account21 =
        account.substring(0, 5) +
        '0' +
        account.substring(6, 8) +
        account.substring(11, 21)
    }
    return account21
  }

  getLevelMapKey(value: string) {
    //console.log(this.confirmSave['mapSecurity']);
    //console.log('key',value);
    //console.log('value',this.confirmSave['mapSecurity'][value.trim()]);
    return this.confirmSave['mapSecurity'][value.trim()]
  }

  formatAmount(form: any, i): void {
    if (form.controls.beneficiaries.controls[i].controls.amount.value) {
      const decimalPipe = new DecimalPipe(this.locale)
      form.controls.beneficiaries.controls[i].controls.amount.setValue(
        decimalPipe
          .transform(
            form.controls.beneficiaries.controls[i].controls.amount.value,
            '1.2-6',
          )
          .replace(/,/g, ''),
      )
    }
  }
}
