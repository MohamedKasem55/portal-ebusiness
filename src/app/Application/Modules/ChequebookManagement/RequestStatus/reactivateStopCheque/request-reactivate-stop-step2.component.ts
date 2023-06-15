import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { RequestReactivateStopService } from './request-reactivate-stop.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'

@Component({
  selector: 'app-request-reactivate-stop-step2',
  templateUrl: './request-reactivate-stop-step2.component.html',
})
export class RequestReactivateStopStep2Component implements OnInit, OnDestroy {
  @ViewChild('authorization') authorization: any
  @Input() batch: any
  @Input() option: any
  @Input() DeleteOption: any
  @Input() InitiateOption: any
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge
  @Input() requestValidate: RequestValidate
  @Output() onInit = new EventEmitter<Component>()

  constructor(
    public service: RequestReactivateStopService,
    public translate: TranslateService,
  ) {
    this.requestValidate = new RequestValidate()
  }

  valid(): boolean {
    if (this.authorization) {
      return this.authorization.valid()
    } else {
      return true
    }
  }

  ngOnInit() {
    this.onInit.emit(this as Component)
  }

  ngOnDestroy() {}
}
