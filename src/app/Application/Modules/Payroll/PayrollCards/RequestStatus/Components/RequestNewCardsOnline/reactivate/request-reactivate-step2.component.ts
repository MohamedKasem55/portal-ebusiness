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
import { RequestReactivateNewCardService } from './request-reactivate.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  selector: 'app-request-reactivate-new-card-step2',
  templateUrl: './request-reactivate-step2.component.html',
  styleUrls: ['./request-reactivate.component.scss'],
})
export class RequestReactivateNewCardStep2Component
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('payrollCardPageTable', { static: true }) table: any
  @ViewChild('authorization') authorization: any

  @Input() batch: any
  @Input() cic: any
  @Input() companyName: any
  @Input() fees: any
  @Input() option: any
  @Input() DeleteOption: any
  @Input() InitiateOption: any
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge
  @Input() requestValidate: RequestValidate
  @Output() onInit = new EventEmitter<Component>()

  paymentPageSize = 20

  constructor(
    private fb: FormBuilder,
    public service: RequestReactivateNewCardService,
    public translate: TranslateService,
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
    this.getAllTables()
    this.onInit.emit(this as Component)
  }
}
