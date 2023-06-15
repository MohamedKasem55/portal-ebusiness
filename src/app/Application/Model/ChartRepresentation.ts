import {ChartDataSets} from "chart.js";
import {Label} from "ng2-charts/lib/base-chart.directive";

export class ChartRepresentation {

    data: ChartDataSets[]
    labels: Label[]

    innerTitle: string
    innerValue: string

    constructor(
        _data?: ChartDataSets[],
        _labels?: Label[],
        _innerTitle?: string,
        _innerValue?: string
    ) {
        this.data = _data
        this.labels = _labels
        this.innerTitle = _innerTitle
        this.innerValue = _innerValue
    }


}