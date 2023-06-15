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
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { ChequebookPaymentService } from './chequebook-payment.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'

@Component({
  selector: 'app-step2',
  templateUrl: './chequebook-payment-step2.component.html',
  styleUrls: ['./chequebook-payment.component.scss'],
})
export class ChequebookPaymentStep2Component implements OnInit, OnDestroy {
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
    private fb: FormBuilder,
    public service: ChequebookPaymentService,
  ) {}

  removeChequebook(index: number) {
    this.chequebooks.splice(index, 1)
  }

  ngOnInit() {
    this.onInit.emit(this as Component)
  }

  ngOnDestroy() {}
}
