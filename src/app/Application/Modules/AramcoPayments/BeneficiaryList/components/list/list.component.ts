import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../../core/responsive/datatable-mobile.component'
import { AuthenticationService } from '../../../../../../core/security/authentication.service'
import { Exception } from '../../../../../Model/exception'
import { Page } from '../../../../../Model/page'
import { PagedData } from '../../../../../Model/paged-data'
import { BeneficiaryListService } from './../../beneficiary-list.service'

@Component({
  selector: 'app-beneficiary-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('beneficiaryTable', { static: true }) table: any
  @ViewChild('focus_index', { static: true }) focus_index: any

  sharedData: any = {}
  subscriptions: Subscription[] = []

  isCollapsedContent = true
  beneficiaryPage: any

  stepList = 'list'
  stepPayment = 'payment'
  step: string
  errors: any[] = []

  bsConfig: any

  constructor(
    private service: BeneficiaryListService,
    public translate: TranslateService,
    public router: Router,
    public authenticationService: AuthenticationService,
  ) {
    super()

    this.beneficiaryPage = new PagedData<any>()
    this.beneficiaryPage.data = []
    const page = new Page()
    page.pageNumber = 0
    page.pageSize = 20
    this.beneficiaryPage.page = page
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  search() {
    this.setPage(null)
  }

  reset() {
    this.sharedData.searchCriteria = {
      customerId: null,
      customerName: null,
      createDateTo: null,
      createDateFrom: null,
    }
    this.setPage(null)
  }

  setPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }
    this.beneficiaryPage.page.pageNumber = dataTableEvent.offset
    this.sharedData.page = this.beneficiaryPage.page.pageNumber + 1
    this.sharedData.rows = this.beneficiaryPage.page.pageSize
    this.subscriptions.push(
      this.service.list(this.sharedData).subscribe((result) => {
        if (
          result.hasOwnProperty('error') &&
          (<any>result).error instanceof Exception
        ) {
          return
        } else {
          this.sharedData.beneficiaries = result.listBeneficiary
          this.beneficiaryPage.data = result.listBeneficiary.items
          this.beneficiaryPage.page.size = result.listBeneficiary.size
          this.beneficiaryPage.page.totalElements = result.listBeneficiary.total
          if (this.sharedData.tableSelectedRows.length > 0) {
            this.selectRows(this.findInData(this.sharedData.tableSelectedRows))
          }
        }
      }),
    )
  }

  findInData(data) {
    const rows = []
    let selected = false
    for (let i = 0; i < data.length; ++i) {
      selected = false
      for (let j = 0; j < this.beneficiaryPage.data.length; ++j) {
        if (data[i].customerId === this.beneficiaryPage.data[j].customerId) {
          rows.push(this.beneficiaryPage.data[j])
          selected = true
          break
        }
      }
      if (!selected) {
        rows.push(data[i])
      }
    }
    return rows
  }

  selectRows(rows: any[]) {
    this.sharedData.tableSelectedRows.splice(
      0,
      this.sharedData.tableSelectedRows.length,
    )
    this.sharedData.tableSelectedRows.push(...rows)
  }

  onSelect({ selected }) {
    this.sharedData.tableSelectedRows = []
    this.sharedData.tableSelectedRows.splice(0, selected.length)
    this.sharedData.tableSelectedRows.push(...selected)
    return this.sharedData.tableSelectedRows
  }

  ngOnInit(): void {
    super.ngOnInit()
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
      },
    )
    if (this.router.url === '/aramcoPayments/beneficiaries/payment') {
      this.step = this.stepPayment
    } else {
      this.step = this.stepList
    }
    this.search()
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  delete() {
    this.sharedData.deleted = this.sharedData.tableSelectedRows
    this.router.navigate(['/aramcoPayments/beneficiaries/delete'])
  }

  addError() {
    this.errors = []
    if (this.sharedData.tableSelectedRows.length == 0) {
      this.errors.push('error.selectBeneficiary')
      setTimeout(() => {
        this.focus_index.nativeElement.focus()
      }, 200)
      return true
    }
  }

  makePayment() {
    if (this.addError()) {
      return
    }
    this.sharedData.payments = []
    this.sharedData.payments.push(...this.sharedData.tableSelectedRows)
    this.sharedData.paymentBack = this.step
    this.router.navigate(['/aramcoPayments/beneficiaries/new-payment'])
  }

  goDetails(row) {
    this.sharedData.details = row
    this.sharedData.detailsBack = this.step
    this.router.navigate(['/aramcoPayments/beneficiaries/details'])
  }

  getId(row) {
    return row['customerId']
  }

  getIdFunction() {
    return this.getId.bind(this)
  }

  canMakePayment(): boolean {
    return this.authenticationService.activateOption(
      'AramcoPayment',
      ['ARAMCOPAYMENTS_PRIVILEGE'],
      ['AramcoPaymentsGroup'],
    )
  }

  canAddBeneficiary(): boolean {
    /*
    return this.authenticationService.activateOption(
      "AramcoAdminAddBeneficiary",
      ["ARAMCOPAYMENTS_PRIVILEGE"],
      ["CompanyAdmins"]
    );*/
    return false
  }
}
