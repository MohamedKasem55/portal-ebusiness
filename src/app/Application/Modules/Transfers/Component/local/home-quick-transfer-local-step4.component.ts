import { DecimalPipe } from '@angular/common'
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms'
import { Subscription } from 'rxjs'
import { Account } from '../../../../../Application/Model/account'
import { Beneficiary } from '../../../../../Application/Model/beneficiary'
import { StorageService } from '../../../../../core/storage/storage.service'
import { Exception } from '../../../../Model/exception'
import { StaticService } from '../../../Common/Services/static.service'
import { TransferLocalService } from '../../Services/transfer-local.service'
import { TranslateService } from '@ngx-translate/core'
import {BeneficiaryService} from "../../Services/beneficiary.service";

@Component({
  selector: 'quick-local-transfer-step4',
  templateUrl: '../../View/local/home-quick-tranfer-local-step4.html',
})
export class QuickTransferStep4LocalWidget implements OnInit, OnDestroy {
  @Input() form: FormGroup
  @Input() buttonLabel: string
  @Input() accounts: Account[]
  @Input() selectedAccount: Account
  @Input() beneficiaries: Beneficiary[]
  @Input() transferLimit: number
  @Input() remitterCategory: any
  @Input() beneficiariesService: BeneficiaryService
  @Output() onNext = new EventEmitter<boolean>()
  @Output() onInit = new EventEmitter<Component>()

  transfersLimit: any = []
  confirmSave: any
  segment: any
  accountsFrom: any
  reasons: any

  currencies = []
  combosSolicitados = ['currencyIso']
  presetAccountKey: any
  errorMessage: any = {}
  subscriptions: Subscription[] = []
  transferPurposes = []

  constructor(
    private fb: FormBuilder,
    private staticService: StaticService,
    private service: TransferLocalService,
    @Inject(LOCALE_ID) private locale: string,
    private storeservice: StorageService,
    public serviceTransfer: TransferLocalService,
    public translate: TranslateService,
  ) {
    this.accountsFrom = []
    this.reasons = []
    const currentseg = this.storeservice.retrieve('welcome')
    this.segment = currentseg.segment
  }

  ngOnInit() {
    this.form.controls.beneficiaries['controls'].forEach((element) => {
      element.controls.transferPurpose.value = null
    })
    //console.log('emit init 3');
    this.subscriptions.push(
      this.staticService
        .getAllCombos(this.combosSolicitados)
        .subscribe((comboData) => {
          const data: any = comboData
          this.currencies =
            data[this.combosSolicitados.indexOf('currencyIso')]['values']
        }),
      this.serviceTransfer.transferPropose().subscribe((result) => {
        if (result instanceof Exception) {
          this.onError(result)
          return
        } else {
          this.errorMessage = {}
          this.transferPurposes = result.transferReasonsList
        }
      }),
    )

    this.accountsFrom = this.extractAccountKeyValue(this.accounts)
    //console.log(this.accountsFrom)
    this.presetAccountKey = this.getKeyAccount(this.selectedAccount)
    if ((this.form.controls['beneficiaries'] as FormArray).length <= 0 || (this.form.controls['beneficiaries'] as FormArray).length !== this.beneficiaries.length) {
      // tslint:disable-next-line:prefer-for-of
      this.form.controls['beneficiaries'].reset()
      this.form.controls.beneficiaries['controls'] = []
      for (let i = 0; i < this.beneficiaries.length; i++) {

        this.initFormTransferBeneficiaries(
          this.form,
          this.beneficiaries[i],
          this.presetAccountKey,
        )
      }
    }

    this.onInit.emit(this as Component)
  }

  initFormTransferBeneficiaries(form, data, presetAccount) {
    form.controls['beneficiaries'].push(
      this.fb.group({
        accountFrom: [presetAccount, Validators.required],
        accountTo: [
          { value: data.beneficiaryAccountCode, disabled: true },
          Validators.required,
        ],
        amount: [
          { value: '', disabled: true },
          [Validators.required, Validators.pattern('^[0-9]*.?[0-9]*$')],
        ],
        email: [
          { value: data.email, disabled: false },
          [this.mailFormat, Validators.maxLength(50)],
        ],
        additional1: [''],
        feesAmount: [''],
        transferPurpose: ['', Validators.required],
      }),
    )
    const indice = form.controls['beneficiaries'].length - 1
    const beneficiarios =
      form.controls['beneficiaries'].controls[indice].controls
    if (this.selectedAccount) {
      beneficiarios['accountFrom'].patchValue(
        this.getAccountSelected(this.selectedAccount),
      )
    }
    //console.log(beneficiarios);
    this.subscriptions.push(
      beneficiarios['accountFrom'].valueChanges.subscribe((values) => {
        //console.log('value change'+indice);
        if (this.transferLimit) {
          this.transfersLimit[indice] =
            this.transferLimit >
            this.accountsFrom[values].value.availableBalance
              ? this.accountsFrom[values].value.availableBalance
              : this.transferLimit
        } else {
          this.transfersLimit[indice] =
            this.accountsFrom[values].value.availableBalance
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
    return ''
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
    this.beneficiariesService.selectedLocalBeneficiaries = this.beneficiaries;

    (<FormArray>this.form.controls.beneficiaries).removeAt(i)
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
    this.subscriptions.push(
      this.service
        .validateAmount(
          this.beneficiaries,
          this.form.value.beneficiaries,
          this.accounts,
          this.segment,
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
            this.confirmSave['mapSecurity'] = this.generateLevelsMap(
              this.confirmSave['batchList'],
            )
            this.setFees(this.confirmSave)
            this.errorMessage = {}
            //console.log('emito submit');
            this.onNext.emit(true)
          }
        }),
    )
    //console.log('submit 3');
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

  setFees(result) {
    const transfers = result.checkAndSeparateInitiatitionPermission
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < transfers.toProcess.length; i++) {
      const transf = transfers.toProcess[i]
      for (let j = 0; j < this.beneficiaries.length; j++) {
        if (transf.beneficiary == this.beneficiaries[j].name) {
          ;(
            (this.form.controls['beneficiaries'] as FormArray).controls[
              j
            ] as FormGroup
          ).controls['feesAmount'].setValue(transf.feesAmount)
          break
        }
      }
    }
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < transfers.toAuthorize.length; i++) {
      const transf = transfers.toAuthorize[i]
      for (let j = 0; j < this.beneficiaries.length; j++) {
        if (transf.beneficiary == this.beneficiaries[j].name) {
          ;(
            (this.form.controls['beneficiaries'] as FormArray).controls[
              j
            ] as FormGroup
          ).controls['feesAmount'].setValue(transf.feesAmount)
          break
        }
      }
    }
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < transfers.notAllowed.length; i++) {
      const transf = transfers.notAllowed[i]
      for (let j = 0; j < this.beneficiaries.length; j++) {
        if (transf.beneficiary == this.beneficiaries[j].name) {
          ;(
            (this.form.controls['beneficiaries'] as FormArray).controls[
              j
            ] as FormGroup
          ).controls['feesAmount'].setValue(transf.feesAmount)
          break
        }
      }
    }
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
    return ''
  }

  onError(error: any) {
    const res = error
    //console.log(res.error);
    this.errorMessage['code'] = res.error.errorCode
    this.errorMessage['description'] = res.error.errorDescription
  }

  focusOutAmount(value: string, index: any): void {
    const decimalPipe = new DecimalPipe(this.locale)
    this.form.controls.beneficiaries['controls'][
      index
    ].controls.amount.setValue(
      decimalPipe.transform(value, '1.2-6').replace(/,/g, ''),
    )
  }

  enableAmount(form: any, i) {
    if (
      form.controls.beneficiaries.controls[i].controls.accountFrom.value !==
        '' &&
      form.controls.beneficiaries.controls[i].controls.accountFrom.value !==
        undefined &&
      form.controls.beneficiaries.controls[i].controls.accountFrom.value !==
        null
    ) {
      form.controls.beneficiaries.controls[i].controls.amount.enable()
      return true
    } else {
      form.controls.beneficiaries.controls[i].controls.amount.disable()
      return false
    }
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
}
