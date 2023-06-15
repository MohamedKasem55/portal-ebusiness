import { RequestValidate } from '../../../Model/requestvalidateType'
import { ResponseGenerateChallenge } from '../../../Model/responsegeneratechallenge.type'
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

@Component({
  selector: 'app-CardPayment-step2',
  templateUrl: './cardPayment-step2.component.html',
})
export class CardPaymentStep2Component implements OnInit, OnDestroy {
  @Input() form: any
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge
  @Input() batchListsContainer: any
  @Input() requestValidate: RequestValidate
  @Output() onInit = new EventEmitter<Component>()
  @ViewChild('authorization') authorization: any
  mensajeError: any = {}

  constructor(private fb: FormBuilder) {}

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
  ngOnDestroy() {}
}
