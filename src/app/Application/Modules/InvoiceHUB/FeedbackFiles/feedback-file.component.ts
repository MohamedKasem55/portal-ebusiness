import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { FeedbackFileService } from './feedback-file.service'

@Component({
  selector: 'app-feedback-file',
  templateUrl: './feedback-file.component.html',
  styleUrls: ['./feedback-file.component.scss'],
})
export class FeedbackFileComponent
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('downloadFileTable') downloadFileTable: any
  @ViewChild('filesInProcessTable') filesInProcessTable: any
  @ViewChild('underProcessUpdatableFileTable')
  underProcessUpdatableFileTable: any

  underProcessUpdatableFile = []
  filesInProcess = []
  downloadFile = []

  currentRow = {}
  detailsRow = []

  underProcessUpdatableFilePageSize = 10
  filesInProccessPageSize = 10
  downloadFilePageSize = 10
  detailsRowPageSize = 10

  details = false

  subscriber: Subscription
  constructor(
    private service: FeedbackFileService,
    public translate: TranslateService,
    public router: Router,
  ) {
    super()
  }

  getAllTables(): any[] {
    const tablas = []
    if (this.downloadFileTable) {
      tablas.push(this.downloadFileTable)
    }
    if (this.filesInProcessTable) {
      tablas.push(this.filesInProcessTable)
    }
    if (this.underProcessUpdatableFileTable) {
      tablas.push(this.underProcessUpdatableFileTable)
    }

    return tablas
  }
  ngOnInit(): void {
    super.ngOnInit()
    this.details = false
    this.underProcessUpdatableFile = []
    this.filesInProcess = []
    this.downloadFile = []
    this.detailsRow = []
    this.underProcessUpdatableFilePageSize = 10
    this.filesInProccessPageSize = 10
    this.downloadFilePageSize = 10
    this.detailsRowPageSize = 10
    this.subscriber = this.service.getData(1, 20).subscribe((result) => {
      if (result.error) {
        return
      } else {
        this.underProcessUpdatableFile =
          result.fileDownloadListsOutputDTO.underProcessUpdatableFile.items
        this.filesInProcess =
          result.fileDownloadListsOutputDTO.filesInProcess.items
        this.downloadFile =
          result.fileDownloadListsOutputDTO.downloadableFile.items
      }
      this.subscriber.unsubscribe()
    })
  }

  setPageSizeDownloadableFile(event) {
    this.downloadFilePageSize = event.target.value
  }
  setPageSizeFilesInProcess(event) {
    this.filesInProccessPageSize = event.target.value
  }
  setPageSizeUnderProcessUpdatableFile(event) {
    this.underProcessUpdatableFilePageSize = event.target.value
  }

  setPageSizedetailsRow(event) {
    this.detailsRowPageSize = event.target.value
  }

  goToDetails(row) {
    this.subscriber = this.service.getDataDetails(row).subscribe((result) => {
      if (result.error) {
        return
      } else {
        this.details = true
        this.currentRow = row
        this.detailsRow =
          result.sadadInvoiceDetailsOutputDTO.listLinesSadadInvoiceFiles
      }
      this.subscriber.unsubscribe()
    })
  }
}
