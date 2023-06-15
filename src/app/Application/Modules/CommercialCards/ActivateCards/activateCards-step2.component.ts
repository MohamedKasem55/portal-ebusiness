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
import { FormBuilder } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { CommercialCardsService } from '../commercial-cards.service'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'

@Component({
  selector: 'app-ActivateCards-step2',
  templateUrl: './activateCards-step2.component.html',
  styleUrls: ['./activateCards.component.scss'],
})
export class ActivateCardsStep2Component implements OnInit {
  otpTimer = 30 //medio minuto
  reGenerateOTP: Subscription
  newOtp: number
  mensajeError: any = {}
  @ViewChild('authorization') authorization: any
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge
  @Input() requestValidate: RequestValidate
  @Output() onInit = new EventEmitter<Component>()
  @Input() form: any

  constructor(
    public translate: TranslateService,
    private fb: FormBuilder,
    public commercialCardsService: CommercialCardsService,
  ) {}

  ngOnInit() {
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
    this.mensajeError['code'] = res.errorCode
    this.mensajeError['description'] = res.errorDescription
  }
}
