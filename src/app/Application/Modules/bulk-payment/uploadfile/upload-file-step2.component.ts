import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { Page } from '../../../Model/page'
import { PagedData } from '../../../Model/paged-data'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  selector: 'app-upload-file-step2',
  templateUrl: './upload-file-step2.component.html',
  styleUrls: ['./upload-file.component.scss'],
})
export class FileUploadStep2Component
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('uploadFilePageTable', { static: true }) table: any
  @Input() initPayment: any

  step: number
  uploadFilesPage: PagedData<any>
  generateChallengeAndOTP: ResponseGenerateChallenge
  requestValidate: RequestValidate = new RequestValidate()

  constructor(public translate: TranslateService) {
    super()
    this.step = 2
    this.uploadFilesPage = new PagedData<any>()
    this.uploadFilesPage.data = []
    const page = new Page()
    page.pageNumber = 1
    page.pageSize = 20
    this.uploadFilesPage.page = page
  }

  ngOnInit() {
    super.ngOnInit()
    this.uploadFilesPage.data =
      this.initPayment.bulkPaymentsBatchDTO.fileLinesList
    this.uploadFilesPage.page.totalPages = 1
    this.uploadFilesPage.page.totalElements = this.initPayment.total
    this.uploadFilesPage.page.size = this.initPayment.size
    this.generateChallengeAndOTP = this.initPayment.generateChallengeAndOTP
    //this.generateChallengeAndOTP = this.initPayment.responseGenerateChallenge;
  }

  getAllTables(): any[] {
    const tablas = []
    if (this.table) {
      tablas.push(this.table)
    }
    return tablas
  }
}
