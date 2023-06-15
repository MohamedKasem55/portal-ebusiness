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
import { RequestReactivateFileService } from './request-reactivate-file.service'
import { StaticService } from '../../../../Common/Services/static.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  selector: 'app-request-reactivate-file-step2',
  templateUrl: './request-reactivate-file-step2.component.html',
  styleUrls: ['./request-reactivate-file.component.scss'],
})
export class RequestReactivateFileStep2Component
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('employeePageTable') table: any
  @ViewChild('authorization') authorization: any

  @Input() batch: any
  @Input() paymentDate: any
  @Input() cic: any
  @Input() companyName: any
  @Input() option: any
  @Input() DeleteOption: any
  @Input() InitiateOption: any
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge
  @Input() requestValidate: RequestValidate
  @Output() onInit = new EventEmitter<Component>()

  employeePageSize = 10

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

  valid(): boolean {
    if (this.authorization) {
      return this.authorization.valid()
    } else {
      return true
    }
  }

  ngOnInit() {
    super.ngOnInit()
    this.onInit.emit(this as Component)
  }

  ngOnDestroy() {}
}
