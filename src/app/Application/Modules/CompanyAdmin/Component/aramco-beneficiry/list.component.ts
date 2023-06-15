import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { AuthenticationService } from '../../../../../core/security/authentication.service'
import { Exception } from '../../../../Model/exception'
import { Page } from '../../../../Model/page'
import { PagedData } from '../../../../Model/paged-data'
import { BeneficiaryListService } from '../../Services/aramco-beneficiary/beneficiary-list.service'
import { SharedDataService } from '../../Services/aramco-beneficiary/shared-data.service'

@Component({
  selector: 'app-aramco-beneficiary-list',
  templateUrl: '../../View/aramco-beneficiary/list.component.html',
})
export class ListComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('beneficiaryTable', { static: true }) table: any

  sharedData: any = {}
  subscriptions: Subscription[] = []

  isCollapsedContent = true
  beneficiaryPage: any

  StepList = 'list'
  StepPayment = 'payment'
  step: any

  bsConfig: any
  selectAllOnPage: any = []

  constructor(
    private service: BeneficiaryListService,
    public translate: TranslateService,
    public router: Router,
    public authenticationService: AuthenticationService,
    public sharedService: SharedDataService,
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
        if (result instanceof Exception) {
          return
        } else {
          this.sharedData.beneficiaries = result.listBeneficiary
          this.beneficiaryPage.data = result.listBeneficiary.items
          this.beneficiaryPage.page.size = result.listBeneficiary.size
          this.beneficiaryPage.page.totalElements = result.listBeneficiary.total
          //console.log('get list', this.sharedData);
          // if (this.sharedData.tableSelectedRows.length > 0) {
          //   this.selectRows(this.findInData(this.sharedData.tableSelectedRows));
          // }
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

  // selectRows(rows: any[]) {
  //   this.sharedData.tableSelectedRows.splice(
  //     0,
  //     this.sharedData.tableSelectedRows.length
  //   );
  //   //console.log('añadir', rows);
  //   this.sharedData.tableSelectedRows.push(...rows);
  // }

  // onSelect({ selected }) {
  //   this.sharedData.tableSelectedRows = [];
  //   //console.log('onselect', selected);
  //   this.sharedData.tableSelectedRows.splice(0, selected.length);
  //   this.sharedData.tableSelectedRows.push(...selected);
  //   return this.sharedData.tableSelectedRows;
  // }

  onSelect({ selected }) {
    // Make sure we are no longer selecting all

    this.selectAllOnPage[this.beneficiaryPage.page.pageNumber] = false

    this.sharedData.tableSelectedRows.splice(
      0,
      this.sharedData.tableSelectedRows.length,
    )
    this.sharedData.tableSelectedRows.push(...selected)
  }

  selectAll(event) {
    if (!this.selectAllOnPage[this.beneficiaryPage.page.pageNumber]) {
      // Unselect all so we dont get duplicates.
      if (this.sharedData.tableSelectedRows.length > 0) {
        this.beneficiaryPage.data.map((beneficiary) => {
          this.sharedData.tableSelectedRows =
            this.sharedData.tableSelectedRows.filter(
              (selected) => this.getId(selected) !== this.getId(beneficiary),
            )
        })
      }
      // Select all again
      this.sharedData.tableSelectedRows.push(...this.beneficiaryPage.data)
      this.selectAllOnPage[this.beneficiaryPage.page.pageNumber] = true
      // console.log('-----------Select All----');
      // console.log(this.tableSelected);
    } else {
      // Unselect all
      this.beneficiaryPage.data.map((beneficiary) => {
        this.sharedData.tableSelectedRows =
          this.sharedData.tableSelectedRows.filter(
            (selected) => this.getId(selected) !== this.getId(beneficiary),
          )
      })
      this.selectAllOnPage[this.beneficiaryPage.page.pageNumber] = false
      // console.log('-----------UnSelect All');
      // console.log(this.tableSelected)
    }
    //   //console.log('Select Event', selected, this.tableSelected);
  }

  ngOnInit(): void {
    super.ngOnInit()
    this.sharedData.searchCriteria = {
      passNumber: null,
      name: null,
      createDateTo: null,
      createDateFrom: null,
    }
    this.sharedData.details = {}

    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
      },
    )
    this.step = this.StepList
    this.search()

    if (
      this.sharedService.getData() &&
      typeof this.sharedService.getData().tableSelectedRows != 'undefined' &&
      this.sharedService.getData().tableSelectedRows.length > 0
    ) {
      this.sharedData.tableSelectedRows =
        this.sharedService.getData().tableSelectedRows
    } else {
      this.sharedData.tableSelectedRows = []
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  delete() {
    this.sharedData.deleted = this.sharedData.tableSelectedRows
    this.sharedService.setData(this.sharedData)
    this.router.navigate(['/companyadmin/aramco/beneficiaryList/delete'])
  }

  goDetails(row) {
    this.sharedData.details = row
    this.sharedData.detailsBack = this.step
    this.sharedService.setData(this.sharedData)
    this.router.navigate(['/companyadmin/aramco/beneficiaryList/details'])
  }

  getId(row) {
    return row['customerId']
  }

  getIdFunction() {
    return this.getId.bind(this)
  }
}
