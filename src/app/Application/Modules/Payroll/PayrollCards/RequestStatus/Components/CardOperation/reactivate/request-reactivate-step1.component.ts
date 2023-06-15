import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { RequestReactivateOperationService } from './request-reactivate.service'

@Component({
  selector: 'app-request-reactivate-operation-step1',
  templateUrl: './request-reactivate-step1.component.html',
  styleUrls: ['./request-reactivate.component.scss'],
})
export class RequestReactivateOperationStep1Component
  implements OnInit, OnDestroy
{
  @Input() batch: any
  @Input() cic: any
  @Input() companyName: any
  @Output() onInit = new EventEmitter<Component>()

  PaymentPageSize = 20

  bsConfig: any
  today = new Date()

  constructor(
    private fb: FormBuilder,
    public service: RequestReactivateOperationService,
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
    //console.log(this.batch);
  }

  ngOnDestroy() {}
}
