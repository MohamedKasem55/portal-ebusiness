import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { RequestBillReactivateService } from './request-reactivate.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'

@Component({
  selector: 'app-bill-request-reactivate-step2',
  templateUrl: './request-reactivate-step2.component.html',
  styleUrls: ['./request-reactivate.component.scss'],
})
export class RequestBillReactivateStep2Component implements OnInit, OnDestroy {
  @ViewChild('authorization') authorization: any
  @Input() batch: any
  @Input() option: any
  @Input() DeleteOption: any
  @Input() InitiateOption: any
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge
  @Input() requestValidate: RequestValidate
  @Output() onInit = new EventEmitter<Component>()

  constructor(
    private fb: FormBuilder,
    public service: RequestBillReactivateService,
    public translate: TranslateService,
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

  public getSecurityLevels() {
    if (this.option == this.DeleteOption) {
      return this.batch.securityLevelsDTOList
    }

    if (this.option == this.InitiateOption) {
      return this.batch.futureSecurityLevelsDTOList
    }
  }
}
