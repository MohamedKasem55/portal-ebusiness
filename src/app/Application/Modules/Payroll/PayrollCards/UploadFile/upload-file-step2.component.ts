import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { Page } from '../../../../Model/page'
import { PagedData } from '../../../../Model/paged-data'
import { FileUploadService } from './upload-file.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  selector: 'app-upload-file-step2',
  templateUrl: './upload-file-step2.component.html',
  styleUrls: ['./upload-file.component.scss'],
})
export class UploadFileStep2Component
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('uploadFilePageTable', { static: true }) table: any
  @ViewChild('authorization', { static: true }) authorization: any

  @Input() initPayment: any
  @Input() rol: any
  @Output() onInit = new EventEmitter<any>()

  uploadFilesPage: PagedData<any>
  subscriptions: Subscription[] = []

  generateChallengeAndOTP: ResponseGenerateChallenge
  requestValidate: RequestValidate

  constructor(
    public translate: TranslateService,
    public service: FileUploadService,
  ) {
    super()
    this.requestValidate = new RequestValidate()
    this.uploadFilesPage = new PagedData<any>()
    this.uploadFilesPage.data = []
    const page = new Page()
    page.pageNumber = 1
    page.pageSize = 10
    this.uploadFilesPage.page = page

  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  ngOnInit(): void {
    super.ngOnInit()
    this.uploadFilesPage.data =
      this.initPayment.fileDetailsPaginationOutputDTO.fileDetailsPaginatedList
    this.generateChallengeAndOTP = this.initPayment.responseGenerateChallenge
    this.onInit.emit(this)
  }

  valid() {
    return this.authorization.valid()
  }
  setPageSize(event: any) {
    this.uploadFilesPage.page.pageSize = +event.target.value
  }
}
