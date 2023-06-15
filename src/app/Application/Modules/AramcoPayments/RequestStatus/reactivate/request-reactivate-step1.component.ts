import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'

import { FormBuilder, FormGroup } from '@angular/forms'

import { RequestReactivateService } from './request-reactivate.service'

@Component({
  selector: 'app-request-reactivate-step1',
  templateUrl: './request-reactivate-step1.component.html',
  styleUrls: ['./request-reactivate.component.scss'],
})
export class RequestReactivateStep1Component implements OnInit, OnDestroy {
  @Input() batch: any
  @Input() accounts: any
  @Input() form: FormGroup
  @Output() onInit = new EventEmitter<Component>()

  constructor(
    private fb: FormBuilder,
    public service: RequestReactivateService,
  ) {}

  ngOnInit() {
    this.onInit.emit(this as Component)
  }

  ngOnDestroy() {}

  valid(): boolean {
    return this.form.valid
  }
}
