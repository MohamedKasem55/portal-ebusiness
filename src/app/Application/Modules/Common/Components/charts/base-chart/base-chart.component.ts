import {ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {ChartDataSets} from "chart.js";

@Component({
  selector: 'app-base-chart',
  templateUrl: './base-chart.component.html',
  styleUrls: ['./base-chart.component.scss']
})
export class BaseChartComponent implements OnInit {

  private TICKS_STEP_SIZE_CORRECTION_MARGIN: number = 1.1

  currentLang: string

  constructor(
      private injector: Injector,
      public translate: TranslateService,
  ) {
  }

  ngOnInit(): void {

  }

  public updateLang(){
    this.currentLang = this.injector.get(TranslateService).currentLang
  }

  public getCurrentLang(){
    this.updateLang()
    return this.currentLang
  }

  public getTicksStepSize(dataSets: any[], stepCount: number){
    let currentMax = 0;

    dataSets?.forEach(dataSets => {
      const dataSetMax = Math.max(...dataSets?.data)
      if(dataSetMax > currentMax){
        currentMax = dataSetMax
      }
    })
    currentMax *= this.TICKS_STEP_SIZE_CORRECTION_MARGIN
    return currentMax != 0 ? Math.round(currentMax / stepCount)  : currentMax
  }

  // Use to get the meta data from the global chart
  public getMetaData(chart, index: number = 0){
    return chart.datasets[index]._meta[Object.keys(chart.datasets[index]._meta)[0]]
  }

  public backgroundColors = [
    '#0005a7',
    '#0040e4',
    '#5c7bf6',
    '#713cf3',
    '#a27ef8'
  ]

  public hoverBackgroundColor = [
    '#0005a7',
    '#0040e4',
    '#5c7bf6',
    '#713cf3',
    '#a27ef8'
  ]

  public borderColors = [
    '#0005a7',
    '#0040e4',
    '#5c7bf6',
    '#713cf3',
    '#a27ef8'
  ]
}
