import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormGroup } from '@angular/forms'

@Component({
  selector: 'app-details-positive-pay-step2',
  templateUrl: 'details-positive-pay-step2.component.html',
})
export class DetailsPositivePayStep2Component implements OnInit {
  @Input() form: FormGroup
  @Input() positivePayDetails: any
  @Input() generateChallengeAndOTP: any
  @Output() onInit = new EventEmitter<Component>()

  constructor() {}

  ngOnInit() {}
}
