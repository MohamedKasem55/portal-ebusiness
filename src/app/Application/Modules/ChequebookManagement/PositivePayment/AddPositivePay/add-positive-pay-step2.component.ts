import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { FormBuilder } from '@angular/forms'

@Component({
  selector: 'app-positive-step2',
  templateUrl: './add-positive-pay-step2.component.html',
})
export class AddPositivePayStep2Component implements OnInit, OnDestroy {
  @Input() form: any
  @Input() batch: any
  @Output() onInit = new EventEmitter<Component>()

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.onInit.emit(this as Component)
  }

  ngOnDestroy() {}
}
