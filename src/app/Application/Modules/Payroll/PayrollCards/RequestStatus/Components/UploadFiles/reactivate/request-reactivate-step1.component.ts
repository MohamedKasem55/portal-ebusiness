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
import { RequestStatusService } from '../../../request-status.service'
import { RequestReactivateUploadFileService } from './request-reactivate.service'

@Component({
  selector: 'app-request-reactivate-upload-file-step1',
  templateUrl: './request-reactivate-step1.component.html',
  styleUrls: ['./request-reactivate.component.scss'],
})
export class RequestReactivateUploadFileStep1Component
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('payrollCardPageTable', { static: true }) table: any

  @Input() batch: any
  @Input() cic: any
  @Input() companyName: any
  @Output() onInit = new EventEmitter<Component>()

  uploadPageSize = 20
  uploadFilesDetails: any = {}
  bsConfig: any
  today = new Date()

  constructor(
    private fb: FormBuilder,
    public service: RequestReactivateUploadFileService,
    public translate: TranslateService,
    private requestStatusService: RequestStatusService,
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
    this.setPage(null)
    this.onInit.emit(this as Component)
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.requestStatusService
      .getBatchUploadFileDetails(
        this.batch,
        pageInfo.offset + 1,
        this.uploadPageSize,
      )
      .subscribe((result) => {
        if (!result.error) {
          this.uploadFilesDetails = result.cardIncentivesList
          this.uploadFilesDetails.totalPages =
            this.uploadFilesDetails.total / this.uploadPageSize
        }
      })
  }

  ngOnDestroy() {}
}
