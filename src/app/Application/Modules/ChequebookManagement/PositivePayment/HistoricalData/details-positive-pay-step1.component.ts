import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormGroup } from '@angular/forms'

@Component({
  selector: 'app-details-positive-pay-step1',
  templateUrl: 'details-positive-pay-step1.component.html',
})
export class DetailsPositivePayStep1Component implements OnInit {
  @Input() form: FormGroup
  @Input() positivePayDetails: any
  @Output() onInit = new EventEmitter<Component>()

  constructor() {}

  ngOnInit() {}
}
