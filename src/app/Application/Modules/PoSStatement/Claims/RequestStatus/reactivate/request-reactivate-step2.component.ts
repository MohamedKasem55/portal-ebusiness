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
import { RequestReactivateService } from './request-reactivate.service'
import { StaticService } from '../../../../Common/Services/static.service'

@Component({
  selector: 'app-request-reactivate-step2',
  templateUrl: './request-reactivate-step2.component.html',
  styleUrls: ['./request-reactivate.component.scss'],
})
export class RequestReactivateStep2Component implements OnInit, OnDestroy {
  @ViewChild('authorization', { static: false }) authorization: any
  @Input() batch: any
  @Input() terminals: any
  @Input() option: any
  @Input() DeleteOption: any
  @Input() InitiateOption: any
  @Input() generateChallengeAndOTP: any
  @Input() requestValidate: any
  @Output() onInit = new EventEmitter<Component>()

  constructor(
    public service: RequestReactivateService,
    public translate: TranslateService,
    public staticService: StaticService,
  ) {}

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
