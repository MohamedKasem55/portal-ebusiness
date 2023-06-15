import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { Exception } from 'app/Application/Model/exception'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { StorageService } from '../../../../core/storage/storage.service'
import { Page } from '../../../Model/page'
import { PagedData } from '../../../Model/paged-data'
import { SelectedDataService } from '../../Accounts/Services/selected-data-service'
import { StaticService } from '../../Common/Services/static.service'
import { ManagePayerService } from '../ManagePayer/manage-payer.service'
import { DirectDebitsPaymentsService } from './direct-debits-payments.service'

const moment = require('moment-hijri')

@Component({
  selector: 'app-direct-debits-payments-step1',
  templateUrl: './direct-debits-payments-step1.component.html',
  styleUrls: ['./direct-debits-payments.component.scss'],
})
export class DirectDebitsPaymentsStep1Component
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('elementsPageTable', { static: true }) table: any

  @Input() form: FormGroup
  @Input() tableSelectedRows: any
  @Input() bank: any = []
  @Output() onInit = new EventEmitter<Component>()

  elementPage: PagedData<any>
  private order: string
  private orderType: string

  bsConfig: any

  isCollapsedContent = true
  searchForm: FormGroup
  searchFormData: any
  mensajeError: any = {}
  subscriptions: Subscription[] = []

  combosSolicitados: string[] = ['payrollBankCode']
  selectAllOnPage: any = []

  constructor(
    private fb: FormBuilder,
    public service: DirectDebitsPaymentsService,
    public serviceElement: ManagePayerService,
    public storageService: StorageService,
    public staticService: StaticService,
    public translate: TranslateService,
    public router: Router,
    public sharedAccountData: SelectedDataService,
  ) {
    super()

    this.searchForm = this.fb.group({
      mandateNumber: [''],
      payerName: [''],
      bank: [''],
      payerAccount: [''],
      amountFrom: [''],
      amountTo: [''],
    })

    this.elementPage = new PagedData<any>()
    this.elementPage.data = []
    const page = new Page()
    page.pageNumber = 0
    page.pageSize = 50
    this.elementPage.page = page
    this.order = 'employeeReference'
    this.orderType = 'desc'
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  ngOnInit() {
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
    this.searchFormData = Object.assign({}, this.searchForm.value)
    this.refreshData()
    this.subscriptions.push(
      this.translate.onLangChange.subscribe(
        function (event: LangChangeEvent) {
          this.refreshData()
        }.bind(this),
      ),
    )

    this.setPage(null)

    const user = JSON.parse(this.storageService.retrieve('currentUser'))
    this.form.controls.customerCIC.setValue(user.company.profileNumber)
    this.form.controls.organizationName.setValue(user.company.companyName)

    this.onInit.emit(this as Component)
  }

  refreshData() {
    this.subscriptions.push(
      this.staticService
        .getAllCombos(this.combosSolicitados)
        .subscribe((result) => {
          const data: Object[] = result
          const banks =
            data[this.combosSolicitados.indexOf('payrollBankCode')]['values']
          Object.keys(banks).map((key, index) => {
            if (!(key === 'order')) {
              this.bank.push({ key, value: banks[key] })
            }
          })
        }),
    )
  }

  findUser(users) {
    const rows = []
    let selected = false
    //console.log(users);
    //console.log(this.elementPage.data);
    for (let i = 0; i < users.length; ++i) {
      selected = false
      for (let j = 0; j < this.elementPage.data.length; ++j) {
        if (users[i].mandate === this.elementPage.data[j].mandate) {
          rows.push(this.elementPage.data[j])
          selected = true
          break
        }
      }
      if (!selected) {
        rows.push(users[i])
      }
    }
    return rows
  }

  selectRows(rows: any[]) {
    this.tableSelectedRows.splice(0, this.tableSelectedRows.length)
    this.tableSelectedRows.push(...rows)
  }

  search() {
    this.searchFormData = Object.assign({}, this.searchForm.value)
    this.subscriptions.push(
      this.serviceElement
        .getList(
          this.searchFormData,
          this.elementPage.page.pageNumber,
          this.elementPage.page.pageSize,
          true,
        )
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            this.elementPage.page = result.page
            this.elementPage.data = result.data
          }
        }),
    )
  }

  reset() {
    this.searchForm.reset()
    this.searchFormData = Object.assign({}, this.searchForm.value)
    this.subscriptions.push(
      this.serviceElement
        .getList(
          this.searchFormData,
          this.elementPage.page.pageNumber,
          this.elementPage.page.pageSize,
          false,
        )
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            this.elementPage.page = result.page
            this.elementPage.data = result.data
            this.elementPage.page.pageNumber = this.elementPage.page.pageNumber
          }
        }),
    )
  }

  setPage(dataTableEvent) {
    let search = true
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
      search = false
    }

    this.elementPage.page.pageNumber = dataTableEvent.offset
    this.subscriptions.push(
      this.serviceElement
        .getList(
          this.searchFormData,
          this.elementPage.page.pageNumber + 1,
          this.elementPage.page.pageSize,
          search,
        )
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            this.elementPage.page = result.page
            this.elementPage.data = result.data

            if (this.tableSelectedRows.length > 0) {
              this.selectRows(this.findUser(this.tableSelectedRows))
            }
          }
        }),
    )
  }

  setSort(dataTableEvent) {
    //console.log(dataTableEvent);
    if (dataTableEvent.sorts[0]) {
      this.order = dataTableEvent.sorts[0].prop
      this.orderType = dataTableEvent.sorts[0].dir
    }

    this.elementPage.page.pageNumber = 1

    this.subscriptions.push(
      this.serviceElement
        .getList(
          this.searchFormData,
          this.elementPage.page.pageNumber + 1,
          this.elementPage.page.pageSize,
          true,
        )
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            this.elementPage.page = result.page
            this.elementPage.data = result.data
          }
        }),
    )
  }

  onSelect({ selected }) {
    // Make sure we are no longer selecting all
    //console.log('---select one---');
    if (typeof selected != 'undefined') {
      this.selectAllOnPage[this.elementPage.page.pageNumber] = false

      this.tableSelectedRows.splice(0, this.tableSelectedRows.length)
      this.tableSelectedRows.push(...selected)
    }
  }

  selectAll(event) {
    if (!this.selectAllOnPage[this.elementPage.page.pageNumber]) {
      // Unselect all so we dont get duplicates.
      if (this.tableSelectedRows.length > 0) {
        this.elementPage.data.map((directDebit) => {
          this.tableSelectedRows = this.tableSelectedRows.filter(
            (selected) => this.getId(selected) !== this.getId(directDebit),
          )
        })
      }
      // Select all again
      this.tableSelectedRows.push(...this.elementPage.data)
      this.selectAllOnPage[this.elementPage.page.pageNumber] = true
      //console.log('-----------Select All----');
      //console.log(this.tableSelected);
    } else {
      // Unselect all
      this.elementPage.data.map((directDebit) => {
        this.tableSelectedRows = this.tableSelectedRows.filter(
          (selected) => this.getId(selected) !== this.getId(directDebit),
        )
      })
      this.selectAllOnPage[this.elementPage.page.pageNumber] = false
      //console.log('-----------UnSelect All');
      //console.log(this.tableSelected)
    }
  }

  isSelected(directDebit) {
    const data = this.tableSelectedRows.find(
      (selected) => this.getId(selected) === this.getId(directDebit),
    )
    if (data === null || typeof data == 'undefined') {
      return false
    } else {
      return true
    }
  }
  getIdFunction() {
    return this.getId.bind(this)
  }

  getId(row) {
    return row['companyCustomerPk']
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  onError(error: any) {
    const res = error
    //console.log(res.error);
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }

  updateTableValue(event, cell, cellValue, row, rowIndex) {
    this.elementPage.data[rowIndex][cell] = event.target.value
  }
}
