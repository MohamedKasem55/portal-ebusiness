import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import {
  FormBuilder,
  FormGroup,
} from '../../../../../../node_modules/@angular/forms'
import { Exception } from 'app/Application/Model/exception'
import { StopPaymentService } from './stop-payment.service'

@Component({
  selector: 'app-stop-payment-step1',
  templateUrl: 'stop-payment-step1.component.html',
})
export class StopPaymentStep1Component implements OnInit {
  @Input() form: FormGroup
  @Output() onInit = new EventEmitter<Component>()
  tableAccounts: any = {}
  mensajeError: any = {}
  subscriptions: Subscription[] = []
  accounts: any
  constructor(
    private fb: FormBuilder,
    public translate: TranslateService,
    private service: StopPaymentService,
  ) {}

  ngOnInit() {
    this.getAccounts()
  }

  onError(error: any) {
    const res = error
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }

  getAccounts() {
    this.subscriptions.push(
      this.service.getAccounts().subscribe((result: any) => {
        if (result instanceof Exception) {
          this.onError(result)
          return
        } else {
          this.accounts = result
        }
      }),
    )
  }
}
