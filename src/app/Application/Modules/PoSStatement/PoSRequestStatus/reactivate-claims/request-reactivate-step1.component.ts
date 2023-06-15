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
import { StaticService } from '../../../Common/Services/static.service'
import { RequestReactivateService } from './request-reactivate.service'

@Component({
  selector: 'app-request-reactivate-claims-step1',
  templateUrl: './request-reactivate-step1.component.html',
  styleUrls: ['./request-reactivate.component.scss'],
})
export class RequestReactivateStep1Component implements OnInit, OnDestroy {
  @Input() batch: any
  @Input() terminals: any
  @Output() onInit = new EventEmitter<Component>()

  employeePageSize = 10
  paymentDate: any

  bsConfig: any

  constructor(
    private fb: FormBuilder,
    public service: RequestReactivateService,
    public translate: TranslateService,
    public staticService: StaticService,
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
}
