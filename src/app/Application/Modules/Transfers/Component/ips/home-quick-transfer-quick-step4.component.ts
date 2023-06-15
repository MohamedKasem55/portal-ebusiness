import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'

import { TranslateService } from '@ngx-translate/core'
import { BeneficiaryService } from '../../Services/beneficiary.service'
import { TransferLocalService } from '../../Services/transfer-local.service'
import { StaticService } from '../../../Common/Services/static.service'
import { ResponseGenerateChallenge } from '../../../../Model/responsegeneratechallenge.type'
import { RequestValidate } from '../../../../Model/requestvalidateType'
import { Exception } from '../../../../Model/exception'
import { Subscription } from 'rxjs'
import { ModalDirective } from 'ngx-bootstrap/modal'

@Component({
  selector: 'quick-ips-transfer-step4',
  templateUrl: '../../View/ips/home-quick-transfer-ips-step4.html',
  styles: [
    `
      .labelInfo {
        font-size: 16px;
        color: black;
      }
    `,
  ],
})
export class QuickTransferStep4IPSWidget implements OnInit {
  @ViewChild('beneficiaryTable', { static: true }) table: any

  @Input() form: FormGroup
  @Input() buttonLabel: string
  @Input() tableSelectedRows: any
  @Output() onNext = new EventEmitter<boolean>()
  @Output() reset = new EventEmitter<any>()
  @Output() onInit = new EventEmitter<Component>()
  @ViewChild('authorization') authorization: any
  @ViewChild('nameInfoModal', { static: true })
  public nameInfoModal: ModalDirective
  @ViewChild('confirmCancelModal', { static: true })
  public confirmCancelModal: ModalDirective
  @Input() transferValidateResponse: any
  subscriptions: Subscription[] = []
  errorMessage: any = {}
  transferConfirmResponse: any = {}
  transferData: any
  generateChallengeAndOTP: ResponseGenerateChallenge
  requestValidate: RequestValidate
  totalAmount: number

  constructor(
    public service: BeneficiaryService,
    public fb: FormBuilder,
    public serviceTransfer: TransferLocalService,
    public staticService: StaticService,
    public translate: TranslateService,
  ) {
    this.requestValidate = new RequestValidate()
  }

  ngOnInit(): void {
    this.transferData =
      this.transferValidateResponse?.checkAndSeparateInitiatitionPermission?.toProcess[0]
    this.generateChallengeAndOTP =
      this.transferValidateResponse.generateChallengeAndOTP
    this.calculateAmount()
  }

  onConfirmCancel() {
    this.confirmCancelModal.show()
  }

  cancel() {
    this.confirmCancelModal.hide()
    this.form.reset()
    this.reset.emit()
  }

  isValid() {
    return this.authorization ? this.authorization.valid() : true
  }

  get isIBAN(): boolean {
    return this.form.controls.proxyTypeSelected?.value?.key === 'IBAN'
  }

  submit() {
    const transferData = {
      batchList:
        this.transferValidateResponse.checkAndSeparateInitiatitionPermission,
      requestValidate: this.requestValidate,
    }
    this.subscriptions.push(
      this.serviceTransfer
        .transferLocalConfirm(transferData)
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            this.transferConfirmResponse = result
            this.errorMessage = {}
            this.onNext.emit(true)
          }
        }),
    )
  }

  showNameInfo(): void {
    this.nameInfoModal.show()
  }

  hideNameInfo() {
    this.nameInfoModal.hide()
  }

  hideCancelModal() {
    this.confirmCancelModal.hide()
  }

  onError(error: any) {
    const res = error
    this.errorMessage['code'] = res.error.errorCode
    this.errorMessage['description'] = res.error.errorDescription
  }

  private calculateAmount() {
    if (
      this.transferData.feesAmount != null &&
      this.form.controls.ipsAmount.value
    ) {
      this.totalAmount =
        Number(this.transferData.feesAmount) +
        Number(this.form.controls.ipsAmount.value)
    } else {
      this.totalAmount = this.transferData.feesAmount
    }
  }
}
