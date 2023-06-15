import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { DatatableComponent } from '@swimlane/ngx-datatable'
import { take } from 'rxjs/operators'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { PagedData } from '../../../../Model/paged-data'
import { GovRevenueBatchDSO } from '../../Model/gov-revenue-batch'
import { GovernmentRevenueService } from '../../Services/government-revenue.service'

@Component({
  selector: 'app-previous-payments',
  templateUrl: './previous-payments.component.html',
})
export class PreviousPaymentsComponent
  extends DatatableMobileComponent
  implements OnInit {
  @ViewChild('paymentTable', { static: true }) table: DatatableComponent
  paymentPage: PagedData<GovRevenueBatchDSO>

  constructor(
    private governmentRevenueService: GovernmentRevenueService,
    public router: Router,
    public translate: TranslateService,
  ) {
    super()
    this.paymentPage = new PagedData<GovRevenueBatchDSO>()
  }

  ngOnInit() {
    super.ngOnInit()
    this.setPage({ offset: 0 })
  }

  getId(row) {
    return row['batchPk']
  }

  getIdFunction() {
    return this.getId.bind(this)
  }

  setPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }
    // Service Call
    this.governmentRevenueService
      .listPreviousPayments(
        dataTableEvent.offset,
        this.paymentPage.page.pageSize,
      )
      .pipe(take(1))
      .subscribe((result) => {
        if (this.hasError(result)) {
          this.onError(result)
          return
      } else {
          this.paymentPage = result
        }
      })
  }

  selectPreviousPayment(row) {
    this.governmentRevenueService.previousPayment = row
    this.router.navigate(['/government-revenue/payment-from-previous'])
  }

  getAllTables(): any[] {
    return Array.of(this.table)
  }
}
