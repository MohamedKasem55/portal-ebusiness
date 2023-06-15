import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  Inject,
  LOCALE_ID,
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Subscription } from 'rxjs'
import { Account } from '../../../../../Application/Model/account'
import { Beneficiary } from '../../../../../Application/Model/beneficiary'
import { Exception } from '../../../../Model/exception'
import { TransferLocalService } from '../../Services/transfer-local.service'
import { StaticService } from '../../../Common/Services/static.service'
import { DecimalPipe } from '@angular/common'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'quick-local-transfer-step5',
  templateUrl: '../../View/local/home-quick-tranfer-local-step5.html',
})
export class QuickTransferStep5LocalWidget implements OnInit, OnDestroy {
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
  @Output() reset = new EventEmitter<any>()

  totalFeesAmount: number
  accountsFrom: any
  reasons: any

  errorMessage: any = {}
  subscriptions: Subscription[] = []

  sharedData: any = {}
  requestValidate: RequestValidate
  isQuickTransfer: any

  constructor(
    private fb: FormBuilder,
    private staticService: StaticService,
    private service: TransferLocalService,
    public translate: TranslateService,
    @Inject(LOCALE_ID) private locale: string,
  ) {
    this.accountsFrom = []
    this.requestValidate = new RequestValidate()
  }

  ngOnInit() {
    this.requestValidate = new RequestValidate()
    //console.log('emit init 3');

    this.form.disable()
    const decimalPipe = new DecimalPipe(this.locale)
    for (
      let i = 0;
      i < this.form.controls.beneficiaries['controls'].length;
      i++
    ) {
      this.form.controls.beneficiaries['controls'][i].controls.amount.setValue(
        decimalPipe
          .transform(this.form.value.beneficiaries[i].amount, '1.2-2')
          .replace(/,/g, ''),
      )
      this.form.controls.beneficiaries['controls'][
        i
      ].controls.feesAmount.setValue(
        decimalPipe
          .transform(this.form.value.beneficiaries[i].feesAmount, '1.2-2')
          .replace(/,/g, ''),
      )
    }

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
    this.totalAmount += this.totalFeesAmount
    this.onInit.emit(this as Component)
    //check if quick is applied
    this.checkIsQuick()
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
    this.form.reset()
    this.reset.emit(false)
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
    this.errorMessage['code'] = res.error.errorCode
    this.errorMessage['description'] = res.error.errorDescription
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

  checkIsQuick(): void {
    const toAuthorize =
      this.confirmSave.checkAndSeparateInitiatitionPermission.toAuthorize
    const toProcess =
      this.confirmSave.checkAndSeparateInitiatitionPermission.toProcess
    const notAllowed =
      this.confirmSave.checkAndSeparateInitiatitionPermission.notAllowed

    const joined = [...toAuthorize, ...toProcess, ...notAllowed]
    if (joined && joined.length > 0) {
      for (let i = 0; i <= joined.length; i++) {
        if (joined[i].ipsEligibilityFlg) {
          this.isQuickTransfer = true
          return
        }
      }
    }
  }
}
