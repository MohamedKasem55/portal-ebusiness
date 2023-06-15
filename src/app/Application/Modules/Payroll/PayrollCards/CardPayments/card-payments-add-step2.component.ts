import { Component, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { Page } from '../../../../Model/page'
import { PagedData } from '../../../../Model/paged-data'
import { PayrollCardsService } from '../payroll-cards.service'

@Component({
  selector: 'app-card-payments-add-step2',
  templateUrl: './card-payments-add-step2.component.html',
  styleUrls: ['./card-payments.component.scss'],
})
export class AddCardPaymentsStep2Component
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('payrollCardPageTable', { static: true }) table: any
  payrollCardPage: PagedData<any>
  tableSelectedRows: any = []

  mockData = []
  layout: any
  constructor(
    public translate: TranslateService,
    private serviceshare: PayrollCardsService,
  ) {
    super()
    this.payrollCardPage = new PagedData<any>()
    this.payrollCardPage.data = this.mockData
    const page = new Page()
    page.pageNumber = 1
    page.pageSize = 20
    page.totalElements = 2
    page.totalPages = 2 / 20
    page.size = 2
    this.payrollCardPage.page = page
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }
  ngOnInit() {
    super.ngOnInit()
    this.serviceshare.getInstitution().subscribe((result) => {
      if (!result.error) {
        this.layout = result.institutionDTO.layout
      }
    })
  }

  setPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }
    this.payrollCardPage.data = this.mockData
    const page = new Page()
    page.pageNumber = 1
    page.pageSize = 20
    page.totalElements = 2
    page.totalPages = 2 / 20
    page.size = 2
    this.payrollCardPage.page = page
  }

  setSort(dataTableEvent) {
    this.payrollCardPage.data = this.mockData
    const page = new Page()
    page.pageNumber = 1
    page.pageSize = 20
    page.totalElements = 2
    page.totalPages = 2 / 20
    page.size = 2
    this.payrollCardPage.page = page
  }

  onSelect({ selected }) {
    this.tableSelectedRows = []
    this.tableSelectedRows.splice(0, selected.length)
    this.tableSelectedRows.push(...selected)
    return this.tableSelectedRows
  }
}
