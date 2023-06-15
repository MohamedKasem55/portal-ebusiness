import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { FeedBackFilesService } from './feedback-files-list.service'

@Component({
  templateUrl: './feedback-files.component.html',
})
export class FeedBackFilesComponent
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('downloadedFiles', { static: true }) table: any
  @ViewChild('filesInProcess', { static: true }) table2: any

  curPage = 1
  downloadableFiles: any
  inProgressFiles: any

  constructor(
    private feedBackFiles: FeedBackFilesService,
    public translate: TranslateService,
    public router: Router,
  ) {
    super()
  }

  ngOnInit() {
    super.ngOnInit()
    this.setPageFeedBackPages({ page: 0, offset: 0 })
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    tablas.push(this.table2)
    return tablas
  }

  public setPageFeedBackPages(dataTableEvent: {
    page: number
    offset?: number
  }) {
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

    this.feedBackFiles
      .getResults(dataTableEvent.page, 10)
      .subscribe((result) => {
        if (result === null) {
          this.onError(result)
        } else {
          this.downloadableFiles =
            result.fileDownloadListsOutputDTO.downloadableFile
          this.inProgressFiles =
            result.fileDownloadListsOutputDTO.filesInProcess
        }
      })
  }

  public details(value): void {
    this.feedBackFiles.setFileName(value.fileReference)
    this.feedBackFiles.setFileSelected(value)
    this.router.navigate(['/payments/billPayments/feedbackfiles-details'])
  }

  public setSortPayments(dataTableEvent) {}

  onError(result) {}

  onDetailToggle(event) {}
}
