import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { PrePaidCardService } from '../prePaidCard.service'
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Input,
  EventEmitter,
  Output,
  Pipe,
} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { PrePaidCardBlockService } from './prePaidCardBlock.service'
import { FormControl } from '@angular/forms'

@Component({
  selector: 'app-step2',
  templateUrl: './prePaidCardBlock-step2.component.html',
  styleUrls: ['./prePaidCardBlock.component.scss'],
})
export class PrePaidCardBlockStep2Component implements OnInit {
  @Input() form: any
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge
  @Input() requestValidate: RequestValidate
  @Output() onInit = new EventEmitter<Component>()
  @ViewChild('authorization') authorization: any
  public mensajeError: any = {}
  public account: string
  public operationType: string
  public replaceOpType: string
  public closureOpType: string
  public reasonControl: FormControl
  constructor(
    public translate: TranslateService,
    public prePaidCardService: PrePaidCardService,
    private prepaidCardBlockService: PrePaidCardBlockService,
  ) {}

  ngOnInit() {
    this.onInit.emit(this as Component)
    this.account = this.prePaidCardService.getPrepaidCardSelected().cardNumber
      ? this.prePaidCardService.getPrepaidCardSelected().cardNumber
      : '0'
    this.operationType = this.prepaidCardBlockService.getBlockOperationType()
    this.closureOpType = PrePaidCardBlockService.CLOSURE_OP_TYPE
    this.replaceOpType = PrePaidCardBlockService.REPLACE_OP_TYPE
    this.reasonControl = this.form?.get('reason') as FormControl
    this.reasonControl.disable()

    if (this.requestValidate.otp) {
      this.requestValidate.otp = ''
    }
  }

  valid(): boolean {
    if (this.authorization) {
      return this.authorization.valid()
    } else {
      return true
    }
  }

  isPending() {
    if (
      this.generateChallengeAndOTP &&
      (this.generateChallengeAndOTP.typeAuthentication === 'STATIC' ||
        this.generateChallengeAndOTP.typeAuthentication === 'OTP' ||
        this.generateChallengeAndOTP.typeAuthentication === 'CHALLENGE')
    ) {
      return false
    } else {
      return true
    }
  }

  public toTitleCase(str: string): string {
    str = str ? str[0].toUpperCase() + str.substring(1).toLowerCase() : str
    return str
  }
}
