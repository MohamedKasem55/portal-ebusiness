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
import { RequestBillReactivateBillService } from './request-reactivate.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'

@Component({
  selector: 'app-bill-request-reactivate-bill-step2',
  templateUrl: './request-reactivate-step2.component.html',
  styleUrls: ['./request-reactivate.component.scss'],
})
export class RequestBillReactivateBillStep2Component
  implements OnInit, OnDestroy
{
  @ViewChild('authorization') authorization: any
  @Input() sharedData: any
  @Input() batch: any
  @Input() option: any
  @Input() DeleteOption: any
  @Input() InitiateOption: any
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge
  @Input() requestValidate: RequestValidate
  @Output() onInit = new EventEmitter<Component>()

  selectedBillCode: any

  constructor(
    public service: RequestBillReactivateBillService,
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
    this.findCodeSelected(this.batch.billCode)
    this.onInit.emit(this as Component)
  }

  findCodeSelected(code) {
    for (let i = this.sharedData.billCodes.length - 1; i >= 0; i--) {
      if (this.sharedData.billCodes[i].billCode == code) {
        this.selectedBillCode = this.sharedData.billCodes[i]
      }
    }
  }

  ngOnDestroy() {}
}
