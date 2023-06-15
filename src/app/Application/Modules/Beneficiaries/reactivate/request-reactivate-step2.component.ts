import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { RequestReactivateService } from './request-reactivate.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  selector: 'app-request-reactivate-step2',
  templateUrl: './request-reactivate-step2.component.html',
  styleUrls: ['./request-reactivate.component.scss'],
})
export class RequestReactivateStep2Component implements OnInit, OnDestroy {
  @ViewChild('authorization') authorization: any
  @Input() batch: any
  @Input() option: any
  @Input() type: any
  @Input() DeleteOption: any
  @Input() InitiateOption: any
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge
  @Input() requestValidate: RequestValidate
  @Output() onInit = new EventEmitter<Component>()

  branch: any
  formData: any
  localBankName: any
  bsConfig: any

  constructor(
    private fb: FormBuilder,
    public service: RequestReactivateService,
    public translate: TranslateService,
  ) {
    this.requestValidate = new RequestValidate()
  }

  valid(): boolean {
    if (this.authorization) {
      return this.authorization.valid()
    } else {
      return true
    }
  }

  ngOnInit() {
    this.onInit.emit(this as Component)
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        dateInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-dark-blue',
      },
    )
  }

  initData() {
    this.getBank(this.batch.bankName)
    this.branch = this.getBranch(
      this.batch.bankAddress,
      this.batch.branchAddress,
    )
    this.getLocalBankName()
  }

  focusInIbanAccount(target): void {
    if (!target || !target.value || target.value.length == 0) {
      this.batch.newBeneficiaryAccount = 'SA'
    }
  }

  focusOutIbanAccountEvent(event): void {
    if (event) {
      this.focusOutIbanAccount(event.value)
    }
  }

  focusOutIbanAccount(value: string): void {
    const bankIbanCodeTmp = value.substring(4, 6)
    const bankIbanCode = '0' + bankIbanCodeTmp
    this.batch.newBankCode = bankIbanCode
    this.batch.newBankName = this.formData.banksCode[bankIbanCode]
  }

  getBank(name) {
    for (let i = 0; i < this.formData['banks'].length; ++i) {
      if (this.formData['banks'][i].bankName == name) {
        return this.formData['banks'][i]
      }
    }
  }

  getLocalBankName() {
    this.localBankName = this.formData.banksCode[this.batch.bankCode]
  }

  getBranch(address, branchAddress) {
    for (let i = 0; i < this.formData.branchs.length; ++i) {
      if (
        this.formData.branchs[i].bankAddress == address &&
        this.formData.branchs[i].branchAddress == branchAddress
      ) {
        return this.formData.branchs[i]
      }
    }
  }

  ngOnDestroy() {}
}
