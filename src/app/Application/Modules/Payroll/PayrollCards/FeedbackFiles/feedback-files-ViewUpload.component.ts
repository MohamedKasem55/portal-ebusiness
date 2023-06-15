import { Location } from '@angular/common'
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
//Service
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { StorageService } from '../../../../../core/storage/storage.service'
import { Page } from '../../../../Model/page'
import { PagedData } from '../../../../Model/paged-data'
import { FeedBackFilesService } from './feedback-files.service'

@Component({
  selector: 'app-feedback-files',
  templateUrl: './feedback-files-ViewUpload.component.html',
})
export class FeedbackFilesViewUploadComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('uploadedFilesTable', { static: true }) table: any

  bsConfig: any
  maxDate: Date
  isCollapsedContent: boolean

  institutionName: string
  organizationName: string
  cic: string

  fileName: string
  batchName: string
  dateReceived: Date

  uploadedFiles: PagedData<any>
  subscription: Subscription

  isCollapsedContentDetails = true
  search: any = {}

  constructor(
    private router: Router,
    private _location: Location,
    public translate: TranslateService,
    public storage: StorageService,
    private service: FeedBackFilesService,
  ) {
    super()
    this.maxDate = new Date()
    this.uploadedFiles = new PagedData<any>()

    this.institutionName = JSON.parse(storage.retrieve('currentUser'))[
      'company'
    ]['institutionDescription']
    this.organizationName = JSON.parse(storage.retrieve('currentUser'))[
      'company'
    ]['companyName']
    this.cic = JSON.parse(storage.retrieve('currentUser'))['company'][
      'profileNumber'
    ]
  }

  getMaxDate() {
    //return (this.birthDate?this.birthDate:this.today);
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  setPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }

    const data = {
      page: dataTableEvent.offset + 1,
      rows: this.uploadedFiles.page.pageSize,
    }

    // Service Call
    this.subscription = this.service
      .uploadedFiles(data, this.search)
      .subscribe((result) => {
        if (result === null) {
          //this.onError(result);
          //
        } else {
          this.uploadedFiles.data = result.fileDTOList
          const pageObject = new Page()

          pageObject.pageNumber = 1
          pageObject.pageSize = data.rows
          pageObject.size = result.size
          pageObject.totalElements = result.total
          pageObject.totalPages = pageObject.totalElements / pageObject.pageSize

          this.uploadedFiles.page = pageObject

          this.subscription.unsubscribe()
        }
      })
  }

  ngOnInit() {
    super.ngOnInit()
    if (this.translate['currentLang'] == 'en') {
      this.bsConfig = Object.assign(
        {},
        {
          showWeekNumbers: false,
          adaptivePosition: true,
          locale: 'en',
          containerClass: 'theme-dark-blue',
          dateInputFormat: 'DD/MM/YYYY',
        },
      )
    } else {
      this.bsConfig = Object.assign(
        {},
        {
          showWeekNumbers: false,
          adaptivePosition: true,
          locale: 'ar',
          containerClass: 'theme-dark-blue',
          dateInputFormat: 'DD/MM/YYYY',
        },
      )
    }

    this.setPage({ offset: 0 })
  }

  ngOnDestroy() {}

  downloadFile(data) {
    const subscription = this.service
      .downloadFile(data, true)
      .subscribe((response) => {
        subscription.unsubscribe()
        if (response === null) {
        } else {
          if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(response, data)
          } else {
            const downloadUrl = URL.createObjectURL(response)
            const link = document.createElement('a')
            link.download = data
            link.href = downloadUrl
            document.body.appendChild(link)
            link.click()
          }
        }
      })
  }

  showFile(data) {
    this.service.setSelectedFile(data)
    this.service.setOptionBack(this.service.VIEW_PAYMENT_USING_FILE)
    this.router.navigateByUrl(
      '/payroll/payroll-cards/feedback-files/details-file',
    )
  }

  searchData() {
    this.setPage(null)
  }

  reset() {
    this.search = {}
  }
}
