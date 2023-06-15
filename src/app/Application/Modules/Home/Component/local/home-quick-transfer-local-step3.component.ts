import {
  Component,
  EventEmitter,
  Input,
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
import { Account } from '../../../../Model/account'
import { Beneficiary } from '../../../../Model/beneficiary'
import { Exception } from '../../../../Model/exception'
import { StaticService } from '../../../Common/Services/static.service'
import { TransferLocalService } from '../../Services/transfer-local.service'
import { StorageService } from '../../../../../core/storage/storage.service'

@Component({
  selector: 'quick-local-transfer-step3',
  templateUrl: '../../View/local/home-quick-tranfer-local-step3.html',
})
export class QuickTransferStep3LocalWidget implements OnInit, OnDestroy {
  @Input() form: FormGroup
  @Input() buttonLabel: string
  @Input() accounts: Account[]
  @Input() beneficiaries: Beneficiary[]
  @Input() transferLimit: number
  @Output() onNext = new EventEmitter<boolean>()
  @Output() onInit = new EventEmitter<Component>()

  transfersLimit: any = []
  confirmSave: any

  accountsFrom: any
  reasons: any

  currencies = []
  combosSolicitados = ['currencyIso']

  mensajeError: any = {}
  subscriptions: Subscription[] = []

  constructor(
    public fb: FormBuilder,
    public staticService: StaticService,
    public storeservice: StorageService,
    public service: TransferLocalService,
  ) {
    this.accountsFrom = []
    this.reasons = []
  }

  ngOnInit() {
    //console.log('emit init 3');
    this.subscriptions.push(
      this.staticService
        .getAllCombos(this.combosSolicitados)
        .subscribe((comboData) => {
          const data: any = comboData
          this.currencies =
            data[this.combosSolicitados.indexOf('currencyIso')]['values']
        }),
    )

    this.accountsFrom = this.extractAccountKeyValue(this.accounts)
    if ((this.form.controls['beneficiaries'] as FormArray).length <= 0) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.beneficiaries.length; i++) {
        this.initFormTransferBeneficiaries(this.form, this.beneficiaries[i])
      }
    }

    this.onInit.emit(this as Component)
  }

  initFormTransferBeneficiaries(form, data) {
    form.controls['beneficiaries'].push(
      this.fb.group({
        accountFrom: ['', Validators.required],
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
      }),
    )
    const indice = form.controls['beneficiaries'].length - 1
    const beneficiarios =
      form.controls['beneficiaries'].controls[indice].controls
    //console.log(beneficiarios);
    this.subscriptions.push(
      beneficiarios['accountFrom'].valueChanges.subscribe(
        function (_indice, _beneficiarios, _values) {
          //console.log('value change'+_indice);
          if (this.transferLimit) {
            this.transfersLimit[_indice] =
              this.transferLimit >
              this.accountsFrom[_values].value.availableBalance
                ? this.accountsFrom[_values].value.availableBalance
                : this.transferLimit
          } else {
            this.transfersLimit[_indice] =
              this.accountsFrom[_values].value.availableBalance
          }

          _beneficiarios['amount'].setValidators([
            Validators.required,
            Validators.min(0),
            Validators.max(this.transfersLimit[_indice]),
            Validators.pattern('^[0-9]*.?[0-9]*$'),
          ])
          _beneficiarios['amount'].updateValueAndValidity()
        }.bind(this, indice, beneficiarios),
      ),
    )
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
    const segment = currentseg.segment

    this.subscriptions.push(
      this.service
        .validateAmount(
          this.beneficiaries,
          this.form.value.beneficiaries,
          this.accounts,
          segment,
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
            this.mensajeError = {}
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
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < batchList.notAllowed.length; i++) {
      list.push(batchList.notAllowed[i])
    }
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < batchList.toProcess.length; i++) {
      list.push(batchList.toProcess[i])
    }
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < batchList.toAuthorize.length; i++) {
      list.push(batchList.toAuthorize[i])
    }
    return list
  }

  setFees(result) {
    ////
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

  onError(error: any) {
    const res = error
    //console.log(res.error);
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
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
