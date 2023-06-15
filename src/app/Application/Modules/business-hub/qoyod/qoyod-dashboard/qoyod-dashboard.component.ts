import {ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {ChartDataSets} from "chart.js";
import {QoyodDashboardService} from "./qoyod-dashboard.service";
import {ChartRepresentation} from "../../../../Model/ChartRepresentation";
import {forkJoin, Observable, of} from "rxjs";
import {BarChartComponent} from "../../../Common/Components/charts/bar-chart/bar-chart";

@Component({
    selector: 'app-qoyod-dashboard',
    templateUrl: './qoyod-dashboard.component.html',
    styleUrls: ['./qoyod-dashboard.component.scss']
})
export class QoyodDashboardComponent implements OnInit {

    @ViewChild('billsOverviewBarChartComponent') billsOverviewBarChartComponent: BarChartComponent
    @ViewChild('invoicesOverviewBarChartComponent') invoicesOverviewBarChartComponent: BarChartComponent

    constructor(
        public injector: Injector,
        public fb: FormBuilder,
        public router: Router,
        private route: ActivatedRoute,
        public translateService: TranslateService,
        private changeDetector: ChangeDetectorRef,
        public service: QoyodDashboardService,
    ) {
        //TODO: handle 500 error infinite loading
        this.switchTab(1)
    }

    billsAgingSummery$: Observable<any> = this.service.getBillsAgingSummary()
    topBills$: Observable<any> = this.service.getTopBills()
    topBillsVendors$: Observable<any> = this.service.getTopVendors()
    billsOverview$: Observable<any> = this.service.getBillsOverview()

    invoicesOverview$: Observable<any> =this.service.getInvoicesOverview()
    invoicesAgingSummary$: Observable<any> =this.service.getInvoicingAgingSummary()
    topInvoicesCustomer$: Observable<any> = this.service.getTopInvoiceCustomers()
    topInvoices$: Observable<any> =this.service.getTopInvoices()

    currentLang: string
    activeTab;
    subscriptionExpiryNotice: boolean = false

    billsOverviewChartData: any = []
    billsOverviewChart: ChartRepresentation = new ChartRepresentation()
    billsAgingSummaryChart: ChartRepresentation = new ChartRepresentation()
    topVendorsChart: ChartRepresentation = new ChartRepresentation()
    topBills: any

    invoicesOverviewChartData: any = []
    invoicesOverviewChart: ChartRepresentation = new ChartRepresentation()
    invoicesAgingSummaryChart: ChartRepresentation = new ChartRepresentation()
    topCustomerChart: ChartRepresentation = new ChartRepresentation()
    topInvoices: any

    paidOptions = {
        barPercentage: 0.4,
        categoryPercentage: 0.8,
        backgroundColor: '#008b00',
        hoverBackgroundColor: '#008b00',
        borderColor: '#008b00',
    }

    dueOptions = {
        barPercentage: 0.4,
        categoryPercentage: 0.8,
        backgroundColor: '#b0eb7f',
        hoverBackgroundColor: '#b0eb7f',
        borderColor: '#b0eb7f'
    }

    ngOnInit(): void {

        this.route.data.subscribe(data => {
            this.subscriptionExpiryNotice = data.guardData.subscriptionExpiryNotice
        })
        this.updateLang()
        this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
            this.updateLang()
        })

    }

    public updateLang() {
        this.currentLang = this.injector.get(TranslateService).currentLang
    }

    getCurrentLang() {
        return this.currentLang
    }

    switchTab(tabId) {
        this.activeTab = tabId
        switch (tabId) {
            case 1:
                this.initiateBilling()
                break
            case 2:
                this.initiateInvoicing()
                break
        }
    }

    isTabActive(tabId) {
        return this.activeTab == tabId
    }

    onAccountChange(event) {
        console.log(event)
    }

    initiateInvoicing() {
        const observables = [
            this.initiateInvoicesOverview(),
            this.initiateInvoicingAgingSummary(),
            this.initiateTopInvoices(),
            this.initiateInvoicesTopCustomers()
        ]

        return forkJoin(observables)
    }

    initiateBilling() {
        const observables = [
            this.initiateBillsOverview(),
            this.initiateBillsAgingSummary(),
            this.initiateBillsTopVendors(),
            this.initiateTopBills(),
        ]
        return forkJoin(observables);
    }

    // Bills

    initiateBillsOverview(): Observable<any>{
        return of(this.billsOverview$.subscribe(res => {

            this.billsOverviewChart = res.years ? this.buildBillsOverviewChartRep(
                res.years
            ) : this.billsOverviewChart
        }))
    }

    initiateBillsAgingSummary(): Observable<any> {
        return of(
            this.billsAgingSummery$.subscribe(res => {
                this.billsAgingSummaryChart = res.agedOpenBills ?
                    this.buildBillsAgingSummaryChartRep(res.agedOpenBills) : this.billsAgingSummaryChart
            })
        )
    }

    initiateBillsTopVendors(): Observable<any>{
        return of(
            this.topBillsVendors$.subscribe(res => {
                this.topVendorsChart = res.vendorItems ?
                    this.buildTopVendorsChartRep(res.vendorItems) : this.topVendorsChart
            })
        )
    }

    initiateTopBills(): Observable<any>{
        return of(
            this.topBills$.subscribe(res => {
                this.topBills = this.fillTableList(res.vendorItems)
            })
        )
    }

    buildBillsOverviewChartRep(years): ChartRepresentation {

        //empty before filling
        if(this.billsOverviewChartData.length > 0){
            this.billsOverviewChartData = []
        }

        if(years){
            years.forEach(yearData => {
                const sortedPaidBillsData = this.sortDataByDate(yearData.paidBills)
                const sortedDueBillsData = this.sortDataByDate(yearData.unPaidBills)

                const dataSet: ChartDataSets[] = [
                    this.buildDataSet(
                        this.extractKey(sortedPaidBillsData, 'total'),
                        this.translateService.instant('business-hub.invoicing.dashboard.paidBills'),
                        this.paidOptions
                    )
                    ,
                    this.buildDataSet(
                        this.extractKey(sortedDueBillsData, 'total'),
                        this.translateService.instant('business-hub.invoicing.dashboard.dueBills'),
                        this.dueOptions
                    )
                ]

                let finalizedYearData = {
                    year: yearData.year,
                    keys: this.extractKey(sortedPaidBillsData, 'date'),
                    dataSet: dataSet,
                }

                this.billsOverviewChartData.push(finalizedYearData)
            })

            return new ChartRepresentation(
                this.billsOverviewChartData[0].dataSet,
                this.billsOverviewChartData[0].keys
            )
        }
    }

    buildBillsAgingSummaryChartRep(data): ChartRepresentation {

        const billsValuesString: string[] = Object.values(data)
        const billsValues = billsValuesString.map(bill => parseInt(bill))

        const dataSet: ChartDataSets[] = [
            this.buildDataSet(
                billsValues.slice(0, billsValues.length - 1),
                this.translateService.instant('business-hub.invoicing.bills'),
            )
        ]

        return new ChartRepresentation(
            dataSet,
            Object.keys(data).slice(0, billsValuesString.length - 1).map(key => this.translateService.instant(`business-hub.shared.aging.${key}`)),
            this.translateService.instant('business-hub.invoicing.dashboard.total'),
            billsValuesString[billsValues.length - 1]
        )
    }

    buildTopVendorsChartRep(data): ChartRepresentation {
        let vendorsAmount = this.extractKey(data, 'amount')
        vendorsAmount = vendorsAmount.map(amount => parseInt(amount))

        const dataSet: ChartDataSets[] = [
            this.buildDataSet(
                vendorsAmount,
                this.translateService.instant('business-hub.invoicing.bills')
            )
        ]

        return new ChartRepresentation(
            dataSet,
            this.extractKey(data, 'vendorName'),
            this.translateService.instant('business-hub.invoicing.dashboard.total'),
            vendorsAmount.reduce((a, b) => a + b, 0)
        )
    }

    // Invoices

    initiateInvoicesOverview(){
        return of(this.invoicesOverview$.subscribe(res => {
            this.invoicesOverviewChart = res.years ? this.buildInvoicesOverviewChartRep(
                res.years
            ) : this.invoicesOverviewChart
        }))
    }

    initiateInvoicingAgingSummary(){
        return of(this.invoicesAgingSummary$.subscribe(res => {
            this.invoicesAgingSummaryChart = res.agedOpenInvoices ?
                this.buildInvoicingAgingSummaryChartRep(res.agedOpenInvoices) : this.invoicesAgingSummaryChart
        }))
    }

    initiateInvoicesTopCustomers(){
        return of(this.topInvoicesCustomer$.subscribe(res => {
            this.topCustomerChart = res.qoyodOutStandingCustomer ?
                this.buildTopCustomersChartRep(res.qoyodOutStandingCustomer) : this.topCustomerChart
        }))
    }

    initiateTopInvoices(){
        return of(this.topInvoices$.subscribe(res => {
            this.topInvoices = this.fillTableList(res.qoyodInvoiceItems)
        }))
    }

    buildInvoicesOverviewChartRep(InvoiceOverviewItemYearly): ChartRepresentation {

        //empty before filling
        if(this.invoicesOverviewChartData.length > 0){
            this.invoicesOverviewChartData = []
        }

        if(InvoiceOverviewItemYearly){
            InvoiceOverviewItemYearly.forEach(yearData => {

                const sortedPaidInvoicesData = this.sortDataByDate(yearData.paidInvoices)
                const sortedDueInvoicesData = this.sortDataByDate(yearData.unPaidInvoices)

                const dataSet: ChartDataSets[] = [
                    this.buildDataSet(
                        this.extractKey(sortedPaidInvoicesData, 'total'),
                        this.translateService.instant('business-hub.invoicing.dashboard.paidInvoices'),
                        this.paidOptions
                    )
                    ,
                    this.buildDataSet(
                        this.extractKey(sortedDueInvoicesData, 'total'),
                        this.translateService.instant('business-hub.invoicing.dashboard.dueInvoices'),
                        this.dueOptions
                    )
                ]

                let finalizedYearData = {
                    year: yearData.year,
                    keys: this.extractKey(sortedPaidInvoicesData, 'date'),
                    dataSet: dataSet,
                }

                this.invoicesOverviewChartData.push(finalizedYearData)
            })

            return new ChartRepresentation(
                this.invoicesOverviewChartData[0].dataSet,
                this.invoicesOverviewChartData[0].keys,
            )
        }
    }

    buildInvoicingAgingSummaryChartRep(data): ChartRepresentation {

        const invoicesValuesString: string[] = Object.values(data)
        const invoicesValues = invoicesValuesString.map(bill => parseInt(bill))

        const dataSet: ChartDataSets[] = [
            this.buildDataSet(
                invoicesValues.slice(0, invoicesValues.length - 1),
                this.translateService.instant('business-hub.invoicing.invoices'),
            )
        ]

        return new ChartRepresentation(
            dataSet,
            Object.keys(data).slice(0, invoicesValuesString.length - 1).map(key => this.translateService.instant(`business-hub.shared.aging.${key}`)),
            this.translateService.instant('business-hub.invoicing.dashboard.total'),
            invoicesValuesString[invoicesValues.length - 1]
        )
    }

    buildTopCustomersChartRep(data): ChartRepresentation {
        let customerAmount = this.extractKey(data, 'totalOutstanding')
        customerAmount = customerAmount.map(amount => parseInt(amount))

        const dataSet: ChartDataSets[] = [
            this.buildDataSet(
                customerAmount,
                this.translateService.instant('business-hub.invoicing.dashboard.total')
            )
        ]

        return new ChartRepresentation(
            dataSet,
            this.extractKey(data, 'custName'),
            this.translateService.instant('business-hub.invoicing.dashboard.total'),
            customerAmount.reduce((a, b) => a + b, 0)
        )
    }

    extractKey(dataArray: any[], key: string): any[] {
        const data = []

        dataArray.forEach(obj => {
            data.push(obj[key])
        })
        return data
    }

    sortDataByDate(data: any[]): any[] {
        const sortedData = []

        data.forEach(obj => {
            const objDate = new Date(obj.year, --obj.month)
            sortedData.push({
                total: obj.total,
                date: objDate
            })
        })

        sortedData.sort((a, b) => a.date - b.date)
        sortedData.forEach(obj => {
            obj.date = obj.date.toLocaleString('default', {month: 'long'}).substr(0, 3);
        })

        return sortedData
    }

    buildDataSet(data: number[], label: string, rest: any = {}): ChartDataSets {
        return {
            data: data,
            label: label,
            ...rest
        }
    }

    renewSubscription() {
        this.router.navigateByUrl('/business-hub/qoyod/register')
    }

    fillTableList(list: any[]){
        if(list){
            const diff = 5 - list?.length;
            if(diff > 0){
                for(let i = diff; i > 0; i--){
                    list[i] = {}
                }
            }
            return list
        }
    }

    getChartOverviewDropdownItems(overviewChartData){
        const actions = []
        if(overviewChartData){
            const yearsData = this.extractKey(overviewChartData, 'year')

            yearsData?.forEach(year => {
                actions.push({
                    title: year,
                    operation: year,
                })
            })
        }
        return actions
    }

    switchBillsOverviewYear(chartsData: any, selectedEvent){

        const selectedChartData = chartsData.filter(chartData => chartData.year == selectedEvent.operation)

        this.billsOverviewChart = new ChartRepresentation(
            selectedChartData[0].dataSet,
            selectedChartData[0].keys,
        )

        this.billsOverviewBarChartComponent.updateChart()
    }

    switchInvoicesOverviewYear(chartsData: any, selectedEvent){
        const selectedChartData = chartsData.filter(chartData => chartData.year == selectedEvent.operation)

        this.invoicesOverviewChart = new ChartRepresentation(
            selectedChartData[0].dataSet,
            selectedChartData[0].keys,
        )

        this.invoicesOverviewBarChartComponent.updateChart()
    }

}
