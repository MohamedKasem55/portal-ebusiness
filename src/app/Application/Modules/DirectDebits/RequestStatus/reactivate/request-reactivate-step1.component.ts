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
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { RequestReactivateService } from './request-reactivate.service'

@Component({
  selector: 'app-request-reactivate-step1',
  templateUrl: './request-reactivate-step1.component.html',
  styleUrls: ['./request-reactivate.component.scss'],
})
export class RequestReactivateStep1Component
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('employeePageTable') table: any

  @Input() batch: any
  @Input() type: any
  @Input() cic: any
  @Input() companyName: any
  @Input() orginatorId: any
  @Output() onInit = new EventEmitter<Component>()
  today = new Date()
  public paymentDate: any
  bsConfig: any
  employeePageSize: any = 20

  constructor(
    private fb: FormBuilder,
    public translate: TranslateService,
    public service: RequestReactivateService,
  ) {
    super()
  }

  getAllTables(): any[] {
    const tablas = []
    if (this.table) {
      tablas.push(this.table)
    }
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
    this.paymentDate = this.batch.directDebit.claimDate
    //console.log(this.orginatorId);
  }

  ngOnDestroy() {}
}
