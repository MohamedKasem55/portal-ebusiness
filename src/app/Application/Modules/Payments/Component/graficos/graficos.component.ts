import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { BaseChartDirective } from 'ng2-charts'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { StorageService } from '../../../../../core/storage/storage.service'
import { Page } from '../../../../Model/page'
import { PagedData } from '../../../../Model/paged-data'
import { GraficoService } from '../../../../Modules/Payments/Component/grafico.service'
import { MonthlyStatisticsService } from '../../bill/monthly-statistics/monthly-statistics.service'

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css'],
})
export class GraficosComponent
  extends DatatableMobileComponent
  implements OnInit
{
  @Output() onChangeYearMotnh = new EventEmitter<any>()

  @ViewChild('tableMonthlyStatistics', { static: true })
  tableMonthlyStatistics: any
  monthlyStatisticsPage: PagedData<any>

  sharedVar: string
  length = 0
  loaded = true
  dato: any = 0
  Monthly: any
  FormMonth: FormGroup
  selectedValue = 'select'
  totalAmount: any = 0
  loadedDoughnut = false

  public datep = ''

  public currentUser: any

  chart: any
  sub: Subscription
  @ViewChild(BaseChartDirective)
  chartWidget: BaseChartDirective
  lineChartData: Array<any>
  lineChartLabels: Array<any>
  lineChartOptions: any = {
    animation: false,
    responsive: false,
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
  doughnutChartData: Array<number>
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
    legendCallback(chart) {
      const text = []
      text.push('<div>')
      for (let i = 0; i < chart.data.datasets.length; i++) {
        text.push('<li><span style="background-color:#333">')
        text.push(chart.data.datasets[i].label)
        text.push('</span></li>')
      }
      text.push('</div>')
      return text.join('')
    },
  }

  constructor(
    private fb: FormBuilder,
    private Monthlyservice: MonthlyStatisticsService,
    private storageService: StorageService,
    private datachartservice: GraficoService,
  ) {
    super()
    this.monthlyStatisticsPage = new PagedData<any>()
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.tableMonthlyStatistics)
    return tablas
  }

  getResultdata() {
    this.datachartservice.getMonthsDate().subscribe((result) => {
      if (result === null) {
        //console.log("error-->"+result);
      } else {
        this.Monthly = result.billStatistics
      }
    })
  }

  buildForm(): void {
    this.FormMonth = this.fb.group({
      Monthly: ['', Validators.required],
    })
  }

  forceChartRefresh() {
    this.tableMonthlyStatistics.recalculate()
    setTimeout(() => {
      this.chartWidget.update()
      //this.chartWidget.ngOnChanges();
      this.DonutChartOptions.legend = {}
      //this.chartWidget.generateLegend();
    }, 10)
  }

  ngOnInit(): void {
    this.buildForm()
    this.currentUser = JSON.parse(this.storageService.retrieve('currentUser'))
    this.getResultdata()
  }

  getResultdatabarra(value) {
    this.totalAmount = 0
    const me = this
    this.sub = this.datachartservice
      .getInformBill(value)
      .subscribe((stats: any) => {
        this.lineChartLabels = new Array()
        this.lineChartData = new Array()
        const data2 = new Array()
        this.lineChartData.length = 0
        this.lineChartLabels.length = 0
        data2.length = 0
        //console.log(stats);
        for (
          let i = 0;
          i < stats.billStatistics.detailsStatisticsList.length;
          i++
        ) {
          //console.log();
          data2.push(stats.billStatistics.detailsStatisticsList[i].amount)
          this.totalAmount =
            this.totalAmount +
            stats.billStatistics.detailsStatisticsList[i].amount
          this.lineChartLabels.push(
            stats.billStatistics.detailsStatisticsList[i].descriptionBillerCode,
          )
          this.lineChartData.push(
            stats.billStatistics.detailsStatisticsList[i].amount,
          )
        }

        //this.lineChartData.push({ data: data2, label: 'amount' });

        me.monthlyStatisticsPage.data =
          stats.billStatistics.detailsStatisticsList
        const pageMonthlyStatistics = new Page()
        pageMonthlyStatistics.pageNumber = 1
        pageMonthlyStatistics.pageSize =
          stats.billStatistics.detailsStatisticsList.length
        pageMonthlyStatistics.totalElements =
          stats.billStatistics.detailsStatisticsList.length
        me.monthlyStatisticsPage.page = pageMonthlyStatistics

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
        for (
          let i = 0;
          i < stats.billStatistics.detailsStatisticsList.length;
          i++
        ) {
          this.doughnutChartData.push(
            stats.billStatistics.detailsStatisticsList[i].amount,
          )
          this.doughnutChartLabels.push(
            stats.billStatistics.detailsStatisticsList[i].descriptionBillerCode,
          )
        }

        this.loadedDoughnut = true
        this.forceChartRefresh()
      })
  }

  callType(value) {
    this.getResultdatabarra(value)
    this.getResultdataDonut(value)

    this.onChangeYearMotnh.emit(value)
  }

  public chartClicked(e: any): void {
    //console.log(e);
  }

  public chartHovered(e: any): void {
    //console.log(e);
  }

  // events
  public chartClickeddonut(e: any): void {
    //console.log(e);
  }

  public chartHovereddonut(e: any): void {
    //console.log(e);
  }
}
