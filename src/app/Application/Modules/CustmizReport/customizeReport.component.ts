import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { CustomizeReportService } from './customizeReport.service'
import { saveAs } from 'file-saver'
import { TranslateService } from '@ngx-translate/core'
import { PagedData } from '../../Model/paged-data'
import { DatatableComponent } from '@swimlane/ngx-datatable'
import { DatePipe } from '@angular/common'


@Component({
  selector: 'customizeReport',
  templateUrl: './customizeReport.component.html',
  styleUrls: ['./customizeReport.component.scss'],
})
export class CustomizeReportComponent
  implements OnInit, OnDestroy {

  @ViewChild('ReportTable', { static: true }) reportTable: DatatableComponent

  public bsConfig: any = {}
  public today: Date

  public footerHeight: any = window.innerWidth < 800 ? 150 : 74
  public defaultHeight: any = 'auto'
  public isAllSelected: boolean = false
  public selectedCount = 0
  public tablePage: PagedData<any> = new PagedData<any>()
  public isSearchCollapsed: boolean = true
  public dateFrom: Date
  public dateTo: Date

  constructor(
    public translate: TranslateService,
    public customizeReportService: CustomizeReportService,
    private datePipe: DatePipe,
  ) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.getFileList(null)
    this.tablePage.page.pageSize = 10
    this.today = this.getToday(23, 59, 59)
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        dateInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-dark-blue',
      },
    )
  }

  getToday(h, m, s) {
    let d = new Date()
    let year = d.getFullYear()
    let month = d.getMonth()
    let day = d.getDate()
    return new Date(year, month, day, h, m, s)
  }

  resetValues() {
    this.dateFrom = null
    this.dateTo = null
    this.getFileList(null)
  }

  getFileList(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    let dateFrom = this.datePipe.transform(this.dateFrom, 'yyyy-MM-dd')
    let dateTo = this.datePipe.transform(this.dateTo, 'yyyy-MM-dd')
    this.customizeReportService.getFileList(pageInfo.offset, this.tablePage.page.pageSize, dateFrom, dateTo).subscribe(result => {
      if (result) {
        this.tablePage = result
      }
    })
  }

  selectAll(): void {
    this.selectedCount = 0
    this.isAllSelected = !this.isAllSelected
    this.tablePage.data.forEach((item: any) => {
      item.enabled = this.isAllSelected
    })
    if (this.isAllSelected) {
      this.selectedCount = this.tablePage.data.length
    }
  }

  onChangeAccount(row) {
    this.isAllSelected = true
    this.selectedCount = 0
    this.tablePage.data.forEach((item: any) => {
      if (item.fileName === row.fileName) {
        item.enabled = !item.enabled
      }
      if (item.enabled) {
        this.selectedCount++
      }
      this.isAllSelected = this.isAllSelected && item.enabled
    })
  }

  download(fileName) {
    this.customizeReportService.getPDFFile(fileName).subscribe(res => {
      if (res != null) {
        saveAs(res.file, res.fileName)
      }
    })
  }

  downloadFiles() {
    let data = []
    this.tablePage.data.forEach((item: any) => {
      if (item.enabled) {
        data.push({ fileName: item.fileName })
      }
    })
    this.customizeReportService.getZipFile(data).subscribe(res => {
      if (res != null) {
        saveAs(res.file, res.fileName)
      }
    })
  }
}
