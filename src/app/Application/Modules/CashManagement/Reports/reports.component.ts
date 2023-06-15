import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { TranslateService } from '@ngx-translate/core'
import { AuthenticationService } from 'app/core/security/authentication.service'
import { interval } from 'rxjs'
import { AbstractDatatableMobileComponent } from '../../Common/Components/Abstract/abstract-datatable-mobile.component'
import { StaticService } from '../../Common/Services/static.service'
import { ReportsService } from './reports.service'

@UntilDestroy()
@Component({
  selector: 'app-cash-management-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent
  extends AbstractDatatableMobileComponent
  implements OnInit, OnDestroy
{
  combosData: any = {}

  bsConfig: any
  today = new Date()

  constructor(
    public fb: FormBuilder,
    public service: ReportsService,
    public staticService: StaticService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
  ) {
    super(fb, translate, authenticationService, router)
    this.order = ''
    this.orderType = 'desc'
    this.searchForm = this.fb.group({
      dateFrom: [],
      dateTo: [],
      reportType: [],
    })

    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
        isAnimated: true,
      },
    )
  }

  getTodayDate(): Date {
    return this.today
  }

  getMinDate(): Date {
    return this.searchForm.get('dateFrom').value
      ? this.searchForm.get('dateFrom').value
      : null
  }

  getMaxDate(): Date {
    return this.searchForm.get('dateTo').value
      ? this.searchForm.get('dateTo').value
      : this.getTodayDate()
  }

  ngOnInit() {
    super.ngOnInit()

    const combosKeys = ['currency', 'currencyIso']

    this.subscriptions.push(
      this.staticService
        .getAllCombosAsArrays(combosKeys, true)
        .subscribe((resultC) => {
          if (resultC === null) {
            this.onError(resultC)
          } else {
            const data: Object = resultC
            for (let i = 0; i < combosKeys.length; i++) {
              this.combosData[combosKeys[i]] = data[combosKeys[i]]
            }
            this.search()
          }
        }),
    )

    interval(1000).pipe(untilDestroyed(this)).subscribe()
  }

  getList(searchElement, order, orderType, offset, pageSize) {
    let stdDateFrom: string = null
    let stdDateTo: string = null

    if (this.searchForm.get('reportType').value !== 0) {
      if (this.searchForm.get('dateFrom').value !== null) {
        stdDateFrom = `${this.searchForm.get('dateFrom').value.getFullYear()}-${
          this.searchForm.get('dateFrom').value.getMonth() + 1
        }-${this.searchForm.get('dateFrom').value.getDate()}`
      }
      if (this.searchForm.get('dateTo').value !== null) {
        stdDateTo = `${this.searchForm.get('dateTo').value.getFullYear()}-${
          this.searchForm.get('dateTo').value.getMonth() + 1
        }-${this.searchForm.get('dateTo').value.getDate()}`
      }
    }
    const searchCriteria = {
      reportType: searchElement.reportType,
      dateFrom: stdDateFrom,
      dateTo: stdDateTo,
    }

    this.subscriptions.push(
      this.service
        .getResults(searchCriteria, order, orderType, offset, pageSize)
        .subscribe((result) => {
          if (result === null) {
            this.onError(result)
          } else {
            this.elementsPage = result
          }
        }),
    )
  }

  public clickToDownload(event): void {
    this.service.getDownloableReport(event).subscribe((x) => {
      const downloadUrl = URL.createObjectURL(x)
      const link = document.createElement('a')
      link.download = event
      link.href = downloadUrl
      document.body.appendChild(link)
      link.click()
    })
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  getId(row) {
    return row['fileName']
  }

  reset() {
    this.searchForm.get('reportType').setValue(0)
    this.searchForm.controls.dateFrom.reset()
    this.searchForm.controls.dateTo.reset()
    this.search()
  }

  refreshData() {}

  // if external paging is false -----------------------------

  search() {
    this.searchFormData = Object.assign({}, this.searchForm.value)
    this.getList(
      this.searchFormData,
      this.order,
      this.orderType,
      1,
      this.elementsPage.page.pageSize,
    )
  }

  setPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }
    this.elementsPage.page.pageNumber = dataTableEvent.offset
    this.searchFormData = Object.assign({}, this.searchForm.value)
    //this.getList(this.searchFormData, this.order, this.orderType, dataTableEvent.offset + 1, this.elementsPage.page.pageSize);
  }

  setPageSize(event: any) {
    this.elementsPage.page.pageSize = +event.target.value
    this.table.offset = 0
    this.table.recalculate()
  }

  // ----------------------------------------------------------
}
