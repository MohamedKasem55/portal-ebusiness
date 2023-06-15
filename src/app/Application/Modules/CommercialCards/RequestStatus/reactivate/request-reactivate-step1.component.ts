import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { RequestReactivateService } from './request-reactivate.service'

@Component({
  selector: 'app-request-reactivate-step1',
  templateUrl: './request-reactivate-step1.component.html',
  styleUrls: ['./request-reactivate.component.scss'],
})
export class RequestReactivateStep1Component implements OnInit, OnChanges {
  @Input() batch: any
  @Input() accounts: any[]
  @Input() form: FormGroup
  @Output() onInit = new EventEmitter<Component>()
  public selectedAccountIndex: number
  constructor(
    private fb: FormBuilder,
    public service: RequestReactivateService,
  ) {}

  ngOnInit() {
    this.onInit.emit(this as Component)
  }

  ngOnChanges() {
    if (this.batch) {
      if (this.batch.paymentOption != 2) {
        this.form.controls['amount'].disable()
      }
    }
  }
  resetAmount() {
    this.form.controls['amount'].patchValue('')
    if (this.form.controls.paymentOption.value != 2) {
      this.form.controls['amount'].disable()
    } else {
      this.form.controls['amount'].enable()
    }
  }
  valid(): boolean {
    return this.form ? this.form.valid : null
  }
}
