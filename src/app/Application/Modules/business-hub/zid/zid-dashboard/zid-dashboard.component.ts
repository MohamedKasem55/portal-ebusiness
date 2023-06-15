import {Component, OnInit} from '@angular/core';
import {ChartDataSets} from "chart.js";
import {Label} from "ng2-charts/lib/base-chart.directive";
import {ConfigResourceService} from "../../../../../core/config/config.resource.local";

@Component({
    selector: 'app-zid-dashboard',
    templateUrl: './zid-dashboard.component.html',
    styleUrls: ['./zid-dashboard.component.scss']
})
export class ZidDashboardComponent implements OnInit {

    constructor() {
    }

    ngOnInit(): void {
    }

    chartData: ChartDataSets[] = [
        {
            data: [10, 40, 30, 75, 77, 88],
            label: 'bills',
            fill: false,
            borderWidth: 0.3,
            barPercentage: 1.0,
            categoryPercentage: 0.5,
        }
    ];

    chartLabels: Label[] = ['label1', 'label2', 'label3', 'label4', 'label5', 'label6'];

    chartLabels2: Label[] = ['test1', 'test2', 'test3', 'test4', 'test5', 'test6'];

    tableData: any = [
        {
            vendorName: "test name",
            invoiceNumber: "12335345354353",
            amount: "23543.66"
        },
        {
            vendorName: "test name2",
            invoiceNumber: "12335345354353",
            amount: "23543.66"
        },
        {
            vendorName: "test name3",
            invoiceNumber: "12335345354353",
            amount: "23543.66"
        },
        {
            vendorName: "test name4",
            invoiceNumber: "12335345354353",
            amount: "23543.66"
        },
        {
            vendorName: "test name5",
            invoiceNumber: "12335345354353",
            amount: "23543.66"
        }
    ]

    printSelectAction(event) {
        console.log(event)
    }

    onAccountChange(event) {
        console.log(event)
    }
}
