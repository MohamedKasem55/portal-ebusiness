import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Input,
  EventEmitter,
  Output,
} from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import {
  FormControl,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms'
import { Exception } from '../../../Model/exception'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'

@Component({
  selector: 'app-step2',
  templateUrl: './prePaidCardPayment-step2.component.html',
  styleUrls: ['./prePaidCardPayment.component.scss'],
})
export class PrePaidCardPaymentStep2Component implements OnInit, OnDestroy {
  @Input() form: any
  @Input() requestValidate: any
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge
  @Input() batchListsContainer: any
  @Output() onInit = new EventEmitter<Component>()
  @ViewChild('authorization') authorization: any

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.onInit.emit(this as Component)
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

  ngOnDestroy() {}
}
