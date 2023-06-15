import { Component, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { DatatableMobileComponent } from 'app/core/responsive/datatable-mobile.component'
import { StorageService } from 'app/core/storage/storage.service'
import { BaseChartDirective } from 'ng2-charts'
import { Subscription } from 'rxjs'
import { GraphicsService } from './graphics.service'

@Component({
  selector: 'app-graphics',
  templateUrl: './graphics.component.html',
  styleUrls: ['./graphics.component.css'],
})
export class GraphicsComponent
  extends DatatableMobileComponent
  implements OnInit
{
  sharedVar: string
  length = 0
  loaded = true
  dato: any = 0
  Monthly: any
  FormMonth: FormGroup
  selectedValue = 'select'
  totalAmount: any = 0
  loadedBar = false
  loadedDoughnut = false

  public datep = ''

  public currentUser: any
  tableData: any = {}

  chart: any
  sub: Subscription
  @ViewChild(BaseChartDirective) chartWidget: any
  lineChartData: Array<any>
  lineChartLabels: Array<any>
  lineChartOptions: any = {
    scaleShowVerticalLines: false,
    animation: false,
    responsive: false,
    tooltips: {
      callbacks: {
        label(tooltipItem, data) {
          let label = data.datasets[tooltipItem.datasetIndex].label || ''

          if (label) {
            label += ': '
          }
          // label += Math.round(tooltipItem.yLabel * 100) / 100;
          let amount = tooltipItem.yLabel.toString()
          amount = amount.split(/(?=(?:...)*$)/)
          amount = amount.join(',')
          label += amount + '.00 SAR'
          return label
        },
      },
    },
    scales: {
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'Amount',
          },
          ticks: {
            beginAtZero: true,
            userCallback(value) {
              // Convert the number to a string and splite the string every 3 charaters from the end
              value = value.toString()
              value = value.split(/(?=(?:...)*$)/)

              // Convert the array to a string and format the output
              value = value.join(',')
              return value + '.00' + ' SAR'
            },
          },
        },
      ],
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'Supplier',
          },
        },
      ],
    },
  }
  lineChartColors: Array<any> = [
    {
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)',
    },
  ]
  lineChartLegend = false
  lineChartType = 'bar'

  /*doughnut*/
  doughnutChartData: Array<any>
  dataResult: any
  doughnutChartLabels: any
  doughnutChartType = 'doughnut'
  colors: any = [
    {
      borderColor: '#FBF9F9',
      backgroundColor: [
        'rgba(63, 63, 255, 0.4)',
        'rgba(54, 162, 235, 0.4)',
        ' rgba(68, 108, 207, 1.0)',
        'rgba(0, 127, 255, 0.4)',
        'rgba(0, 0, 255, 0.4)',
        'rgba(0, 237, 255, 0.4)',
        'rgba(0, 178, 255, 0.4)',
        '#045FB4',
      ],
      pointBackgroundColor: '#FBF9F9',
      pointBorderColor: '#FBF9F9',
    },
  ]
  DonutChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    tooltips: {
      callbacks: {
        label(tooltipItem, data) {
          let label = data.datasets[tooltipItem.datasetIndex].label || ''

          if (label) {
            label += ': '
          }
          // label += Math.round(tooltipItem.yLabel * 100) / 100;
          let amount =
            data.datasets[tooltipItem.datasetIndex].data[
              tooltipItem.index
            ].toString()
          amount = amount.split(/(?=(?:...)*$)/)
          amount = amount.join(',')
          label += amount + '.00 SAR'
          return label
        },
      },
    },
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
    legendCallback(_chart) {
      const text = []
      text.push('<div>')
      for (let i = 0; i < _chart.data.datasets.length; i++) {
        text.push('<li><span style="background-color:#333">')
        text.push(_chart.data.datasets[i].label)
        text.push('</span></li>')
      }
      text.push('</div>')
      return text.join('')
    },
  }

  constructor(
    private fb: FormBuilder,
    private storageService: StorageService,
    private datachartservice: GraphicsService,
  ) {
    super()
  }

  getResultdata() {
    this.datachartservice.getMonthsDate().subscribe((result) => {
      if (result === null) {
        ////console.log("error-->"+result);
      } else {
        this.Monthly = result
        ////console.log("aqui vamos-->"+this.Monthly);
      }
    })
  }

  buildForm(): void {
    this.FormMonth = this.fb.group({
      Monthly: ['', Validators.required],
    })
  }

  forceChartRefresh() {
    setTimeout(() => {
      this.chartWidget.refresh()
    }, 10)
  }

  ngOnInit(): void {
    super.ngOnInit()
    this.buildForm()
    this.currentUser = JSON.parse(this.storageService.retrieve('currentUser'))
    this.getResultdata()
  }

  getResultdatabarra(value) {
    this.totalAmount = 0
    this.sub = this.datachartservice
      .getInformBill(value)
      .subscribe((stats: any) => {
        this.lineChartLabels = new Array()
        this.lineChartData = new Array()
        const data2 = new Array()
        this.lineChartData.length = 0
        this.lineChartLabels.length = 0
        data2.length = 0
        stats.forEach((stat: any) => {
          data2.push(stat.amountPaid)
          this.totalAmount = this.totalAmount + stat.amountPaid

          this.lineChartLabels.push(stat.supplierName)
        })

        this.tableData = stats
        this.lineChartData.push({ data: data2, label: 'Amount Paid' })
        this.loadedBar = true
        this.forceChartRefresh()
      })
  }

  getResultdataDonut(value) {
    this.sub = this.datachartservice
      .getInformBill(value)
      .subscribe((stats: any) => {
        this.doughnutChartData = new Array()
        this.doughnutChartLabels = new Array()
        const data3 = new Array()
        this.doughnutChartData.length = 0
        this.doughnutChartLabels.length = 0
        data3.length = 0
        stats.forEach((stat: any) => {
          data3.push(stat.amountPaid)
          this.doughnutChartLabels.push(stat.supplierName)
        })
        this.doughnutChartData.push({ data: data3, label: 'Amount Paid' })
        this.loadedDoughnut = true
        this.forceChartRefresh()
      })
  }

  callType(target) {
    if (target) {
      this.getResultdatabarra(target.value)
      this.getResultdataDonut(target.value)
    }
  }

  public chartClicked(e: any): void {
    ////console.log(e);
  }

  public chartHovered(e: any): void {
    ////console.log(e);
  }

  // events
  public chartClickeddonut(): void {
    ////console.log(e);
  }

  public chartHovereddonut(): void {
    ////console.log(e);
  }
}
