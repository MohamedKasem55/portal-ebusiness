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
import { DatatableMobileComponent } from '../../../../../../core/responsive/datatable-mobile.component'
import { StaticService } from '../../../../Common/Services/static.service'
import { RequestReactivateFileService } from './request-reactivate-file.service'

@Component({
  selector: 'app-request-reactivate-file-step1',
  templateUrl: './request-reactivate-file-step1.component.html',
  styleUrls: ['./request-reactivate-file.component.scss'],
})
export class RequestReactivateFileStep1Component
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('employeePageTable') table: any

  @Input() batch: any
  @Input() cic: any
  @Input() companyName: any
  @Output() onInit = new EventEmitter<Component>()

  employeePageSize = 10

  bsConfig: any
  today = new Date()

  constructor(
    private fb: FormBuilder,
    public service: RequestReactivateFileService,
    public translate: TranslateService,
    public staticService: StaticService,
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

  ngOnDestroy() {}
}
