import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { parseDate } from 'ngx-bootstrap/chronos'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../../../../core/responsive/datatable-mobile.component'
import { Page } from '../../../../../../../Model/page'
import { PagedData } from '../../../../../../../Model/paged-data'
import { PayrollCardsService } from '../../../../payroll-cards.service'
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
  dataReceived: any
  step = 4
  layout: any

  constructor(
    public viewSentFilesService: ViewSentFilesService,
    private router: Router,
    public translate: TranslateService,
    private serviceshare: PayrollCardsService,
    public datePipe: DatePipe,
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

    this.sharedData.tableSelected = []

    if (
      typeof this.sharedData.selectedFile == 'undefined' ||
      this.sharedData.selectedFile == null
    ) {
      this.router.navigate([
        '/payroll/payroll-cards/view-sent-files/view-uploaded-files',
      ])
    }

    //this.dateFile = this.sharedData.selectedFile.fileName.split('_')
    this.dataReceived = this.sharedData.selectedFile.dataReceived
    this.setPage(null)
    this.serviceshare.getInstitution().subscribe((result) => {
      if (!result.error) {
        this.layout = result.institutionDTO.layout
      }
    })
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
          const dataReceived = this.datePipe.transform(
            this.dataReceived,
            'dd/MM/yyyy',
          )

          this.detailsPage.page.pageNumber =
            this.detailsPage.page.pageNumber + 1
          this.detailsPage.page.size = result.size
          this.detailsPage.page.totalElements = result.total
          this.detailsPage.page.totalPages = result.total / result.size
          this.detailsPage.data = result.listDetails
          this.totalAmount = result.amountTotal
          this.numberOfEmployee = result.numberEmployees
          //this.viewDetailsResults = result;
          result['listDetails'].forEach((item) => {
            item['dataReceived'] = dataReceived
          })
        }

        this.detailsSubscription.unsubscribe()
      })
  }

  public transformDate(date: string) {
    return (
      date.substring(6, 8) +
      '/' +
      date.substring(4, 6) +
      '/' +
      date.substring(0, 4)
    )
  }
}
