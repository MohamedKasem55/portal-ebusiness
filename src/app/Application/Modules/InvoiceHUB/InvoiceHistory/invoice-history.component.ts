import { Component, Injector, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { DateFormatPipe } from '../../../Components/common/Pipes/date-format-pipe'
import {
  searchFormDateFromValidators,
  searchFormDateToValidators,
} from '../common/invoice-hub-searchdate-validators'
import { InvoiceHistoryService } from './invoice-history.service'
import {
  searchFormAmountFromValidator,
  searchFormAmountToValidator,
} from '../common/invoice-hub-amounts-validators'

@Component({
  selector: 'app-invoice-history',
  templateUrl: './invoice-history.component.html',
  styleUrls: ['./invoice-history.component.scss'],
})
export class InvoiceHistoryComponent
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('table', { static: true }) table: any

  invoiceHistorySubscription: Subscription
  invoiceHistory: any = {}
  tableDisplaySize = 20

  searchFilter: any = {}
  searchFilterData: any = {}
  isSearchCollapsed = true

  bsConfig: any

  searchForm: FormGroup

  constructor(
    private service: InvoiceHistoryService,
    public translate: TranslateService,
    public router: Router,
    private injector: Injector,
    private fb: FormBuilder,
  ) {
    super()
    this.searchForm = this.fb.group({
      invoiceNumber: [''],
      supplierName: [''],
      payDateFrom: ['', [searchFormDateFromValidators]],
      payDateTo: ['', [searchFormDateToValidators]],
      amountFrom: ['', [searchFormAmountFromValidator]],
      amountTo: ['', [searchFormAmountToValidator]],
      payerId: [''],
    })
    this.translate.onLangChange.subscribe(
      function (event: LangChangeEvent) {
        for (let i = 0; i < this.invoiceHistory.listHistory.length; i++) {
          this.invoiceHistory.listHistory[i]['note'] =
            this.translate.currentLang === 'en'
              ? this.invoiceHistory.listHistory[i].additionalDetails
              : this.invoiceHistory.listHistory[i].additionalDetailsAr
        }
      }.bind(this),
    )
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    let dateFrom: any
    let dateTo: any
    if (this.searchForm.controls.payDateFrom.value) {
      dateFrom = new Date(this.searchForm.controls.payDateFrom.value)
      dateFrom = new DateFormatPipe(this.injector).transform(
        dateFrom,
        'yyyy-MM-dd',
      )
    }
    if (this.searchForm.controls.payDateTo.value) {
      dateTo = new Date(this.searchForm.controls.payDateTo.value)
      dateTo = new DateFormatPipe(this.injector).transform(dateTo, 'yyyy-MM-dd')
    }

    this.searchFilterData = {
      invoiceNumber: this.searchForm.controls.invoiceNumber.value
        ? this.searchForm.controls.invoiceNumber.value
        : null,
      billerName: this.searchForm.controls.supplierName.value
        ? this.searchForm.controls.supplierName.value
        : null,
      payDateFrom: this.searchForm.controls.payDateFrom.value ? dateFrom : null,
      payDateTo: this.searchForm.controls.payDateTo.value ? dateTo : null,
      amountFrom: this.searchForm.controls.amountFrom.value
        ? this.searchForm.controls.amountFrom.value
        : null,
      amountTo: this.searchForm.controls.amountTo.value
        ? this.searchForm.controls.amountTo.value
        : null,
      page: pageInfo.offset + 1,
      rows: this.tableDisplaySize,
    }
    this.invoiceHistorySubscription = this.service
      .getHistory(this.searchFilterData)
      .subscribe(
        function (result) {
          if (!result.error) {
            this.invoiceHistory.listHistory =
              result.sadadInvoicePagedResults.items
            for (let i = 0; i < this.invoiceHistory.listHistory.length; i++) {
              this.invoiceHistory.listHistory[i]['note'] =
                this.translate.currentLang === 'en'
                  ? this.invoiceHistory.listHistory[i].additionalDetails
                  : this.invoiceHistory.listHistory[i].additionalDetailsAr
            }
            this.invoiceHistory.size = result.sadadInvoicePagedResults.size
            this.invoiceHistory.total = result.sadadInvoicePagedResults.total
          }
          this.invoiceHistorySubscription.unsubscribe()
        }.bind(this),
      )
  }

  searchFilterSubmit() {
    this.setPage(null)
  }

  reset() {
    this.searchForm.reset()
    this.searchFilterSubmit()
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
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
      },
    )
    this.invoiceHistory.listHistory = []
    this.invoiceHistory.size = 0
    this.invoiceHistory.total = 0

    this.setPage(null)
  }

  getStatusTranslateCode(value) {
    return this.service.getStatusTranslateCode(value)
  }

  printForm() {
    //console.log(this.searchForm);
  }
}
