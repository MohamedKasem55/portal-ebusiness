import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { PrePaidCardService } from '../prePaidCard.service'
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Input,
  EventEmitter,
  Output,
} from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  selector: 'app-step2',
  templateUrl: './prePaidCardResetPin-step2.component.html',
  styleUrls: ['./prePaidCardResetPin.component.scss'],
})
export class PrePaidCardResetPinStep2Component implements OnInit {
  @Input() form: any
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge
  @Input() requestValidate: RequestValidate
  @Output() onInit = new EventEmitter<Component>()
  @ViewChild('authorization') authorization: any
  public mensajeError: any = {}

  constructor(
    private fb: FormBuilder,
    public prePaidCardService: PrePaidCardService,
  ) {}

  ngOnInit() {
    this.onInit.emit(this as Component)
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

  onError(error: any) {
    const res = error
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }
}
