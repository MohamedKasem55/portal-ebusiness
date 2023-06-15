import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef, EventEmitter,
    Injector,
    Input, OnChanges,
    OnInit, Output,
    Renderer2,
    ViewChild
} from '@angular/core';
import Chart, {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {BaseChartDirective, PluginServiceGlobalRegistrationAndOptions} from 'ng2-charts';
import {Label} from "ng2-charts/lib/base-chart.directive";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {BaseChartComponent} from "../base-chart/base-chart.component";
import {ChartRepresentation} from "../../../../../Model/ChartRepresentation";

@Component({
    selector: 'app-doughnut-chart',
    templateUrl: './doughnut-chart.component.html',
    styleUrls: ['./doughnut-chart.component.scss']
})
export class DoughnutChartComponent extends BaseChartComponent implements OnInit, OnChanges, AfterViewInit, AfterContentInit {
    @ViewChild(BaseChartDirective) chart: BaseChartDirective | Chart;
    @ViewChild('legendDev') legendDiv: ElementRef;

    @Input() chartType: ChartType
    @Input() chartData: ChartRepresentation
    @Input() options: ChartOptions
    @Input() valueText: string
    @Input() titleText: string
    @Input() height: any

    @Input() useDefaultStyles = true
    @Input() showLegend = false
    @Input() useDefaultLegend = true
    @Input() interactiveLegend = true
    @Input() labelExtras: Map<string, any>

    @Output() onRefresh = new EventEmitter<any>()
    @Output() onLabelClick = new EventEmitter<any>()

    currentLang: string
    chartOptions: ChartOptions
    customChartInstance: Chart;
    chartId: number
    legendList: any[]

    constructor(
        injector: Injector,
        translate: TranslateService,
        private renderer: Renderer2,
        private changeDetector: ChangeDetectorRef
    ) {
        super(injector, translate)

    }

    ngOnChanges() {

        if(this.chartData.data){
            this.updateLang()
            this.setOptions(this.options ? this.options : null)

            this.chartData.data = this.useDefaultStyles ? this.buildDataSets(this.chartData.data) : this.chartData.data

            this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
                this.updateLang()
                this.setOptions(this.options ? this.options : null)
                this.chart.update()
            })
        }
    }

    ngOnInit(){

    }

    ngAfterViewInit(): void {

        if(!this.useDefaultLegend && this.chartData.data){
            // @ts-ignore
            this.chartId = this.chart.chart.id
            this.changeDetector.detectChanges()
        }
    }

    ngAfterContentInit(): void {
    }

    buildDataSets(dataSets: ChartDataSets[]): ChartDataSets[]{
        const preparedDataSets: ChartDataSets[] = []

        dataSets.forEach((dataSet) => {
            const preparedDataSet: ChartDataSets = {
                ...dataSet,
                backgroundColor: this.backgroundColors,
                borderColor: this.borderColors,
                hoverBackgroundColor: this.hoverBackgroundColor,
                borderWidth: 0,
                fill: false,
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
                animation: {
                    duration: 1500
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            display: false
                        },
                        gridLines: {
                            display: false
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            display: false
                        },
                        gridLines: {
                            display: false
                        }
                    }]
                },
                cutoutPercentage: 80,
                legendCallback: (chart) => {

                    const dataToReturn: any[] = []
                    for (let i = 0; i < chart.data.labels.length; i++) {
                        dataToReturn.push({// @ts-ignore
                            id: chart.id,// @ts-ignore
                            color: chart.getDatasetMeta(0).data[i]._options.backgroundColor,
                            label: chart.data.labels[i],
                            value: chart.data.datasets[0].data[i]
                        })
                    }
                    return JSON.stringify(dataToReturn)
                },
                legend: {
                    display: this.showLegend,
                    reverse: true,
                    rtl: this.getCurrentLang() != 'en',
                    textDirection: this.getCurrentLang() == 'en' ? 'ltr' : 'rtl',
                    labels: {
                        padding: 5,
                        fontSize: 15, //TODO handle responsiveness
                        usePointStyle: true,
                        boxWidth: 6,
                    },
                    position: "bottom",
                    align: "center"
                },
                responsive: true,
                maintainAspectRatio: false
            }
        }
    }

    plugin: PluginServiceGlobalRegistrationAndOptions[] = [
    // Draw the text in the center
        {
            beforeDraw: (chartInstance) => { // @ts-ignore
                const width = chartInstance.chart.width; // @ts-ignore
                const height = chartInstance.chart.height; // @ts-ignore
                const ctx = chartInstance.chart.ctx;

                ctx.restore();
                let fontSize = (height / 114).toFixed(2);
                ctx.font = fontSize + "em sans-serif";
                ctx.textBaseline = "middle";
                ctx.fillStyle = 'black'

                const valueText = this.valueText;
                const valueTextX = this.currentLang == 'en' ? Math.round((width - ctx.measureText(valueText).width) / 1.95) : Math.round((width + ctx.measureText(valueText).width) / 1.95);
                const valueTextY = height / (this.showLegend ? 2.5 : 2)

                ctx.fillText(valueText, valueTextX, valueTextY);

                fontSize = (height / 228).toFixed(2);
                ctx.font = fontSize + 'em sans-serif';
                ctx.textBaseline = "middle";
                ctx.fillStyle = '#6b7280'

                const titleText = this.titleText;
                const titleTextX = this.currentLang == 'en' ? Math.round((width - ctx.measureText(titleText).width) / 1.95) : Math.round((width + ctx.measureText(titleText).width) / 1.95);
                const titleTextY = height / (this.showLegend ? 2 : 1.66);

                ctx.fillText(titleText, titleTextX, titleTextY);
                ctx.save();

                if(!this.useDefaultLegend){
                    // @ts-ignore
                    this.legendList = JSON.parse(this.chart.chart.generateLegend())
                    if(this.labelExtras?.size > 0){
                        // labelExtras length must match legendList length to preserve consistency
                        this.legendList = this.legendList.map(legend => {
                            return {...legend, extras: this.labelExtras.get(legend.label)}
                        })
                    }
                }
            }
        }
    ]

    updateSetVisibility(chartId, dataSetIndex, event){
        if(this.interactiveLegend) {
            const currentMeta = this.getMetaData(this.chart, 0).data[dataSetIndex]
            currentMeta.hidden = !currentMeta.hidden;

            this.chart.update()
        }
        this.onLabelClick.emit(event)
    }

    isHidden(dataSetIndex){
        if(this.chart) {
            const currentMeta = this.getMetaData(this.chart, 0).data[dataSetIndex]
            return currentMeta?.hidden
        } else {
            return false;
        }
    }

    labelItemConfiguration(chart){
        const data = chart.data;
        if (data.labels.length && data.datasets.length) {
            return data.labels.map(function(label, i) {
                const meta = chart.getDatasetMeta(0);
                const ds = data.datasets[0];
                const arc = meta.data[i];
                const custom = arc && arc.custom || {};
                const getValueAtIndexOrDefault = Chart.helpers.getValueAtIndexOrDefault;
                const arcOpts = chart.options.elements.arc;
                const fill = custom.backgroundColor ? custom.backgroundColor : getValueAtIndexOrDefault(ds.backgroundColor, i, arcOpts.backgroundColor);
                const stroke = custom.borderColor ? custom.borderColor : getValueAtIndexOrDefault(ds.borderColor, i, arcOpts.borderColor);
                const bw = custom.borderWidth ? custom.borderWidth : getValueAtIndexOrDefault(ds.borderWidth, i, arcOpts.borderWidth);

                const value = chart.config.data.datasets[arc._datasetIndex].data[arc._index];

                return {
                    text: label + " " + value, //TODO add pipe for values
                    fillStyle: fill,
                    strokeStyle: stroke,
                    lineWidth: bw,
                    hidden: isNaN(ds.data[i]) || meta.data[i].hidden,
                    index: i
                };
            });
        } else {
            return [];
        }
    }


}
