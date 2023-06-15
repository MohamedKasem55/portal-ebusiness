import { Location } from '@angular/common'
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { PagedData } from '../../../../Model/paged-data'
import { ModelServiceMoiFeedBackFilesList } from '../Model/moi-feedback-files-list-service.model'
// Service to GET list of payments orders
import { FeedBackFiles } from '../Services/feedback-files-list.service'

@Component({
  templateUrl: './feedback-files.component.html',
})
export class FeedBackFilesComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('downloadedFiles', { static: true }) tableDownloadedFiles: any
  @ViewChild('filesInProcess', { static: true }) tablefilesInProcess: any

  feedBackFilesListPage: PagedData<ModelServiceMoiFeedBackFilesList>
  feedBackFilesInProcess: PagedData<ModelServiceMoiFeedBackFilesList>
  pageSize: number

  constructor(
    private feedBackFiles: FeedBackFiles,
    private _location: Location,
    public translate: TranslateService,
    public router: Router,
  ) {
    super()
    this.feedBackFilesListPage =
      new PagedData<ModelServiceMoiFeedBackFilesList>()
    this.feedBackFilesInProcess =
      new PagedData<ModelServiceMoiFeedBackFilesList>()
    this.pageSize = 10
  }

  getAllTables(): any[] {
    const tablas = []
    if (this.tableDownloadedFiles) {
      tablas.push(this.tableDownloadedFiles)
    }
    if (this.tablefilesInProcess) {
      tablas.push(this.tablefilesInProcess)
    }
    return tablas
  }

  public loadFileList() {
    // Service Call
    this.feedBackFiles.getResults().subscribe((result) => {
      if (result === null) {
        this.onError(result)
      } else {
        this.feedBackFilesListPage = result.dataDownloaded
        this.feedBackFilesListPage.data.forEach((item) => {
          item['fileName'] = item['fileName'].substring(
            item.fileName.length - 4,
            0,
          )
        })
        this.feedBackFilesInProcess = result.dataFileInProcess
      }
    })
  }

  public details(value): void {
    this.feedBackFiles.setFileName(value)
    this.router.navigate(['/payments/moi/feedback-files/details'])
  }

  onError(result) {}

  ngOnInit() {
    super.ngOnInit()
    this.loadFileList()
  }

  ngOnDestroy() {}
}
