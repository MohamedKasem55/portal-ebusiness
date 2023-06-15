import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { FormBuilder, NgForm } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { RequestBillReactivateService } from './request-reactivate.service'

@Component({
  selector: 'app-bill-request-reactivate-step1',
  templateUrl: './request-reactivate-step1.component.html',
  styleUrls: ['./request-reactivate.component.scss'],
})
export class RequestBillReactivateStep1Component implements OnInit, OnDestroy {
  @Input() batch: any
  @Output() onInit = new EventEmitter<Component>()
  @ViewChild('form') public form: NgForm

  employeePageSize = 10
  paymentDate: any

  bsConfig: any

  constructor(
    private fb: FormBuilder,
    public service: RequestBillReactivateService,
    public translate: TranslateService,
  ) {}

  ngOnInit() {
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
      },
    )
    this.onInit.emit(this as Component)
  }

  ngOnDestroy() {}

  isValid() {
    //console.log(this.form);
    //console.log(this.form.valid);
    return this.form.valid || this.batch.paymentType != 'partial'
  }
}
