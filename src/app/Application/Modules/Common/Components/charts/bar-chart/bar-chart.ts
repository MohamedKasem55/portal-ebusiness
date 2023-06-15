import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Injector,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';

import Chart, {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {BaseChartDirective, PluginServiceGlobalRegistrationAndOptions} from 'ng2-charts';
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {BaseChartComponent} from "../base-chart/base-chart.component";
import {ChartRepresentation} from "../../../../../Model/ChartRepresentation";
import {roundTopAndBottomEdges} from "../utils/chart-round-edges"
import {DigitsLetterFormatterPipe} from "../../../../../Components/common/Pipes/digits-letter-formatter.pipe";

@Component({
    selector: 'app-bar-chart',
    templateUrl: './bar-chart.html',
    styleUrls: ['./bar-chart.scss'],
    providers: [DigitsLetterFormatterPipe]
})
export class BarChartComponent extends BaseChartComponent implements OnInit, AfterViewInit, OnChanges {

    @ViewChild(BaseChartDirective) chart: BaseChartDirective | Chart;

    @Input() chartData: ChartRepresentation
    @Input() chartType: ChartType;
    @Input() options: ChartOptions
    @Input() useDefaultStyles = true
    @Input() roundedEdges = true
    @Input() borderRadius = 20
    @Input() labelExtras: Map<string, any>
    @Input() height: any; //TODO: make height adjustable, not by css classes

    @Output() onRefresh = new EventEmitter<any>()
    @Output() onLabelClick = new EventEmitter<any>()

    chartOptions: ChartOptions

    constructor(
        injector: Injector,
        translate: TranslateService,
        public changeDetectorRef: ChangeDetectorRef
    ) {
        super(injector, translate);
    }

    ngOnChanges(changes: SimpleChanges) {
        if(this.chartData.data){
            this.updateLang()
            this.setOptions(this.options ? this.options : null)

            this.chartData.data = this.useDefaultStyles ? this.buildDataSets(this.chartData.data) : this.chartData.data
            if(this.roundedEdges){
                roundTopAndBottomEdges(this.borderRadius)
            }

            this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
                this.updateLang()
                this.setOptions(this.options ? this.options : null)
                this.chart.update()
            })

            this.chart?.update()
        }
    }

    ngOnInit(){

    }

    ngAfterViewInit(): void {
        this.changeDetectorRef.detectChanges()
    }

    buildDataSets(dataSets: ChartDataSets[]): ChartDataSets[]{
        const preparedDataSets: ChartDataSets[] = []

        dataSets.forEach((dataSet) => {
            const preparedDataSet: ChartDataSets = {
                backgroundColor: this.backgroundColors,
                borderColor: this.borderColors,
                hoverBackgroundColor: this.hoverBackgroundColor,
                borderWidth: 0,
                barPercentage: 0.4,
                categoryPercentage: 0.8,
                fill: false,
                ...dataSet
            }

            preparedDataSets.push(preparedDataSet)
        })

        return preparedDataSets
    }

    setOptions(options: ChartOptions){

        if(options){
            this.chartOptions = options
        } else {
            this.chartOptions = {
                elements: {
                    point: {
                        backgroundColor: 'rgb(0,0,0)'
                    },
                    line: {
                        tension: 0
                    }
                },
                animation: {
                    duration: 1500
                },
                hover: {
                  mode: 'nearest'
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            reverse: this.getCurrentLang() != 'en',
                        },
                        stacked: true,
                        gridLines: {
                            drawBorder: false,
                            display: false
                        }
                    }],
                    yAxes: [{
                        stacked: false,
                        ticks: {
                            padding: 20,
                            suggestedMin: 0,
                            stepSize: this.getTicksStepSize(this.chartData.data, 3),
                            callback(value: number | string, index: number, values: number[] | string[]){
                                return value.toLocaleString()
                            },
                        },
                        gridLines: {
                            zeroLineColor: "rgba(128, 134, 146, 0.2)",
                            zeroLineBorderDash: [6, 4],
                            drawBorder: false,
                            borderDash: [6, 4],
                            color: "rgba(128, 134, 146, 0.2)",
                            drawTicks: true,
                        },
                    }]
                },
                legend: {
                    display: this.chartData.data.length > 1,
                    reverse: true,
                    rtl: this.getCurrentLang() != 'en',
                    textDirection: this.getCurrentLang() == 'en' ? 'ltr' : 'rtl',
                    labels: {
                        usePointStyle: true,
                        boxWidth: 6,
                    },
                    position: "bottom",
                    align: "start",
                },
                tooltips: {
                  callbacks: {
                      label(tooltipItem: Chart.ChartTooltipItem, data: Chart.ChartData) {
                          const tooltipValue = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                          return tooltipValue['y'].toLocaleString()
                      }
                  },
                },
                onClick:(event?: MouseEvent, activeElements?: Array<{}>) =>  {
                    if(activeElements){
                        // @ts-ignore
                        const label = activeElements[0]?._model?.label
                        this.onLabelClick.emit(this.labelExtras?.get(label))
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        }
    }

    plugin: PluginServiceGlobalRegistrationAndOptions[] = [
        {
            afterDatasetsDraw: (chart) => {
                this.chart = chart
            },
        }
    ]

    public updateChart(){
        this.chart.update()
    }

}
