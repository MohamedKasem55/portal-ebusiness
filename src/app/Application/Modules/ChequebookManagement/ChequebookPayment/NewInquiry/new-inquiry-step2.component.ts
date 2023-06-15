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
import { NewInquiryService } from './new-inquiry.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  selector: 'app-new-inquiry-step2',
  templateUrl: './new-inquiry-step2.component.html',
})
export class NewInquiryStep2Component implements OnInit, OnDestroy {
  @Input() form: any
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge
  @Input() requestValidate: RequestValidate
  @Output() onInit = new EventEmitter<Component>()
  @ViewChild('authorization') authorization: any

  chequebooks: any[] = [
    {
      account: '123456789',
      chequeNumber: '123412121',
      postedDate: new Date(),
      beneficiaryName: 'pepito',
      amount: '2123',
      status: 'p',
    },
  ]
  chequeBookView = false

  constructor(
    public translate: TranslateService,
    private fb: FormBuilder,
    public service: NewInquiryService,
  ) {}

  removeChequebook(index: number) {
    this.chequebooks.splice(index, 1)
  }

  ngOnInit() {
    // this.onInit.emit(this as Component);
  }

  ngOnDestroy() {}
}
