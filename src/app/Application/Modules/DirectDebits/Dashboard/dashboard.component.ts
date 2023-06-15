import { DatePipe } from '@angular/common'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import {
  DashboardService,
  FileList,
  RequestGetDashboardDirectDebits,
  ResponseGetDashboardDirectDebits,
} from './dashboard.service'
import { Subscription } from 'rxjs'

const Chart = require('chart.js')

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  fromDate = new Date()
  toDate = new Date()
  today: Date = new Date()

  bsConfig: any

  // Bar chart
  amountChart: any
  countChart: any

  subscriptions: Subscription[] = []

  constructor(
    public _service: DashboardService,
    private datePipe: DatePipe,
    private translateService: TranslateService,
  ) {
    this.fromDate = new Date()
    this.toDate = new Date()
    this.fromDate.setFullYear(this.fromDate.getFullYear() - 1)
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        dateInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-dark-blue',
      },
    )
  }

  public ngOnInit() {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.generateDashBoard()
    })

    this.generateDashBoard()
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  generateDashBoard() {
    this.getDashboard(this.fromDate, this.toDate)
  }

  getDashboard(fdate: Date, tdate: Date) {
    const fromdate = this.datePipe.transform(fdate, 'yyyy-MM-ddTHH:mm:ss')
    const todate = this.datePipe.transform(tdate, 'yyyy-MM-ddTHH:mm:ss')

    const body: RequestGetDashboardDirectDebits = {
      paymentDateFrom: fromdate + '.715Z',
      paymentDateTo: todate + '.715Z',
      search: true,
    }

    let months: string[] = []
    const localRecordAmount: number[] = []
    const rajhiRecordAmount: number[] = []
    const localRecordCount: number[] = []
    const rajhiRecordCount: number[] = []

    this._service
      .getDashboard(body)
      .subscribe((response: ResponseGetDashboardDirectDebits) => {
        response.fileList.forEach((file: FileList) => {
          localRecordAmount.push(file.localRecordAmount)
          rajhiRecordAmount.push(file.rajhiRecordAmount)
          localRecordCount.push(file.localRecordCount)
          rajhiRecordCount.push(file.rajhiRecordCount)
        })

        months = response.months
        this.getChartAmount(
          this.getTranslatedMonths(months),
          localRecordAmount,
          rajhiRecordAmount,
        )
        this.getChartCount(
          this.getTranslatedMonths(months),
          localRecordCount,
          rajhiRecordCount,
        )
      })
  }

  getTranslatedMonths(months: string[]) {
    const tMonths = []
    const iMonths = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]

    months.forEach((month) => {
      let tMonth = month.toLowerCase()
      iMonths.forEach((iMonth) => {
        tMonth = tMonth.replace(
          iMonth.toLowerCase(),
          this.translateService.instant(
            'public.months.' + iMonth.toLowerCase(),
          ),
        )
      })
      tMonths.push(tMonth)
    })
    return tMonths
  }

  getChartAmount(
    months: string[],
    localAmount: number[],
    rajhiAmount: number[],
  ) {
    const amountChartRef = document.getElementById('amountChart')
    const _rtl =
      this.translateService.currentLang != 'undefined' &&
      this.translateService.currentLang != null &&
      this.translateService.currentLang != 'en'
        ? false
        : true

    const alrajhi = {
      label: 'Al Rajhi',
      data: rajhiAmount,
      backgroundColor: 'rgba(255, 128, 0, 1)',
    }

    const local = {
      label: 'Local',
      data: localAmount,
      backgroundColor: 'rgba(0, 0, 255, 1)',
    }

    const amountData = {
      labels: months,
      datasets: [alrajhi, local],
    }

    const amountOptions = {
      rtl: _rtl,
      title: {
        display: true,
        text: 'Amount',
      },
      scales: {
        yAxes: [
          {
            display: true,
            labelString: 'Amount of payments',
            ticks: {
              // Include a dollar sign in the ticks
              callback(value, index, values) {
                return value + ' SAR'
              },
            },
          },
        ],
      },
    }

    this.amountChart = new Chart(amountChartRef, {
      type: 'bar',
      data: amountData,
      options: amountOptions,
      responsive: true,
    })
  }

  getChartCount(months: string[], localCount: number[], rajhiCount: number[]) {
    const countChartRef = document.getElementById('countChart')
    const _rtl =
      this.translateService.currentLang != 'undefined' &&
      this.translateService.currentLang != null &&
      this.translateService.currentLang != 'en'
        ? false
        : true

    const alrajhi = {
      label: 'Al Rajhi',
      data: rajhiCount,
      backgroundColor: 'rgba(255, 128, 0, 1)',
    }

    const local = {
      label: 'Local',
      data: localCount,
      backgroundColor: 'rgba(0, 0, 255, 1)',
    }

    const countData = {
      labels: months,
      datasets: [alrajhi, local],
    }

    const countOptions = {
      rtl: _rtl,
      title: {
        display: true,
        text: 'Count',
      },
      scales: {
        yAxes: [
          {
            display: true,
            labelString: '# of payments',
            ticks: {
              // Include a dollar sign in the ticks
              callback(value, index, values) {
                return value
              },
            },
          },
        ],
      },
    }

    this.countChart = new Chart(countChartRef, {
      type: 'bar',
      data: countData,
      options: countOptions,
      responsive: true,
    })
  }

  getMaxDate() {
    return this.toDate ? this.toDate : this.today
  }
}
