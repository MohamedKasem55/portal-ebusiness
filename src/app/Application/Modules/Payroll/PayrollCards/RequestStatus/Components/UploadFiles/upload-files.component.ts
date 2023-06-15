import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../../../core/responsive/datatable-mobile.component'
import { RequestStatusService } from '../../request-status.service'

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
})
export class UploadFilesComponent
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('table', { static: true }) table: any

  sharedData: any = {}
  getUploadCardPaymentsFilesSubscription: Subscription
  uploadFilesResults: any = {}
  tableDisplaySize = 20
  futureLevels = false

  isCollapsedContentDetails = true
  bsConfig: any
  search: any = {}
  dateFromMax: Date = new Date()
  constructor(
    private router: Router,
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
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit(): void {
    super.ngOnInit()
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        containerClass: 'theme-dark-blue',
      },
    )
    this.uploadFilesResults.items = []
    this.uploadFilesResults.size = 0
    this.uploadFilesResults.total = 0

    this.sharedData.tableSelected = []

    this.setPage(null)
  }

  searchData() {
    this.setPage(null)
  }

  reset() {
    this.search = {}
    this.searchData()
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.getUploadCardPaymentsFilesSubscription = this.requestStatusService
      .getUploadCardPaymentsFiles(
        pageInfo.offset + 1,
        this.tableDisplaySize,
        this.search,
      )
      .subscribe((result) => {
        if (!result.error) {
          this.uploadFilesResults = result.batchListPayrolCardUploadFile
        }
        this.getUploadCardPaymentsFilesSubscription.unsubscribe()
      })
  }

  goActivate(row) {
    this.requestStatusService.getBatchUploadFile(row).subscribe((result) => {
      if (result.error) {
        return
      } else {
        this.requestStatusService.setUploadFile(result)
        this.requestStatusService.setUploadFileRow(row)
        this.router.navigate([
          '/payroll/payroll-cards/request-status/upload-files/activate',
        ])
      }
    })
  }

  changeDateTop(event) {
    //console.log('CHANGE', event);
    if (event instanceof Date) {
      this.dateFromMax = event
    } else {
      this.dateFromMax = new Date()
    }
  }
  openModal(row, popup) {
    popup.openModal(row)
  }
}
