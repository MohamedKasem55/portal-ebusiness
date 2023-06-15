import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { parseDate } from 'ngx-bootstrap/chronos'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../../../../core/responsive/datatable-mobile.component'
import { Page } from '../../../../../../../Model/page'
import { PagedData } from '../../../../../../../Model/paged-data'
import { ViewSentFilesService } from '../../../view-sent-files.service'
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-details-uploaded-files',
  templateUrl: './details-uploaded-files.component.html',
})
export class DetailsUploadedFilesComponent
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('table', { static: true }) table: any

  sharedData: any = {}
  detailsSubscription: Subscription
  detailsPage: PagedData<any>
  numberOfEmployee: any
  totalAmount: any
  dateFile: string
  step = 4

  constructor(
    public datePipe: DatePipe,
    private viewSentFilesService: ViewSentFilesService,
    private router: Router,
    public translate: TranslateService,
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
    this.detailsPage = new PagedData<any>()
    this.detailsPage.page = new Page()
    this.detailsPage.page.pageNumber = 1
    this.detailsPage.page.pageSize = 20
    this.dateFile = this.sharedData.selectedFile.fileName.split('_')
    this.sharedData.tableSelected = []
    this.setPage(null)
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }

    this.detailsPage.page.pageNumber = pageInfo.offset

    this.detailsSubscription = this.viewSentFilesService
      .detailsFile(
        this.sharedData.selectedFile,
        this.detailsPage.page.pageNumber + 1,
        this.detailsPage.page.pageSize,
      )
      .subscribe((result) => {
        if (!result.error) {
          this.detailsPage.page.pageNumber =
            this.detailsPage.page.pageNumber + 1
          this.detailsPage.page.size = result.size
          this.detailsPage.page.totalElements = result.total
          this.detailsPage.page.totalPages = result.total / result.size
          this.detailsPage.data = result.listDetails

          for (let i = 0; i < result.listDetails.length; i++) {
            this.detailsPage.data[i].date = parseDate(
              this.dateFile[this.dateFile.length - 2],
            )
            const dateTemp = this.detailsPage.data[i].date
            this.detailsPage.data[i].dReceived = this.datePipe.transform(
              dateTemp,
              'dd/MM/yyyy',
            )
          }

          this.totalAmount = result.amountTotal
          this.numberOfEmployee = result.numberEmployees
          //this.viewDetailsResults = result;
        }
        this.detailsSubscription.unsubscribe()
      })
  }
}
