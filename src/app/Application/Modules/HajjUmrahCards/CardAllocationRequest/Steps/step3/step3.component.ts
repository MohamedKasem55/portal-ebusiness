import { Component, OnInit, Input } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  selector: 'app-request-cards-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss'],
})
export class Step3Component implements OnInit {
  @Input() form: FormGroup
  @Input() batch: any
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge
  @Input() requestValidate: RequestValidate
  @Input() option: any
  @Input() InitiateOption: any
  constructor() {}

  ngOnInit() {}
}
