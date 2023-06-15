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
import { TranslateService } from '@ngx-translate/core'
import { PrePaidCardService } from '../prePaidCard.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  selector: 'app-step2',
  templateUrl: './prePaidCardActivate-step2.component.html',
})
export class PrePaidCardActivateStep2Component implements OnInit {
  mensajeError: any = {}
  @ViewChild('authorization') authorization: any
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge
  @Input() requestValidate: RequestValidate = new RequestValidate()
  @Output() onInit = new EventEmitter<Component>()
  @Input() form: any

  constructor(
    public translate: TranslateService,
    private fb: FormBuilder,
    public prePaidCardService: PrePaidCardService,
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
