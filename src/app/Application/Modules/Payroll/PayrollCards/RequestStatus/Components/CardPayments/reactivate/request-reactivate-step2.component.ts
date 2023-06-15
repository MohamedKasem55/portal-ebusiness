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
import { PayrollCardsService } from '../../../../payroll-cards.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  selector: 'app-request-reactivate-payment-step2',
  templateUrl: './request-reactivate-step2.component.html',
  styleUrls: ['./request-reactivate.component.scss'],
})
export class RequestReactivatePaymentStep2Component
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('authorization') authorization: any
  @ViewChild('payrollCardPageTable', { static: true }) table: any

  @Input() batch: any
  @Input() cic: any
  @Input() companyName: any
  @Input() option: any
  @Input() DeleteOption: any
  @Input() InitiateOption: any
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge
  @Input() requestValidate: RequestValidate
  @Output() onInit = new EventEmitter<Component>()

  PaymentPageSize = 20
  layout: any

  constructor(
    private fb: FormBuilder,
    public service: RequestReactivatePaymentService,
    public translate: TranslateService,
    private serviceshare: PayrollCardsService,
  ) {
    super()
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  valid(): boolean {
    if (this.authorization) {
      return this.authorization.valid()
    } else {
      return true
    }
  }

  ngOnInit() {
    super.ngOnInit()
    this.serviceshare.getInstitution().subscribe((result) => {
      if (!result.error) {
        this.layout = result.institutionDTO.layout
      }
    })
    this.onInit.emit(this as Component)
  }

  ngOnDestroy() {}
}
