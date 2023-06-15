import {
    AfterViewInit, ChangeDetectorRef,
    Component,
    EventEmitter,
    Injector,
    Input,
    OnChanges,
    OnInit,
    Output, SimpleChanges,
    ViewChild
} from '@angular/core';
import {BaseChartComponent} from "../base-chart/base-chart.component";
import {BaseChartDirective, PluginServiceGlobalRegistrationAndOptions} from "ng2-charts";
import Chart, {ChartDataSets, ChartOptions, ChartType} from "chart.js";
import {ChartRepresentation} from "../../../../../Model/ChartRepresentation";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {toEnDigit} from "../utils/number-formatter"

@Component({
    selector: 'app-line-chart',
    templateUrl: './line-chart.component.html',
    styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent extends BaseChartComponent implements AfterViewInit, OnChanges {
    @ViewChild(BaseChartDirective) chart: BaseChartDirective | Chart;

    @Input() chartData: ChartRepresentation;
    @Input() options: ChartOptions;
    @Input() useDefaultStyles = true;
    @Input() roundedEdges = true;
    @Input() borderRadius = 20;
    @Input() height: any; //TODO: make height adjustable, not by css classes
    @Input() timeUnit: Chart.TimeUnit //TODO: extract all options

    @Output() onRefresh = new EventEmitter<any>()

    chartOptions: ChartOptions = {
        legend: {
            reverse: true,
            rtl: this.getCurrentLang() != 'en',
            textDirection: this.getCurrentLang() == 'en' ? 'ltr' : 'rtl',
            labels: {
                usePointStyle: true,
                boxWidth: 6,
            },
            position: "bottom",
            align: "start"
        }
    }

    constructor(
        injector: Injector,
        translate: TranslateService,
        public changeDetectorRef: ChangeDetectorRef
    ) {
        super(injector, translate);
    }

    setOptions(options: ChartOptions){
        this.chartOptions = {
            animation: {
                duration: 1500
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: this.timeUnit,
                        parser: 'DD-MM-YYYY',
                        displayFormats: {
                            day: 'MM-DD-YYYY',
                            month: 'MM-DD-YYYY'
                        }
                    },
                    ticks: {
                        reverse: this.getCurrentLang() != 'en',
                        callback: (value) => {
                            let date = new Date(toEnDigit(`${value}`));

                            if(this.timeUnit == 'month'){
                                return this.getCurrentLang() == 'en' ? date.toLocaleDateString('en-US', {month: 'long', year: 'numeric'}) :
                                    date.toLocaleDateString('ar-AE', {month: 'long', year: 'numeric'})
                            } else if(this.timeUnit == 'day'){
                                return this.getCurrentLang() == 'en' ? date.toLocaleDateString('en-US', {day: 'numeric', weekday: 'short'}) :
                                    date.toLocaleDateString('ar-AE', {day: 'numeric', weekday: 'short'})
                            }
                        }
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
                        callback(value){
                            return value.toLocaleString()
                        }
                    },
                    gridLines: {
                        zeroLineColor: "rgba(128, 134, 146, 0.2)",
                        zeroLineBorderDash: [6, 4],
                        drawBorder: false,
                        borderDash: [6, 4],
                        color: "rgba(128, 134, 146, 0.2)",
                        drawTicks: true,
                    }
                }]
            },
            legend: {
                display: this.chartData?.data?.length > 1,
                reverse: true,
                rtl: this.getCurrentLang() != 'en',
                textDirection: this.getCurrentLang() == 'en' ? 'ltr' : 'rtl',
                labels: {
                    usePointStyle: true,
                    boxWidth: 6,
                },
                position: "bottom",
                align: "start"
            },
            tooltips: {
                callbacks: {
                    label: (tooltipItem: Chart.ChartTooltipItem, data: Chart.ChartData) => {
                        const tooltipValue = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                        return tooltipValue['y'].toLocaleString()
                    },
                },
                displayColors: false,
                mode: 'index',
                intersect: false
            },
            hover: {
                mode: 'index',
                intersect: false
            },
            responsive: true,
            maintainAspectRatio: false,
            ...options
        }
    }

    ngOnChanges() {
        this.setOptions(this.options)
        if (this.chartData?.data) {
            this.updateLang();
            this.chartData.data = this.useDefaultStyles ? this.buildDataSets(this.chartData.data) : this.chartData.data;
            // this.setOptions(this.options ? this.options : null);
            this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
                this.updateLang()
                // this.setOptions(this.options ? this.options : null)
                this.chart.update()
            })
            this.chart?.update()
        }
    }

    ngAfterViewInit(): void {
        this.changeDetectorRef.detectChanges()
    }

    buildDataSets(dataSets: ChartDataSets[]): ChartDataSets[] {
        const preparedDataSets: ChartDataSets[] = []

        dataSets.forEach((dataSet) => {
            const preparedDataSet: ChartDataSets = {
                ...dataSet
            }

            preparedDataSets.push(preparedDataSet)
        })

        return preparedDataSets
    }

    public updateChart() {
        this.chart.update()
    }

    // setOptions(options: ChartOptions) {
    //     this.chartOptions
    // }

    plugin: PluginServiceGlobalRegistrationAndOptions[] = [
        {
            afterDatasetsDraw: (chart) => {
                this.chart = chart
            }
        },
    ]


}
