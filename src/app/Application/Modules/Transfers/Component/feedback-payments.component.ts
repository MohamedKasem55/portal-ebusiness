import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { distinctUntilChanged } from 'rxjs/operators'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { StorageService } from '../../../../core/storage/storage.service'
import { FeedbackTransferService } from '../Services/transfer.feedback.service'

@Component({
  templateUrl: '../View/feedback-transfer.html',
})
export class FeedbackPaymentsComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('downloadedFiles', { static: true }) table: any
  @ViewChild('filesInProcess', { static: true }) table2: any

  curPage = 1
  downloadableFiles: any
  inProgressFiles: any
  underProcessUpdatableFile: any
  displaySize = 20
  currentFile: any = null
  currentFileReference: any = null

  constructor(
    public service: FeedbackTransferService,
    public translate: TranslateService,
    public router: Router,
    public storageService: StorageService,
  ) {
    super()
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    tablas.push(this.table2)
    return tablas
  }

  setPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { page: 1, offset: 0 }
    }

    if (!dataTableEvent.offset) {
      dataTableEvent.offset = 0
    }
    if (!dataTableEvent.page || dataTableEvent.page === 0) {
      dataTableEvent.page = 1
    }

    this.curPage = dataTableEvent.page

    this.service.getResults(dataTableEvent.page, 10).subscribe((result) => {
      if (result === null) {
        this.onError(result)
      } else {
        this.downloadableFiles =
          result.fileDownloadListsOutputDTO.downloadableFile
        this.underProcessUpdatableFile =
          result.fileDownloadListsOutputDTO.underProcessUpdatableFile
        this.inProgressFiles = result.fileDownloadListsOutputDTO.filesInProcess
      }
    })
  }

  setSort(dataTableEvent) {}

  onError(result) {
    //
  }

  ngOnInit() {
    this.service.setFile(null)
    this.currentFileReference = null

    this.service
      .getFile()
      .pipe(distinctUntilChanged())
      .subscribe((result) => {
        this.currentFile = result
      })

    super.ngOnInit()
    this.setPage({ offset: 0 })
  }

  onDetailToggle(event) {
    //console.log('Detail Toggled', event);
  }

  ngOnDestroy() {
    this.service.setFile(null)
  }

  public details(value): void {
    this.service.getDetails(value).subscribe((result) => {
      if (result != null) {
        const user = JSON.parse(this.storageService.retrieve('currentUser'))
        const currentFile = []

        currentFile['list'] =
          result.transferDetailsOutputDTO.listLinesTransferPaymentFiles
        currentFile['fileReference'] = value.fileReference
        currentFile['date'] = value.requestDate
        this.currentFileReference = value.fileReference
        this.currentFile = currentFile
        this.service.setFile(this.currentFile)
      }
    })
    // this.service.setFileName(value.fileReference);
    // this.router.navigate(['/transfers/billPayments/feedbackfiles-details']);
  }
  closeItem() {
    this.service.setFile(null)
    this.currentFileReference = null
  }

  getHeaderDetail() {
    return (
      this.translate.instant('transfer.feedback.fileReference') +
      ':' +
      this.currentFileReference
    )
  }
}
