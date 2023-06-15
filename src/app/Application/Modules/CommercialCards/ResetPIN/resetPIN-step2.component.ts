import { CommercialCardsService } from '../commercial-cards.service'
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Input,
  EventEmitter,
  Output,
} from '@angular/core'
import { Subscription } from 'rxjs'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
@Component({
  selector: 'app-reset-card-pin-step2',
  templateUrl: './resetPIN-step2.component.html',
  styleUrls: ['./resetPIN.component.scss'],
})
export class ResetPINStep2Component implements OnInit, OnDestroy {
  @Input() form: any
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge
  @Input() requestValidate: RequestValidate
  @Output() onInit = new EventEmitter<Component>()
  @ViewChild('authorization') authorization: any

  mensajeError: any = {}

  constructor(public commercialCardsService: CommercialCardsService) {}

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
  ngOnDestroy() {}

  onError(error: any) {
    const res = error
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }
}
