import {
  Component,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { LevelFormatPipe } from '../../../Components/common/Pipes/getLevels-pipe'
import { RequestStatusService } from './request-status.service'

//import { Page } from '../../../../Model/page';
//import { PagedData } from "app/Application/Model/paged-data";
//import { ModelRequestStatus } from "./request-status-service.model";

@Component({
  selector: 'app-request-status',
  templateUrl: './request-status.component.html',
  styleUrls: ['./request-status.component.scss'],
})
export class RequestStatusComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('table1', { static: true }) table1: any
  @ViewChild('table2', { static: true }) table2: any

  sharedData: any = {}
  getRequestStatusSubscription: Subscription[] = []
  requestStatus: any = {}
  requestUploadBatchStatus: any = {}
  tableDisplaySize = 10
  batchTableDisplaySize = 10
  futureLevels = false
  constructor(
    private requestStatusService: RequestStatusService,
    public translate: TranslateService,
    public router: Router,
    private injector: Injector,
  ) {
    super()
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table1)
    tablas.push(this.table2)
    return tablas
  }

  ngOnInit(): void {
    super.ngOnInit()
    this.requestStatus.batchList = []
    this.requestStatus.size = 0
    this.requestStatus.total = 0

    this.requestUploadBatchStatus.batchList = []
    this.requestUploadBatchStatus.size = 0
    this.requestUploadBatchStatus.total = 0

    this.sharedData.tableSelected = []

    this.setPage(null)
    this.setUploadBatchPage(null)
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.getRequestStatusSubscription.push(
      this.requestStatusService
        .getData(pageInfo.offset + 1, this.tableDisplaySize)
        .subscribe((result) => {
          if (!result.error) {
            this.processItemsLevels(result.pendingDirectDebitsList.items)
            this.requestStatus.batchList = result.pendingDirectDebitsList.items
            this.requestStatus.size = result.pendingDirectDebitsList.size
            this.requestStatus.total = result.pendingDirectDebitsList.total
          }
        }),
    )
  }

  setUploadBatchPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.getRequestStatusSubscription.push(
      this.requestStatusService
        .getUploadBatchData(pageInfo.offset + 1, this.batchTableDisplaySize)
        .subscribe((result) => {
          if (!result.error) {
            this.processItemsLevels(result.pendingDirectDebitsList.items)
            this.requestUploadBatchStatus.batchList =
              result.pendingDirectDebitsList.items
            this.requestUploadBatchStatus.size =
              result.pendingDirectDebitsList.size
            this.requestUploadBatchStatus.total =
              result.pendingDirectDebitsList.total
          }
        }),
    )
  }

  goActivate(row) {
    this.getRequestStatusSubscription.push(
      this.requestStatusService.getBatch(row).subscribe((result) => {
        if (result.error) {
          return
        } else {
          this.requestStatusService.setTypeData('single')
          this.requestStatusService.setDataElement(result)
          this.router.navigate(['/direct-debits/request-status/activate'])
        }
      }),
    )
  }

  goUploadBatchActivate(row) {
    this.getRequestStatusSubscription.push(
      this.requestStatusService.getUploadBatch(row).subscribe((result) => {
        if (result.error) {
          return
        } else {
          this.requestStatusService.setTypeData('upload')
          this.requestStatusService.setDataElement(result)
          this.router.navigate(['/direct-debits/request-status/activate'])
        }
      }),
    )
  }

  onFooterUploadBatchPage(value) {
    this.setUploadBatchPage({ offset: +value.page - 1 })
  }
  onFooterPage(value) {
    this.setPage({ offset: +value.page - 1 })
  }

  setUploadBatchPageSize(event: any) {
    this.batchTableDisplaySize = +event.target.value
    this.setUploadBatchPage(null)
  }

  setPageSize(event: any) {
    this.tableDisplaySize = +event.target.value
    this.setPage(null)
  }

  ngOnDestroy() {
    this.getRequestStatusSubscription.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.getRequestStatusSubscription = []
  }

  openModal(row, popup) {
    popup.openModal(row)
  }

  protected processItemsLevels(items) {
    if (Array.isArray(items) && items.length > 0) {
      items.forEach((item) => {
        item['curStatusExport'] = new LevelFormatPipe(this.injector).transform(
          item.securityLevelsDTOList,
          'status',
        )
        item['nextStatusExport'] = new LevelFormatPipe(this.injector).transform(
          item.securityLevelsDTOList,
          'nextStatus',
        )
      })
    }
  }
}
