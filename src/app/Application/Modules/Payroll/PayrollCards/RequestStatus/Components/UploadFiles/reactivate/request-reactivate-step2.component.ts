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
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  selector: 'app-request-reactivate-upload-file-step2',
  templateUrl: './request-reactivate-step2.component.html',
  styleUrls: ['./request-reactivate.component.scss'],
})
export class RequestReactivateUploadFileStep2Component
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('payrollCardPageTable', { static: true }) table: any
  @ViewChild('authorization') authorization: any

  @Input() batch: any
  @Input() cic: any
  @Input() companyName: any
  @Input() option: any
  @Input() DeleteOption: any
  @Input() InitiateOption: any
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge
  @Input() requestValidate: RequestValidate
  @Output() onInit = new EventEmitter<Component>()

  uploadPageSize = 20
  uploadFilesDetails: any = {}

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
          //console.log(this.uploadFilesDetails);
        }
      })
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
    this.setPage(null)
    this.onInit.emit(this as Component)
  }

  ngOnDestroy() {}
}
