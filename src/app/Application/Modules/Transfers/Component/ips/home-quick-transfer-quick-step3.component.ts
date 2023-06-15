import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'

import { TranslateService } from '@ngx-translate/core'
import { BeneficiaryService } from '../../Services/beneficiary.service'
import { TransferLocalService } from '../../Services/transfer-local.service'
import { StaticService } from '../../../Common/Services/static.service'
import { Exception } from '../../../../Model/exception'
import { Subscription } from 'rxjs'
import { TransferLocalInit } from '../../Model/transferLocalInit'
import { ProxyTypes } from '../../Model/ProxyTypes'
import * as _ from 'lodash'
import { StorageService } from '../../../../../core/storage/storage.service'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { Router } from '@angular/router'

@Component({
  selector: 'quick-ips-transfer-step3',
  templateUrl: '../../View/ips/home-quick-transfer-ips-step3.html',
})
export class QuickTransferStep3IPSWidget implements OnInit {
  @ViewChild('beneficiaryTable', { static: true }) table: any

  @Input() form: FormGroup
  @Input() buttonLabel: string
  @Input() tableSelectedRows: any
  @Output() onNext = new EventEmitter<boolean>()
  @Output() onInit = new EventEmitter<Component>()

  @ViewChild('ipsModal', { static: true })
  public ipsModal: ModalDirective

  accountFromSelected: any
  bankSelected: any
  proxyTypeSelected: any

  accountsFrom = []
  participantBanks = []
  transferPurposes = []
  subscriptions: Subscription[] = []
  initTransferData: TransferLocalInit
  proxyInput: string
  proxyTypes: ProxyTypes
  transferValidateResponse: any

  constructor(
    public service: BeneficiaryService,
    public fb: FormBuilder,
    public serviceTransfer: TransferLocalService,
    public staticService: StaticService,
    public translate: TranslateService,
    private storeservice: StorageService,
    private router: Router,
  ) {
    this.proxyTypes = new ProxyTypes(['IBAN', 'ID', 'email', 'mobile'])
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.serviceTransfer.transferInit().subscribe((result) => {
        if (result instanceof Exception) {
          return
        } else {
          this.initTransferData = result
          this.accountsFrom = this.extractAccountKeyValue(
            this.initTransferData.listAccount,
          )
        }
      }),
      this.serviceTransfer.ipsParticipantBanks().subscribe((result) => {
        if (result instanceof Exception) {
          return
        } else {
          this.participantBanks = result.participantBankItems
        }
      }),
      this.serviceTransfer.transferPropose().subscribe((result) => {
        if (result instanceof Exception) {
          return
        } else {
          this.transferPurposes = result.transferReasonsList
        }
      }),
    )
    this.createStep3IPSForm()
  }

  createStep3IPSForm() {
    this.form.addControl(
      'accountFrom',
      new FormControl('', Validators.required),
    )
    this.form.addControl('bankTo', new FormControl('', Validators.required))
    this.form.addControl(
      'proxyTypeSelected',
      new FormControl('', Validators.required),
    )
    this.form.addControl(
      'proxyTypeValue',
      new FormControl('', Validators.required),
    )
    this.form.addControl(
      'transferPurpose',
      new FormControl('', Validators.required),
    )
    this.form.addControl('firstName', new FormControl(''))
    this.form.addControl('lastName', new FormControl(''))
    this.form.addControl('remarks', new FormControl(''))

  }

  accountSelected(event: any): void {
    this.accountFromSelected = event
  }

  onBankSelect(event: any): void {
    if (event.status === 'UNAVAILABLE') {
      this.ipsModal.show()
      return
    }
    this.bankSelected = event
  }

  onProxySelected(event: any): void {
    this.form.controls['proxyTypeValue'].reset()
    if (this.isIBAN) {
      this.form.get('firstName').setValidators(Validators.required)
      this.form.get('lastName').setValidators(Validators.required)
    } else {
      this.form.get('firstName').setValidators(Validators.nullValidator)
      this.form.get('lastName').setValidators(Validators.nullValidator)
    }
    this.form
      .get('proxyTypeValue')
      .setValidators([
        Validators.pattern(event.pattern),
        Validators.required,
        Validators.maxLength(event.max),
        Validators.minLength(event.min),
      ])
    this.form.get('proxyTypeValue').updateValueAndValidity()
    this.form.get('firstName').updateValueAndValidity()
    this.form.get('lastName').updateValueAndValidity()

    this.proxyTypeSelected = event
  }

  extractAccountKeyValue(account: any): any {
    const accountKeyValue = []
    for (let i = 0; account.length > i; i++) {
      accountKeyValue.push({ key: i, value: account[i] })
    }
    return accountKeyValue
  }

  isValid(): boolean {
    if (this.accountFromSelected && this.bankSelected) {
      return true
    }
    return false
  }

  submit() {
    const currentseg = this.storeservice.retrieve('welcome')
    const proxyValue: string = _.get(
      this.form.controls,
      'proxyTypeValue.value',
      '',
    )
    const transferData = {
      listTransfersLocal: [
        {
          accountForm: this.accountFromSelected.value,
          amount: _.get(this.form.controls, 'ipsAmount.value', ''),
          currency: 608,
          purposeCodeTransfer: _.get(
            this.form.controls,
            'transferPurpose.value.purposeCode',
            '',
          ),
          remarks:  _.get(this.form.controls, 'remarks.value', ''),
        },
      ],
      segment: currentseg.segment,
      operationDate: new Date(),
      quickProxy: this.isIBAN
        ? {
            beneficiaryIBAN: proxyValue,
            beneficiaryName:
              _.get(this.form.controls, 'firstName.value', '') +
              ' ' +
              _.get(this.form.controls, 'lastName.value', ''),
            participantBankId: _.get(
              this.form.controls,
              'bankTo.value.participantId',
              '',
            ),
          }
        : {
            proxyType: {
              type: _.get(
                this.form.controls,
                'proxyTypeSelected.value.type',
                '',
              ),
              value: this.isMobile ? '966' + proxyValue.slice(1) : proxyValue,
            },
            participantBankId: _.get(
              this.form.controls,
              'bankTo.value.participantId',
              '',
            ),
          },
    }
    this.subscriptions.push(
      this.serviceTransfer
        .transferLocalValidate(transferData)
        .subscribe((result) => {
          if (result instanceof Exception) {
            return
          } else {
            this.transferValidateResponse = result
            this.onNext.emit(true)
          }
        }),
    )
  }

  get isIBAN(): boolean {
    return _.get(this.form.controls, 'proxyTypeSelected.value.type') === 'IBAN'
  }

  get isMobile(): boolean {
    return (
      _.get(this.form.controls, 'proxyTypeSelected.value.type') ===
      'MOIBLE_NUMBER'
    )
  }

  backHome() {
    this.ipsModal.hide()
  }

  normalTransfer() {
    this.ipsModal.hide()
    this.onNext.emit(false)
    this.form.reset()
  }

  get validForm(): boolean {
    return this.form.valid
  }

  back(): void {
    this.form.reset()
    this.onNext.emit(false)
  }
}
