import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { parseDate } from 'ngx-bootstrap/chronos'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../../core/responsive/datatable-mobile.component'
import { Page } from '../../../../../Model/page'
import { PagedData } from '../../../../../Model/paged-data'
import { FeedBackFilesService } from '../feedback-files.service'
import { AbstractDatatableMobileComponent } from '../../../../Common/Components/Abstract/abstract-datatable-mobile.component'
import { FormBuilder } from '@angular/forms'
import { AuthenticationService } from '../../../../../../core/security/authentication.service'

@Component({
  selector: 'app-details-uploaded-files',
  templateUrl: './details-uploaded-files.component.html',
})
export class DetailsUploadedFilesComponent
  extends AbstractDatatableMobileComponent
  implements OnInit
{
  @ViewChild('table', { static: true }) table: any

  sharedData: any = {}
  optionBack: any
  detailsSubscription: Subscription
  detailsPage: PagedData<any>
  layout: any
  numberOfEmployee: any
  totalAmount: any
  dateFile: string
  step = 4

  constructor(
    public viewSentFilesService: FeedBackFilesService,
    public fb: FormBuilder,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
  ) {
    super(fb, translate, authenticationService, router)
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit(): void {
    super.ngOnInit()

    if (!this.viewSentFilesService.getSelectedFile()) {
      this.router.navigate(['/payroll/payroll-cards/feedback-files'])
    }

    this.detailsPage = new PagedData<any>()
    this.detailsPage.page = new Page()
    this.detailsPage.page.pageNumber = 1
    this.detailsPage.page.pageSize = 20

    this.sharedData['selectedFile'] =
      this.viewSentFilesService.getSelectedFile()
    this.optionBack = this.viewSentFilesService.getOptionBack()

    this.setPage(null)
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }

    this.detailsPage.page.pageNumber = pageInfo.offset
    switch (this.optionBack) {
      case this.viewSentFilesService.ONLINE_REQUEST:
      case this.viewSentFilesService.VIEW_PAYMENT_USING_FILE:
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
              this.layout = result.fileLayout
              this.dateFile = this.sharedData.selectedFile.fileName.split('_')
              for (let i = 0; i < result.listDetails.length; i++) {
                this.detailsPage.data[i].date = parseDate(
                  this.detailsPage.data[i].date,
                )
              }

              this.totalAmount = result.amountTotal
              this.numberOfEmployee = result.numberEmployees
              //this.viewDetailsResults = result;
            }
            this.detailsSubscription.unsubscribe()
          })
        break
      case this.viewSentFilesService.DOWNLOAD_MOL_FILE:
      case this.viewSentFilesService.VIEW_PAYMENT_USING_CARD:
        this.detailsSubscription = this.viewSentFilesService
          .detailsFeedbackFile(
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
              this.layout = result.fileLayout
              this.dateFile = this.sharedData.selectedFile.fileName.split('_')
              for (let i = 0; i < result.listDetails.length; i++) {
                this.detailsPage.data[i].date = parseDate(
                  this.detailsPage.data[i].date,
                )
              }

              this.totalAmount = result.amountTotal
              this.numberOfEmployee = result.numberEmployees
              //this.viewDetailsResults = result;
            }
            this.detailsSubscription.unsubscribe()
          })
        break
    }
  }

  back() {
    switch (this.optionBack) {
      case this.viewSentFilesService.ONLINE_REQUEST:
        this.router.navigateByUrl(
          '/payroll/payroll-cards/feedback-files/feedBackFilesViewOnlineRequest',
        )
        break
      case this.viewSentFilesService.DOWNLOAD_MOL_FILE:
        this.router.navigateByUrl(
          '/payroll/payroll-cards/feedback-files/feedBackFilesViewDownloadWps',
        )
        break
      case this.viewSentFilesService.VIEW_PAYMENT_USING_FILE:
        this.router.navigateByUrl(
          '/payroll/payroll-cards/feedback-files/feedBackFilesViewUploadFiles',
        )
        break
      case this.viewSentFilesService.VIEW_PAYMENT_USING_CARD:
        this.router.navigateByUrl(
          '/payroll/payroll-cards/feedback-files/feedBackFilesViewCardPayments',
        )
        break
    }
  }

  getRoutes(): any[] {
    const routes = [
      ['payroll.feedBackFiles.payroll'],
      ['payroll.feedBackFiles.payrollCards', ['/payroll/payroll-cards']],
      [
        'payroll.feedBackFiles.feedBackFilesBB',
        ['/payroll/payroll-cards/feedback-files'],
      ],
    ]

    if (this.optionBack == this.viewSentFilesService.VIEW_PAYMENT_USING_FILE) {
      routes.push([
        'payroll.viewPaymentUploadedFile',
        ['/payroll/payroll-cards/feedback-files/feedBackFilesViewUploadFiles'],
      ])
    }
    if (this.optionBack == this.viewSentFilesService.VIEW_PAYMENT_USING_CARD) {
      routes.push([
        'payroll.viewPaymentCardPayments',
        ['/payroll/payroll-cards/feedback-files/feedBackFilesViewCardPayments'],
      ])
    }
    if (this.optionBack == this.viewSentFilesService.ONLINE_REQUEST) {
      routes.push([
        'payroll.feedBackFiles.viewOnlineRequestMenu',
        [
          '/payroll/payroll-cards/feedback-files/feedBackFilesViewOnlineRequest',
        ],
      ])
    }
    if (this.optionBack == this.viewSentFilesService.DOWNLOAD_MOL_FILE) {
      routes.push([
        'payroll.feedBackFiles.viewDownloadWpsFilesMenu',
        ['/payroll/payroll-cards/feedback-files/feedBackFilesViewDownloadWps'],
      ])
    }
    return routes
  }

  getId(row): any {}

  getList(searchElement, order, orderType, offset, pageSize) {}
}
