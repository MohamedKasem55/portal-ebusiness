import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-new-soft-token-step2',
  templateUrl: './new-soft-token-step2.component.html',
  styleUrls: ['./new-soft-token.component.scss'],
})
export class NewSoftTokenStep2Component implements OnInit, OnDestroy {

  /**
   * Form group to the request form
   */
  @Input() form: FormGroup
  /**
    * Flag: true if company is dual authorization false if not
    */
  @Input() isDual: boolean
  /**
   * error message
   */
  mensajeError: any = {}

  /**
   * Subscriptions array
   */
  subscriptions: Subscription[] = []
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge
  @Input() requestValidate: RequestValidate
  constructor(private fb: FormBuilder) { }
  ngOnInit() {

  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  onError(error: any) {
    const res = error
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }
}
