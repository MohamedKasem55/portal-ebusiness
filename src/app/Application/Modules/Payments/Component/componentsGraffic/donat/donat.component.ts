import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { MonthlyStatisticsService } from '../../../bill/monthly-statistics/monthly-statistics.service'
import { BillerINform } from '../../../Model/inform-bill'

@Component({
  selector: 'app-donat',
  template: `
    dato: {{ datografica }}

    <div style="width:70%; display:block">
      <canvas
        *ngIf="loaded"
        baseChart
        [data]="barChartData"
        [labels]="barChartLabels"
        [options]="barChartOptions"
        [legend]="barChartLegend"
        [chartType]="bar"
        (position)="(doughnutposition)"
        [colors]="colors"
        (chartHover)="chartHovered($event)"
        (chartClick)="chartClicked($event)"
      >
      </canvas>
    </div>
  `,
})
export class DonatComponent implements OnInit {
  @Input() datografica: any
  @Output() change: EventEmitter<number> = new EventEmitter<number>()

  datot: any
  barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,

    legend: {
      display: true,
      position: 'right',
      strokeStyle: 'rgb(0, 0, 0)',
      boxWidth: '134',
      labels: {
        fontColor: 'rgb(0, 0, 0)',
        strokeStyle: 'rgb(0, 0, 0)',
      },
    },
  }
  colors: any = [
    {
      borderColor: '#FBF9F9',
      backgroundColor: [
        '#58D3F7',
        '#9fbfdf',
        '#1f47ae',
        '#81DAF5',
        '#0489B1',
        '#045FB4',
      ],
      pointBackgroundColor: '#FBF9F9',
      pointBorderColor: '#FBF9F9',
    },
  ]

  barChartType = 'doughnut'
  barChartLegend = true
  doughnutposition = 'left'
  dataResult: BillerINform[]
  barChartLabels: any = []
  barChartData: any = []

  loaded = true

  constructor(private datachartservice: MonthlyStatisticsService) {}

  getResultdata() {}

  ngOnInit() {
    this.getResultdata()
  }

  chartClicked($event) {}
  chartHovered($event) {}
}
