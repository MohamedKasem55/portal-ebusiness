import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { RequestStatusService } from './request-status.service'
import { LevelFormatPipe } from '../../../../Components/common/Pipes/getLevels-pipe'

@Component({
  selector: 'app-request-status',
  templateUrl: './request-status.component.html',
  styleUrls: ['./request-status.component.scss'],
})
export class RequestStatusComponent
  extends DatatableMobileComponent
  implements OnInit
{
  @Input() futureLevels = false
  @ViewChild('table', { static: true }) table: any
  urlActivate = ['/posstatement/pos-manage-request/request-status/activate']

  sharedData: any = {}
  requestStatusSubscription: Subscription
  requestStatus: any = {}
  tableDisplaySize = 20

  searchObject = {
    dateFrom: [''],
    dateTo: [''],
    status: [''],
  }
  searchForm: FormGroup
  searchFormData: any
  bsConfig: any
  isCollapsedContent = true

  constructor(
    public fb: FormBuilder,
    private requestStatusService: RequestStatusService,
    private translate: TranslateService,
    public router: Router,
    public injector: Injector,
  ) {
    super()
    this.searchForm = this.fb.group(this.searchObject)
    this.searchFormData = Object.assign({}, this.searchForm.value)
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  ngOnInit(): void {
    super.ngOnInit()
    this.bsConfig = Object.assign(
      {},
      { containerClass: 'theme-dark-blue' },
      { dateInputFormat: 'D/MM/YYYY' },
    )

    this.requestStatus.elements = []
    this.requestStatus.size = 0
    this.requestStatus.total = 0

    this.sharedData.tableSelected = []

    this.setPage(null)
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.requestStatusSubscription = this.requestStatusService
      .getData(this.searchFormData, pageInfo.offset + 1, this.tableDisplaySize)
      .subscribe((result) => {
        if (!result.error) {
          this.requestStatus.elements = result.posManagementBatchList.items
          this.requestStatus.size = result.posManagementBatchList.size
          this.requestStatus.total = result.posManagementBatchList.total
          this.requestStatus.elements.forEach((item) => {
            item['curStatusExport'] = new LevelFormatPipe(
              this.injector,
            ).transform(
              this.futureLevels
                ? item.futureSecurityLevelsDTOList
                : item.securityLevelsDTOList,
              'status',
            )
            item['nextStatusExport'] = new LevelFormatPipe(
              this.injector,
            ).transform(
              this.futureLevels
                ? item.futureSecurityLevelsDTOList
                : item.securityLevelsDTOList,
              'nextStatus',
            )
          })
        }

        this.requestStatusSubscription.unsubscribe()
      })
  }

  goActivate(row) {
    //this.requestStatusService.getBatch(row).subscribe((result) => {
    //      if (result.error) {
    //        return;
    //      } else {
    //        this.requestStatusService.setPayment(result);
    //        this.router.navigate(this.urlActivate);
    //      }
    //});
    this.requestStatusService.setElement(row)
    this.router.navigate(this.urlActivate)
  }

  search() {
    this.searchFormData = Object.assign({}, this.searchForm.value)
    this.requestStatusSubscription = this.requestStatusService
      .getData(this.searchFormData, 1, this.tableDisplaySize)
      .subscribe((result) => {
        if (!result.error) {
          this.requestStatus.elements = result.posManagementBatchList.items
          this.requestStatus.size = result.posManagementBatchList.size
          this.requestStatus.total = result.posManagementBatchList.total
          this.requestStatus.elements.forEach((item) => {
            item['curStatusExport'] = new LevelFormatPipe(
              this.injector,
            ).transform(
              this.futureLevels
                ? item.futureSecurityLevelsDTOList
                : item.securityLevelsDTOList,
              'status',
            )
            item['nextStatusExport'] = new LevelFormatPipe(
              this.injector,
            ).transform(
              this.futureLevels
                ? item.futureSecurityLevelsDTOList
                : item.securityLevelsDTOList,
              'nextStatus',
            )
          })
        }
        this.requestStatusSubscription.unsubscribe()
      })
  }

  reset() {
    this.searchForm.reset()
    this.search()
  }

  openModal(row, popup) {
    if (this.futureLevels) {
      popup.openModal(row.futureSecurityLevelsDTOList)
    } else {
      popup.openModal(row.securityLevelsDTOList)
    }
  }
}
