import { Component, Input } from '@angular/core'
import { StorageService } from '../../../../../../core/storage/storage.service'
import { BillerINform } from '../../../../../Modules/Payments/Model/inform-bill'

@Component({
  selector: 'app-bar-chart',
  template: `
    <div>
      <div
        style="display: block; width:90%; padding: 10px , 10px,
  10px, 20px; margin-left:20px"
      >
        <canvas
          baseChart
          [datasets]="barChartData"
          [labels]="barChartLabels"
          [options]="barChartOptions"
          [legend]="barChartLegend"
          (chartHover)="chartHovered($event)"
          (chartClick)="chartClicked($event)"
        >
          [colors]="chartColors"
        </canvas>
      </div>
    </div>
  `,
})
export class BarChartComponent {
  @Input() dato: any
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
  }

  chartColors: Array<any> = [
    {
      backgroundColor: '#d8e5f2',
      borderColor: 'rgba(97,124,230,0.4)',
      pointBackgroundColor: 'rgba(225,10,24,0.2)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(225,10,24,0.2)',
    },
    {
      backgroundColor: '#d8e5f2',
      borderColor: 'rgba(225,10,24,0.2)',
      pointBackgroundColor: 'rgba(225,10,24,0.2)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(225,10,24,0.2)',
    },
  ]

  dataResult: BillerINform[]

  currentUser = ''
  loaded = false
  public barChartLabels: string[] = []
  public barChartType = 'bar'
  public barChartLegend = true

  public barChartData: any[] = [{ data: [65, 59, 80, 81, 56, 55, 40, ''] }]

  constructor(private storageService: StorageService) {
    this.currentUser = JSON.parse(this.storageService.retrieve('currentUser'))
  }

  // events
  public chartClicked(e: any): void {
    ////console.log(e);
  }

  public chartHovered(e: any): void {
    ////console.log(e);
  }
}
