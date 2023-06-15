import { DecimalPipe } from '@angular/common'
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
} from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { Account } from '../../../../../Application/Model/account'
import { Beneficiary } from '../../../../../Application/Model/beneficiary'
import { StorageService } from '../../../../../core/storage/storage.service'
import { Exception } from '../../../../Model/exception'
import { StaticService } from '../../../Common/Services/static.service'
import { TransferInternationalService } from '../../Services/transfer-international.service'
import { AmountCurrencyPipe } from '../../../../Components/common/Pipes/amount-currency.pipe'
import {CommonValidators} from "../../../Common/constants/common-validators.service";

@Component({
  selector: 'quick-international-transfer-step3',
  templateUrl:
    '../../View/international/home-quick-tranfer-international-step3.html',
})
export class QuickTransferStep3InternationalWidget
  implements OnInit, OnDestroy
{
  @Input() form: FormGroup
  @Input() buttonLabel: string
  @Input() accounts: Account[]
  @Input() transferLimit: number
  @Input() selectedAccount: Account
  @Input() beneficiaries: Beneficiary[]
  @Input() remitterCategory: any
  @Input() batch: any
  @Output() onNext = new EventEmitter<boolean>()
  @Output() onInit = new EventEmitter<Component>()

  transfersLimit: any = []

  currenciesUsers: any[] = []
  totalCurrencies: any[][] = []
  allCurrencies: string[] = []
  accountsFrom: any
  reasons: any[] = []
  confirmSave: any = []
  presetAccountKey: any
  segment: any
  //combosSolicitados = ['TransferReasonType'];

  mensajeError: any = {}
  subscriptions: Subscription[] = []

  constructor(
    public translate: TranslateService,
    private fb: FormBuilder,
    private staticService: StaticService,
    private storeservice: StorageService,
    private service: TransferInternationalService,
    private injector: Injector,
    public commonValidators: CommonValidators,
    @Inject(LOCALE_ID) private locale: string,
  ) {
    this.accountsFrom = []
  }

  ngOnInit() {
    //console.log('emit init 3');

    // Creo un array de strings con los datos de los combos que voy a necesitar en el modulo Accounts
    const combosSolicitados = ['currency']
    this.reasons = []
    // Llamada al servio post con los datos del formulario en un json
    // Se espera a la respuesta y se muestra la modal de OK el envío.
    for (let i = 0; i < this.currenciesUsers.length; i++) {
      // Initialite arrays
      this.totalCurrencies[i] = []

    }

    this.accountsFrom = this.extractAccountKeyValue(this.accounts)
    this.presetAccountKey = this.getKeyAccount(this.selectedAccount)
    if ((<FormArray>this.form.controls['beneficiaries']).length <= 0) {
      for (let i = 0; i < this.beneficiaries.length; i++) {
        this.initFormTransferBeneficiaries(
          this.form,
          this.beneficiaries[i],
          i,
          this.presetAccountKey,
        )
      }
    } else {
      for (let i = 0; i < this.beneficiaries.length; i++) {
        this.subscriptions.push(
          this.service
            .transferPropose(this.beneficiaries[i], this.remitterCategory)
            .subscribe((_result) => {
              if (
                _result.hasOwnProperty('error') &&
                (<any>_result).error instanceof Exception
              ) {
                this.onError(_result)
                return
              } else {
                this.mensajeError = {}
                this.reasons.push(_result.transferReasonsList)
              }
            }),
        )
      }
    }
    this.onInit.emit(this as Component)
  }

  initFormTransferBeneficiaries(form, data, index, accountKey) {
    let group: FormGroup
    if (accountKey) {
      group = this.fb.group({
        accountFrom: [accountKey, Validators.required],
        accountTo: [
          { value: data.beneficiaryAccountCode, disabled: true },
          Validators.required,
        ],
        currency: ['', Validators.required],
        propose: ['', Validators.required],
        amount: [
          '',
          [Validators.required, Validators.pattern('^[0-9]*.?[0-9]*$')],
        ],
        rate: [''],
        fees: [''],
        sarAmount: [''],
        email: [{ value: data.email }],
        remarks: ['', []],
        additional1: [''],
        additional2: [''],
      })
    } else {
      group = this.fb.group({
        accountFrom: ['', Validators.required],
        accountTo: [
          { value: data.beneficiaryAccountCode, disabled: true },
          Validators.required,
        ],
        currency: [{value: '' ,disabled: true },[Validators.required],],
        propose: ['', Validators.required],
        amount: [
          { value: '', disabled: true },
          [Validators.required, Validators.pattern('^[0-9]*.?[0-9]*$')],
        ],
        rate: [''],
        fees: [''],
        sarAmount: [''],
        email: [{ value: data.email, disabled: true }],
        remarks: ['', []],
        additional1: [''],
        additional2: [''],
      })
    }

    this.subscriptions.push(
      this.service
        .transferPropose(data, this.remitterCategory)
        .subscribe((result) => {
          if (
            result.hasOwnProperty('error') &&
            (<any>result).error instanceof Exception
          ) {
            this.onError(result)
            return
          } else {
            this.mensajeError = {}
            this.reasons.push(result.transferReasonsList)
          }
        }),
    )

    form.controls['beneficiaries'].push(group)
    const indice = form.controls['beneficiaries'].length - 1
    const beneficiarios =
      form.controls['beneficiaries'].controls[indice].controls
    //console.log(beneficiarios);
    if (this.selectedAccount) {
      beneficiarios['accountFrom'].patchValue(
        this.getAccountSelected(this.selectedAccount),
      )
    }
    this.subscriptions.push(
      beneficiarios['accountFrom'].valueChanges.subscribe((key) => {
        if (!key) {
          return
        }
        if (this.transferLimit) {
          this.transfersLimit[indice] =
            this.transferLimit > this.accountsFrom[key].value.availableBalance
              ? this.accountsFrom[key].value.availableBalance
              : this.transferLimit
        } else {
          this.transfersLimit[indice] =
            this.accountsFrom[key].value.availableBalance
        }
        beneficiarios['amount'].setValidators([
          Validators.required,
          Validators.min(0),
          Validators.max(this.transfersLimit[indice]),
          Validators.pattern('^[0-9]*.?[0-9]*$'),
        ])
        beneficiarios['amount'].updateValueAndValidity()
      }),
    )

    /* this.subscriptions.push(
             beneficiarios["propose"].valueChanges.subscribe(
                 function () {
                     //console.log('value change'+_indice);
                 }.bind(this, indice, beneficiarios)
             )
         );*/
  }

  isAdditionalInfo(value, indice) {
    if (value) {
      const object = JSON.parse(value)
      const beneficiarios = (<FormGroup>(
        (<FormArray>this.form.controls['beneficiaries']).controls[indice]
      )).controls
      if (object.additionalInfoFlag != 0) {
        beneficiarios['additional1'].setValidators([Validators.required,Validators.pattern(this.commonValidators.ONLY_ENGLISH)])
        beneficiarios['additional1'].updateValueAndValidity()
        beneficiarios['additional2'].setValidators([Validators.required,Validators.pattern(this.commonValidators.ONLY_ENGLISH_NUMBERS)])
        beneficiarios['additional2'].updateValueAndValidity()
        return true
      } else {
        beneficiarios['additional1'].setValidators([])
        beneficiarios['additional1'].updateValueAndValidity()
        beneficiarios['additional2'].setValidators([])
        beneficiarios['additional2'].updateValueAndValidity()

        return false
      }
    }
    return false
  }

  focusOutAmount(value: string, index: any): void {
    const decimalPipe = new DecimalPipe(this.locale)
    this.form.controls.beneficiaries['controls'][
      index
    ].controls.amount.setValue(
      decimalPipe.transform(value, '1.2-6').replace(/,/g, ''),
    )
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

  getKeyAccount(account: any) {
    if (account) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.accountsFrom.length; i++) {
        if (
          this.accountsFrom[i].value.fullAccountNumber ==
          account.fullAccountNumber
        ) {
          return this.accountsFrom[i].key
        }
      }
    }
    return
  }

  extractAccountKeyValue(account: any) {
    const accountKeyValue = []
    for (let i = 0; account.length > i; i++) {
      accountKeyValue.push({ key: i, value: account[i] })
    }
    return accountKeyValue
  }

  removeTransfer(i) {
    this.beneficiaries.splice(i, 1)
    ;(<FormArray>this.form.controls.beneficiaries).removeAt(i)
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  cancel() {
    this.onNext.emit(false)
  }

  submit() {
    const currentseg = this.storeservice.retrieve('welcome')
    this.segment = currentseg.segment

    this.form.controls.beneficiaries['controls'].forEach(transfer => this.updateAmountByCurrency(transfer))

    this.subscriptions.push(
      this.service
        .validateAmount(
          this.beneficiaries,
          this.form.value.beneficiaries,
          this.accounts,
          this.segment,
          this.remitterCategory,
        )
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            this.confirmSave = result
            this.confirmSave['batchList'] = this.extractBatch(
              result['checkAndSeparateInitiatitionPermission'],
            )
            this.completeTransferData(this.confirmSave['batchList'])
            this.confirmSave['mapSecurity'] = this.generateLevelsMap(
              this.confirmSave['batchList'],
            )
            this.mensajeError = {}
            //console.log('emito submit');
            this.onNext.emit(true)
          }
        }),
    )
    ////only for test;
    //const beneficiarios = (<FormGroup>(<FormArray>this.form.controls['beneficiaries']).controls[0]).controls;
    //beneficiarios['rate'].setValue(4.5);
    //beneficiarios['fees'].setValue(10);
    //this.onNext.emit(true);
  }

  completeTransferData(batch) {
    // tslint:disable-next-line:prefer-for-of
    for (
      let i = 0;
      i < (this.form.controls['beneficiaries'] as FormArray).controls.length;
      i++
    ) {
      const beneficiarios = (
        (this.form.controls['beneficiaries'] as FormArray).controls[
          i
        ] as FormGroup
      ).controls
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < batch.length; j++) {
        if (
          this.getAccountByKey(beneficiarios['accountFrom'].value) ==
            batch[j].accountNumber &&
          beneficiarios['accountTo'].value == batch[j].accountTo &&
          parseFloat(beneficiarios['amount'].value) ==
            parseFloat(batch[j].amount)
        ) {
          beneficiarios['rate'].setValue(batch[j]['exchangeRate'])
          beneficiarios['rate'].updateValueAndValidity()

          beneficiarios['fees'].setValue(batch[j]['feesAmount'])
          beneficiarios['fees'].updateValueAndValidity()

          beneficiarios['sarAmount'].setValue(batch[j]['sarAmount'])
          beneficiarios['sarAmount'].updateValueAndValidity()
        }
      }
    }
  }

  generateLevelsMap(batch) {
    const map = {}
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < batch.length; i++) {
      //console.log('creo entrada: ',batch[i].accountNumber+'-'+batch[i].accountTo,batch[i].futureSecurityLevelsDTOList);
      map[(batch[i].accountNumber + '-' + batch[i].accountTo).trim()] =
        batch[i].futureSecurityLevelsDTOList
    }
    return map
  }

  extractBatch(batchList) {
    const list: any = []
    for (let i = 0; i < batchList.notAllowed.length; i++) {
      list.push(batchList.notAllowed[i])
    }
    for (let i = 0; i < batchList.toProcess.length; i++) {
      list.push(batchList.toProcess[i])
    }
    for (let i = 0; i < batchList.toAuthorize.length; i++) {
      list.push(batchList.toAuthorize[i])
    }
    return list
  }

  getAccountByKey(key) {
    if (key != null) {
      for (let i = 0; i < this.accounts.length; i++) {
        if (this.accountsFrom[i].key == key) {
          return this.accountsFrom[i].value.fullAccountNumber
        }
      }
    }
    return
  }

  getAccountSelected(account) {
    if (account) {
      for (let i = 0; i < this.accounts.length; i++) {
        if (
          this.accountsFrom[i].value.fullAccountNumber ==
          account.fullAccountNumber
        ) {
          return this.accountsFrom[i].key
        }
      }
    }
    return
  }

  onError(error: any) {
    const res = error
    //console.log(res.error);
    //this.mensajeError["code"] = res.error.errorCode;
    //this.mensajeError["description"] = res.error.errorDescription;
  }

  enableAmount(form: any, i) {
    this.totalCurrencies[i] = [];
    form.controls.beneficiaries.controls[i].controls.currency.reset();
    if (
      form.controls.beneficiaries.controls[i].controls.accountFrom.value !==
        '' &&
      form.controls.beneficiaries.controls[i].controls.accountFrom.value !==
        undefined &&
      form.controls.beneficiaries.controls[i].controls.accountFrom.value !==
        null
    ) {
      form.controls.beneficiaries.controls[i].controls.amount.enable()

      form.controls.beneficiaries.controls[i].controls.currency.enable()

      let account = this.accountsFrom[form.controls.beneficiaries.controls[i].controls.accountFrom.value].value;

      this.subscriptions.push(
      this.service.transferCurrency(account , this.beneficiaries[i].beneficiaryCurrency).subscribe((result) => {
        if (result instanceof Exception) {
          this.onError(result)
          return
        } else {
          this.totalCurrencies[i]= result.currencies;
        }
      }),
      )
      return true
    } else {
      form.controls.beneficiaries.controls[i].controls.amount.disable()
      form.controls.beneficiaries.controls[i].controls.currency.disable()
      return false
    }
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
