import {
  Component,
  OnDestroy,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { FormBuilder } from '@angular/forms'
import { FinanceProductDetailsService } from '../finance-product-details.service'
import { DatePipe } from '@angular/common'

const Chart = require('chart.js')

@Component({
  selector: 'current-finance',
  templateUrl: './current-finance.component.html',
  styleUrls: ['./current-finance.component.scss'],
})
export class CurrentFinanceComponent implements OnInit, OnDestroy {
  @Input() data: any
  @Output() showDetails = new EventEmitter<any>()

  public statusChart: any
  public paidAmount = 0

  constructor(
      public fb: FormBuilder,
      public router: Router,
      public translate: TranslateService,
      private detailsService: FinanceProductDetailsService,
      private datePipe: DatePipe,
  ) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    if (this.data.isShowMore) {
      this.getContractDetails()
    }
  }

  getStatus(data) {
    if (data.dossierStatus === 'APS') {
      return 'financeProduct.details.approved'
    } else if(data.dossierStatus === 'RJC') {
      return 'financeProduct.details.rejected'
    }
    else if (data.dossierStatus === 'CLS') {
      return 'financeProduct.details.closed'
    } else {
      return 'financeProduct.details.underApproval'
    }
  }

  isApproved(status) {
    return status === 'APS' || status === 'APD' || status === 'CTD'
  }

  private getContractDetails() {
    this.detailsService
        .getContractDetails(this.data.dossierID)
        .subscribe((result) => {
          this.data.details = result
          this.paidAmount = this.data.details.creditLine.totalAmt - this.data.details.remainingAmt
          this.drawChart()
        })
  }

  drawChart() {
    setTimeout(() => {
      const remainingAmt =
          (this.paidAmount / this.data.details.creditLine.totalAmt) * 100
      const total = 100 - remainingAmt
      const statusChartRef = document.getElementById(
          this.data.dossierID + 'Chart',
      )
      const chartData = {
        // labels: [
        //     this.translate.instant('financeProduct.details.totalFinancedAmount'),
        //     this.translate.instant('financeProduct.details.outstandingAmount'),
        // ],
        datasets: [
          {
            data: [remainingAmt, total],
            backgroundColor: ['rgb(43,68,153)', 'rgb(211,211,211)'],
            hoverOffset: 4,
            borderWidth: [0, 0, 0, 0],
          },
        ],
      }

      const options = {
        cutoutPercentage: 80,
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
      }

      this.statusChart = new Chart(statusChartRef, {
        type: 'doughnut',
        data: chartData,
        options: options,
      })
    }, 500)
  }

  showMore() {
    this.data.isShowMore = !this.data.isShowMore
    if (this.data.isShowMore) {
      if (!this.data.details) {
        this.getContractDetails()
      } else {
        this.drawChart()
      }
    }
  }

  viewInstallmentsDetails() {
    this.showDetails.emit(this.data.dossierID)
  }

  getDate(date) {
    if (date?.timestamp && date.timestamp != "null") {
      return this.datePipe.transform(new Date(date.timestamp), 'dd/MM/yyyy')
    } else {
      return ''
    }
  }
}
