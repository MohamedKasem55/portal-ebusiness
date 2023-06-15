import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { DatatableMobileComponent } from '../../../../../../../../core/responsive/datatable-mobile.component'
import { RequestReactivatePaymentService } from './request-reactivate.service'

@Component({
  selector: 'app-request-reactivate-payment-step1',
  templateUrl: './request-reactivate-step1.component.html',
  styleUrls: ['./request-reactivate.component.scss'],
})
export class RequestReactivatePaymentStep1Component
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('payrollCardPageTable', { static: true }) table: any

  @Input() batch: any
  @Input() cic: any
  @Input() companyName: any
  @Output() onInit = new EventEmitter<Component>()

  PaymentPageSize = 20

  bsConfig: any
  today = new Date()

  constructor(
    private fb: FormBuilder,
    public service: RequestReactivatePaymentService,
    public translate: TranslateService,
  ) {
    super()
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  ngOnInit() {
    super.ngOnInit()
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

  updateValue(event, cell, rowIndex) {
    this.batch.details[rowIndex][cell] = event.target.value
    this.batch.details[rowIndex]['amount'] =
      (this.batch.details[rowIndex]['basicSalary']
        ? +this.batch.details[rowIndex]['basicSalary']
        : 0) +
      (this.batch.details[rowIndex]['housingAllowance']
        ? +this.batch.details[rowIndex]['housingAllowance']
        : 0) +
      (this.batch.details[rowIndex]['otherEarning']
        ? +this.batch.details[rowIndex]['otherEarning']
        : 0) -
      (this.batch.details[rowIndex]['deductions']
        ? +this.batch.details[rowIndex]['deductions']
        : 0)
    this.batch.details = [...this.batch.details]
  }

  ngOnDestroy() {}
}
