import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormGroup } from '@angular/forms'

@Component({
  selector: 'app-request-reactivate-step1',
  templateUrl: './request-reactivate-step1.component.html',
  styleUrls: ['./request-reactivate.component.scss'],
})
export class RequestReactivateStep1Component implements OnInit {
  @Input() batch: any
  @Input() accounts: any
  @Input() form: FormGroup
  @Input() isReplaceMode = false
  @Output() onInit = new EventEmitter<Component>()

  constructor() {}

  ngOnInit() {
    this.onInit.emit(this as Component)
  }

  valid(): boolean {
    return this.form.valid
  }
}
