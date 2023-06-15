import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { Subscription } from 'rxjs'
import {
  FormBuilder,
  FormGroup,
} from '../../../../../../node_modules/@angular/forms'
import { StopPaymentService } from './stop-payment.service'

@Component({
  selector: 'app-stop-payment-step2',
  templateUrl: 'stop-payment-step2.component.html',
})
export class StopPaymentStep2Component implements OnInit {
  @ViewChild('authorization', { static: true }) authorization: any

  @Input() form: FormGroup
  @Input() viewRequest: any
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge
  @Input() requestValidate: RequestValidate
  @Output() onInit = new EventEmitter<Component>()
  tableAccounts: any = {}
  mensajeError: any = {}
  subscriptions: Subscription[] = []

  constructor(
    public fb: FormBuilder,
    private router: Router,
    public translate: TranslateService,
    private service: StopPaymentService,
  ) {}

  ngOnInit() {}

  onError(error: any) {
    const res = error
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }
}
