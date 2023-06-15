import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../../core/responsive/datatable-mobile.component'
import { Exception } from '../../../../../Model/exception'
import { Page } from '../../../../../Model/page'
import { PagedData } from '../../../../../Model/paged-data'
import { MultiPaymentService } from '../../multi-payment.service'

@Component({
  templateUrl: './step2.component.html',
})
export class Step2Component
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('invoiceTable', { static: true }) table: any

  step = 2
  sharedData: any = {}
  accounts = []

  subscriptions: Subscription[] = []
  isCollapsedContent = true
  bsConfig: any
  account = ''
  totalAmount = 0
  invoicePage: any

  constructor(
    private service: MultiPaymentService,
    public translate: TranslateService,
  ) {
    super()
    this.invoicePage = new PagedData<any>()
    this.invoicePage.data = []
    const page = new Page()
    page.pageNumber = 0
    page.pageSize = 50
    this.invoicePage.page = page
    this.sharedData.tableSelectedRows = []
  }
  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }
  ngOnInit(): void {
    super.ngOnInit()
    if (!this.sharedData['selectedByPage']) {
      this.sharedData['selectedByPage'] = {}
    }
    if (
      !this.sharedData.selectedAccount &&
      this.sharedData.accounts.length == 1
    ) {
      this.sharedData.selectedAccount = this.sharedData.accounts[0].key
    } else if (!this.sharedData.selectedAccount) {
      this.sharedData.selectedAccount = ''
    }
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
      },
    )
    //this.setPage(null);
    this.invoicePage.data = this.sharedData['listBatch'].items
    for (let i = 0; i < this.invoicePage.data.length; i++) {
      this.invoicePage.data[i]['note'] =
        this.translate.currentLang === 'en'
          ? this.invoicePage.data[i].additionalDetails
          : this.invoicePage.data[i].additionalDetailsAr
    }
    this.invoicePage.page.totalElements = this.sharedData['listBatch'].total
    this.invoicePage.page.size = this.sharedData['listBatch'].size
    for (let i = 0; i < this.sharedData['listBatch'].items.length; ++i) {
      this.sharedData['listBatch'].items[i].amountPayment =
        this.sharedData['listBatch'].items[i].amountDue
      this.sharedData['listBatch'].items[i].errors = { error: false }
    }
    if (
      this.sharedData['selectedByPage'][this.invoicePage.page.pageNumber]
        .length > 0
    ) {
      this.selectRows(
        this.findInData(
          this.sharedData['selectedByPage'][this.invoicePage.page.pageNumber],
        ),
      )
    }
    this.translate.onLangChange.subscribe(
      function (event: LangChangeEvent) {
        for (
          let j = 0;
          j < this.sharedData.tableSelectedRows.length.length;
          j++
        ) {
          this.invoicePage.data[j]['note'] =
            this.translate.currentLang === 'en'
              ? this.invoicePage.data[j].additionalDetails
              : this.invoicePage.data[j].additionalDetailsAr
        }
      }.bind(this),
    )
  }

  getId(row) {
    return row['invoiceId']
  }

  getIdFunction() {
    return this.getId.bind(this)
  }

  search() {
    this.sharedData['isSearchError'] = !this.validSearch()
    if (this.sharedData['isSearchError']) {
      return
    }

    this.setPage(null)
  }

  reset() {
    this.sharedData.searchCriteria = {
      supplierName: null,
      dateTo: null,
      dateFrom: null,
      amountFrom: null,
      amountTo: null,
    }
    this.sharedData['isSearchError'] = false
    this.setPage(null)
  }

  validSearch() {
    if (
      this.sharedData.searchCriteria.amountFrom == '' ||
      this.sharedData.searchCriteria.amountFrom == null ||
      this.sharedData.searchCriteria.amountTo == '' ||
      this.sharedData.searchCriteria.amountTo == null
    ) {
      return true
    }
    return (
      +this.sharedData.searchCriteria.amountFrom <=
      +this.sharedData.searchCriteria.amountTo
    )
  }

  setPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }

    this.invoicePage.page.pageNumber = dataTableEvent.offset
    this.sharedData.page = this.invoicePage.page.pageNumber + 1
    this.sharedData.rows = this.invoicePage.page.pageSize
    if (!this.sharedData['selectedByPage'][this.invoicePage.page.pageNumber]) {
      this.sharedData['selectedByPage'][this.invoicePage.page.pageNumber] = []
    }
    //console.log('setPage',this.selectedByPage[this.invoicePage.page.pageNumber]);
    this.subscriptions.push(
      this.service.list(this.sharedData).subscribe((result) => {
        if (
          result.hasOwnProperty('errorCode') &&
          <any>result instanceof Exception
        ) {
          this.resetList()
          return
        } else {
          this.sharedData['listBatch'] = result.listBatch
          this.invoicePage.data = this.sharedData['listBatch'].items
          for (let i = 0; i < this.invoicePage.data.length; i++) {
            this.invoicePage.data[i]['note'] =
              this.translate.currentLang === 'en'
                ? this.invoicePage.data[i].additionalDetails
                : this.invoicePage.data[i].additionalDetailsAr
          }
          this.invoicePage.page.totalElements =
            this.sharedData['listBatch'].total
          this.invoicePage.page.size = this.sharedData['listBatch'].size
          for (let i = 0; i < this.sharedData['listBatch'].items.length; ++i) {
            this.sharedData['listBatch'].items[i].amountPayment =
              this.sharedData['listBatch'].items[i].amountDue
            this.sharedData['listBatch'].items[i].errors = { error: false }
          }
          if (
            this.sharedData['selectedByPage'][this.invoicePage.page.pageNumber]
              .length > 0
          ) {
            this.selectRows(
              this.findInData(
                this.sharedData['selectedByPage'][
                  this.invoicePage.page.pageNumber
                ],
              ),
            )
          }
          //  this.sharedData['errors']
        }
      }),
    )
  }

  findInData(data) {
    const rows = []
    let selected = false
    for (let i = 0; i < data.length; ++i) {
      selected = false
      for (let j = 0; j < this.invoicePage.data.length; ++j) {
        if (
          data[i].invoiceId === this.invoicePage.data[j].invoiceId &&
          data[i].dateDue === this.invoicePage.data[j].dateDue
        ) {
          this.invoicePage.data[j].amountPayment = data[i].amountPayment
          rows.push(this.invoicePage.data[j])
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
    this.sharedData['selectedByPage'][this.invoicePage.page.pageNumber] = rows
    this.onSelect({ selected: rows })
    //this.sharedData.tableSelectedRows.splice(0,this.sharedData.tableSelectedRows.length);
    //this.sharedData.tableSelectedRows.push(...rows);
  }

  getSelectedSetByPage() {
    if (!this.sharedData['selectedByPage'][this.invoicePage.page.pageNumber]) {
      this.sharedData['selectedByPage'][this.invoicePage.page.pageNumber] = []
    }
    return this.sharedData['selectedByPage'][this.invoicePage.page.pageNumber]
  }

  getSelectedByPage(selected) {
    //console.log(this.invoicePage.page.pageNumber,selected);
    this.sharedData['selectedByPage'][this.invoicePage.page.pageNumber] =
      selected
    //console.log(this.selectedByPage);
    const select = []
    for (
      let i = 0;
      i < Object.keys(this.sharedData['selectedByPage']).length;
      ++i
    ) {
      select.push(
        ...this.sharedData['selectedByPage'][
          Object.keys(this.sharedData['selectedByPage'])[i]
        ],
      )
    }
    //console.log(select);
    return select
  }

  onSelect({ selected }) {
    if (selected) {
      //console.log('on select',selected);
      const newSelected = this.getSelectedByPage(selected)
      if (newSelected) {
        this.sharedData.tableSelectedRows = []
        //
        this.sharedData.tableSelectedRows.splice(0, newSelected.length)
        this.sharedData.tableSelectedRows.push(...newSelected)
      }
      this.totalAmount = 0
      for (const data of this.sharedData.tableSelectedRows) {
        if (data.amountPayment) {
          this.totalAmount += parseFloat(data.amountPayment)
        }
      }
      this.sharedData.totalAmount = this.totalAmount
      this.sharedData.totalSelected = this.sharedData.tableSelectedRows.length
    }
  }

  updateRowPayment(event, row, rowIndex) {
    this.invoicePage.data[rowIndex]['amountPayment'] = event.target.value
    this.amountChanged()
  }

  amountChanged() {
    //console.log(this.selectedByPage[this.invoicePage.page.pageNumber]);
    this.totalAmount = 0
    for (const data of this.sharedData.tableSelectedRows) {
      //console.log('add amount',data);
      if (data.amountPayment) {
        this.totalAmount += parseFloat(data.amountPayment)
      }
    }
    //console.log(this.totalAmount);
    this.sharedData.totalAmount = this.totalAmount
    this.sharedData.totalSelected = this.sharedData.tableSelectedRows.length
  }

  valid() {
    return (
      (this.sharedData.selectedAccount ||
        this.sharedData.selectedAccount == 0) &&
      this.sharedData.tableSelectedRows.length > 0 &&
      !this.errorsAmountPayment(this.sharedData.tableSelectedRows)
    )
  }

  errorsAmountPayment(data) {
    let error = false
    for (let i = 0; i < data.length; ++i) {
      error = error || this.checkError(data[i], i)
    }
    return error
  }

  checkError(data, index) {
    let error = false
    delete data['errors']['lte']
    delete data['errors']['gt']
    delete data['errors']['required']
    const limitFrom =
      data['amountDue'] < parseFloat(data['amountRangeFrom'])
        ? data['amountDue']
        : parseFloat(data['amountRangeFrom'])
    if (parseFloat(data.amountPayment) < limitFrom && limitFrom != 0.0) {
      error = true
      //data['errors']['error'] = true;
      data['errors']['gt'] = true
    }
    if (
      parseFloat(data.amountPayment) > parseFloat(data['amountRangeTo']) &&
      limitFrom != 0.0
    ) {
      error = true
      //data['errors']['error'] = true;
      data['errors']['lte'] = true
    }
    if (!data.amountPayment) {
      error = true

      //data['errors']['error'] = true;
      data['errors']['required'] = true
    }
    data['errors']['error'] = error
    return error
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  resetList() {
    this.invoicePage = new PagedData<any>()
    this.invoicePage.data = []
    const page = new Page()
    page.pageNumber = 0
    page.pageSize = 50
    this.invoicePage.page = page
    this.sharedData.tableSelectedRows = []
  }
}
