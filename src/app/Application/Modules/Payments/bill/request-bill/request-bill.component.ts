import {
  Component,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import { Router } from '@angular/router'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { AuthenticationService } from '../../../../../core/security/authentication.service'
import { LevelFormatPipe } from '../../../../Components/common/Pipes/getLevels-pipe'
import { PagedData } from '../../../../Model/paged-data'
import { StaticService } from '../../../Common/Services/static.service'
import { BillPaymentService } from '../bill-payments/bill-payment.service'
import { RequestBillService } from './bill.request.service'

@Component({
  templateUrl: './request-bill.payment.component.html',
})
export class RequestBillComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('requestbillTable', { static: true }) table: any
  @ViewChild('requestaddbillTable', { static: true }) tableAdd: any

  public RequesttablePage: PagedData<any>
  public RequesttableBillPage: PagedData<any>

  order: string
  orderType: string
  loading: boolean

  billCodes: any = []

  auxData: any = []
  subscriptions: Subscription[] = []
  futureLevels = false

  constructor(
    public servicePayment: BillPaymentService,
    public service: RequestBillService,
    public translate: TranslateService,
    private router: Router,
    private staticService: StaticService,
    public authenticationService: AuthenticationService,
    private injector: Injector,
  ) {
    super()
    this.RequesttablePage = new PagedData<any>()
    this.RequesttableBillPage = new PagedData<any>()
    this.order = 'requestDate'
    this.orderType = 'desc'
    this.refreshStatus()
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    if (this.tableAdd) {
      tablas.push(this.tableAdd)
    }
    return tablas
  }

  setPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }

    this.loading = true

    // Service Call
    this.service
      .getResults(
        this.order,
        this.orderType,
        dataTableEvent.offset + 1,
        this.RequesttablePage.page.pageSize,
      )
      .subscribe((result) => {
        if (result.error) {
          this.onError(result)
          //console.log("aqui vamos-->"+result);
        } else {
          this.loading = false
          this.processItemsLevels(result.pagedData.data)
          this.RequesttablePage = result.pagedData
          //console.log("aqui vamos-->"+this.RequesttablePage);
        }
      })
  }

  setSort(dataTableEvent) {
    if (dataTableEvent.sorts[0]) {
      this.order = dataTableEvent.sorts[0].prop
      this.orderType = dataTableEvent.sorts[0].dir
    }

    this.RequesttablePage.page.pageNumber = 1
    this.loading = true

    // Service Call with new short
    this.service
      .getResults(
        this.order,
        this.orderType,
        dataTableEvent.offset + 1,
        this.RequesttablePage.page.pageSize,
      )
      .subscribe((result) => {
        if (result === null) {
          this.onError(result)
        } else {
          this.loading = false
          this.processItemsLevels(result.pagedData.data)
          this.RequesttablePage = result
          //this.setBillerName(this.RequesttablePage);
        }
      })
  }

  setPageBill(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }

    this.loading = true

    // Service Call
    this.service
      .getResultsBill(
        this.order,
        this.orderType,
        dataTableEvent.offset + 1,
        this.RequesttableBillPage.page.pageSize,
      )
      .subscribe((result) => {
        if (result.error) {
          this.onError(result)
        } else {
          this.loading = false
          this.processItemsLevels(result.pagedData.data)
          this.RequesttableBillPage = result.pagedData
          this.transformBillCodeToLiterals()
        }
      })
  }

  private transformBillCodeToLiterals(): void {
    if (this.RequesttableBillPage && this.RequesttableBillPage.data) {
      for (const item of this.RequesttableBillPage.data) {
        item.billCodeLiteral = this.getBillCodeLiteral(item.billCode)
      }
    }
  }

  setSortBill(dataTableEvent) {
    if (dataTableEvent.sorts[0]) {
      this.order = dataTableEvent.sorts[0].prop
      this.orderType = dataTableEvent.sorts[0].dir
    }

    this.RequesttableBillPage.page.pageNumber = 1
    this.loading = true

    // Service Call with new short
    this.service
      .getResultsBill(
        this.order,
        this.orderType,
        dataTableEvent.offset + 1,
        this.RequesttableBillPage.page.pageSize,
      )
      .subscribe((result) => {
        if (result === null) {
          this.onError(result)
        } else {
          this.loading = false
          this.processItemsLevels(result.pagedData.data)
          this.RequesttableBillPage = result
          this.transformBillCodeToLiterals()
          //this.setBillerName(this.RequesttablePage);
        }
      })
  }

  onError(result) {
    //
  }

  ngOnInit() {
    super.ngOnInit()
    this.servicePayment.getBillCodes().subscribe((result) => {
      if (result.error) {
      } else {
        this.billCodes = result.billCodes
      }
      this.setPage({ offset: 0 })
      this.setPageBill({ offset: 0 })
    })

    this.subscriptions.push(
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.refreshStatus()
      }),
    )
  }

  getBillCodeLiteral(code) {
    for (let i = this.billCodes.length - 1; i >= 0; i--) {
      if (this.billCodes[i].billCode == code) {
        if (this.translate.currentLang == 'en') {
          return this.billCodes[i].addDescriptionEn
        } else {
          return this.billCodes[i].addDescriptionAr
        }
      }
    }
    return code
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  goActivate(row) {
    this.service.setElement(row)
    this.router.navigate(['/payments/billPayments/request/activate'])
  }

  goActivateBill(row) {
    this.service.setElement(row)
    this.router.navigate(['/payments/billPayments/request/activate-bill'])
  }

  refreshStatus() {
    const status = []
    status['I'] = this.translate.instant('status.initiate')
    status['P'] = this.translate.instant('status.pending')
    status['A'] = this.translate.instant('status.approve')
    status['R'] = this.translate.instant('status.rejected')
    this.auxData['status'] = status
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
