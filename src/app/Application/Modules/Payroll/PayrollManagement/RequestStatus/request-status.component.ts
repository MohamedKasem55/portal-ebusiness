import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
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
  implements OnInit
{
  @ViewChild('table', { static: true }) table: any
  @ViewChild('payrollTable', { static: true }) payrollTable: any

  sharedData: any = {}
  getRequestStatusSubscription: Subscription
  requestStatus: any = {}
  tableDisplaySize = 50

  payrollPagedResults: any = {}
  payrollDisplaySize = 50
  payrollSubscription: Subscription

  constructor(
    private requestStatusService: RequestStatusService,
    public translate: TranslateService,
    public router: Router,
  ) {
    super()
  }

  getAllTables(): any[] {
    const tablas = []
    if (this.table) {
      tablas.push(this.table)
    }
    if (this.payrollTable) {
      tablas.push(this.payrollTable)
    }
    return tablas
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit(): void {
    super.ngOnInit()

    this.requestStatus.batchPayrollsList = []
    this.requestStatus.size = 0
    this.requestStatus.total = 0

    this.sharedData.tableSelected = []

    this.setPage(null)

    this.payrollPagedResults.items = []
    this.payrollPagedResults.size = 0
    this.payrollPagedResults.total = 0
    this.sharedData.payrollSelected = []

    this.setPagePayroll(null)
  }

  setPagePayroll(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }

    this.payrollSubscription = this.requestStatusService
      .getListPayroll(pageInfo.offset + 1, this.payrollDisplaySize)
      .subscribe((result) => {
        if (!result.error) {
          this.payrollPagedResults = result.pendingPayrollList
        }
        this.payrollSubscription.unsubscribe()
      })
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.getRequestStatusSubscription = this.requestStatusService
      .getData(pageInfo.offset + 1, this.tableDisplaySize)
      .subscribe((result) => {
        if (!result.error) {
          this.requestStatus = result
        }
        this.getRequestStatusSubscription.unsubscribe()
      })
  }

  goActivate(row) {
    //
    this.requestStatusService.getBatch(row).subscribe((result) => {
      if (result.error) {
        return
      } else {
        this.requestStatusService.setPayment(result)
        this.router.navigate([
          '/payroll/payroll-management/request-status/activate',
        ])
      }
    })
  }

  goActivateFile(row) {
    //
    this.requestStatusService.getBatchFile(row).subscribe((result) => {
      if (result.error) {
        return
      } else {
        this.requestStatusService.setPaymentFile(result)
        this.router.navigate([
          '/payroll/payroll-management/request-status/activate-file',
        ])
      }
    })
  }

  openModal(row, popup) {
    popup.openModal(row)
  }
}
