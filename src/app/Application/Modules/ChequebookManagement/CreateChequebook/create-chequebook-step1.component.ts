import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { CreateChequebookService } from './create-chequebook.service'

@Component({
  selector: 'app-step1',
  templateUrl: './create-chequebook-step1.component.html',
  styleUrls: ['./create-chequebook.component.scss'],
})
export class CreateChequebookStep1Component implements OnInit, OnDestroy {
  @Input() form: any
  @Output() onInit = new EventEmitter<Component>()

  deliveryMethods: any[] = []

  constructor(
    private fb: FormBuilder,
    public service: CreateChequebookService,
  ) {}

  ngOnInit() {
    this.onInit.emit(this as Component)
    this.deliveryMethods = [
      {
        key: 1,
        value: 'Collect at Branch',
      },
      {
        key: 2,
        value: 'Standard Mail',
      },
      {
        key: 3,
        value: 'National Address',
      },
    ]
  }

  ngOnDestroy() {}
}
