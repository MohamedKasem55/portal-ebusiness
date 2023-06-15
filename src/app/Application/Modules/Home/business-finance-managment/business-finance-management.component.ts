import {AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges} from '@angular/core';
import {ChartRepresentation} from "../../../Model/ChartRepresentation";
import {BusinessFinManagementService} from "../Services/business-fin-management.service";
import {DatePipe} from "@angular/common";
import {BfmBaseRequest} from "./model/bfm-base-request";
import {CashFlowResponse} from "./model/cash-flow-response";
import {TopByCategoryRequest} from "./model/top-by-category-request";
import {POSLocation} from "./model/p-o-s-location";
import {Account} from "../../../Model/account";
import {ModelPipe} from "../../../Components/common/Pipes/model-pipe";
import {TranslateService} from "@ngx-translate/core";
import {AccountBalanceService} from "../Services/account-balance-service";
import {HOME_PAGE_SIZE} from "../Component/home-main.component";
import {TopBySubCategoryRequest} from "./model/top-by-sub-category-request";


@Component({
    selector: 'app-business-finance-management',
    templateUrl: './business-finance-management.component.html',
    styleUrls: ['./business-finance-management.component.scss']
})
export class BusinessFinanceManagementComponent implements OnChanges ,AfterViewInit {

    @Input() accounts: Account[] = [];
    @Input() totalBalance;

    cashOverFlowChartData: ChartRepresentation = new ChartRepresentation();

    availableBalanceChartData: ChartRepresentation = new ChartRepresentation();

    topIncomeDoughnutChartData: ChartRepresentation = new ChartRepresentation();

    topIncomeByCategoryBarChartData: ChartRepresentation = new ChartRepresentation();

    topIncomePOSByLocationChartData: ChartRepresentation = new ChartRepresentation();

    topExpenseDoughnutChartData: ChartRepresentation = new ChartRepresentation();

    topExpenseByCategoryBarChartData: ChartRepresentation = new ChartRepresentation();

    topIncomeCategories = new Map()
    topExpenseCategories = new Map()

    activeTab;
    options: any;
    view: number = Views.DEFAULT;
    selectedSubCategory: string

    actualExpenseAmount: any;
    actualIncomeAmount: any;
    actualExpenseCurrency: any;
    actualIncomeCurrency: any;

    expectedExpenseAmount: any;
    expectedIncomeAmount: any;
    expectedExpenseCurrency: any;
    expectedIncomeCurrency: any;
    cashFlow: any;

    expectedTodayExpenseAmount: any;
    expectedTodayIncomeAmount: any;
    expectedCurrentMonthExpenseAmount: any;
    expectedCurrentMonthIncomeAmount: any;
    /*
    * Period Type
    * 1 = Today
    * 2 = Current
    * 3 = Last 6 month
    * */

    actionsCashFlow =
    [{
        id: 1,
        title: "bfm.TODAY"
    },
    {
        id: 2,
        title: "bfm.CURRENT-MONTH"
    },
    {
        id: 3,
        title: "bfm.SIX-MONTH"
    }];

    cashFlowTabList = [{id: 1, name: 'Today'}, {id: 2, name: 'Current Month'}, {id: 3, name: '6 Months'}]
    incomeByCategoryTabList = [{id: 1, name: 'Today'}, {id: 2, name: 'Current Month'}, {id: 3, name: '6 Months'}]
    expenseByCategoryTabList = [{id: 1, name: 'Today'}, {id: 2, name: 'Current Month'}, {id: 3, name: '6 Months'}]

    bfmBaseRequest: BfmBaseRequest;

    availableBalanceDates = [];
    availableBalanceList = [];

    cashFlowIncomeDataSet: any = [];
    cashFlowActualDataSet: any = [];
    cashFlowExpenseDataSet: any = [];

    selectedPeriodIndex = 0;

    totalIncomeDoughnutChart: number;
    totalIncomePOSByLocation: number;

    totalExpenseByCategory: any;
    showExpensesAndDashboardAnalytics = false;
    showActualIncomeAndExpenseAnalytics = true;

    selectedAccount: any;
    currenciesList: any[] = [];
    selectedCurrencyIndex: any = 0;
    selectedAccountIBAN: string;
    language: any;
    selectedCurrency: any;
    accountsListOffset = 0
    loadedAllAccounts = false

    constructor(private businessFinManagementService: BusinessFinManagementService,
                public datepipe: DatePipe,
                public modelPipe: ModelPipe,
                private translate: TranslateService,
                public accountBalanceService: AccountBalanceService,
                public changeDetector :ChangeDetectorRef) {
        this.changePeriod(this.actionsCashFlow[1]);
        this.language = this.translate.currentLang;
        this.translate.onLangChange.subscribe((lang: any) => {
            this.language = lang.lang;
            this.accounts[0].fullAccountNumber = this.language == 'en' ? "All Accounts" : "جميع الحسابات"
        })
    }

    ngOnChanges(): void {
        if (this.accounts && this.totalBalance) {
            const allAccounts = [];
            const allAccountRecord: any = {};

            this.addAccountsCurrencies(this.accounts)

            allAccountRecord.fullAccountNumber = this.translate.currentLang == 'en' ? "All Accounts" : "جميع الحسابات"
            allAccountRecord.availableBalance = this.currenciesList.find((currencyObj: any) => currencyObj.currency == '608').totalBalance
            allAccountRecord.currency = "608";
            allAccounts.push(allAccountRecord);
            allAccounts.push(...this.accounts);
            this.accounts = allAccounts;
        }
    }

    changePeriod(period) {

        this.selectedPeriodIndex = period.id - 1
        this.bfmBaseRequest = new BfmBaseRequest();
        this.bfmBaseRequest.currency = (this.selectedCurrency) ? this.selectedCurrency : "SAR";
        this.bfmBaseRequest.periodType = period.id;
        this.bfmBaseRequest.IBAN = (this.selectedAccountIBAN) ? this.selectedAccountIBAN : null;
        this.showExpensesAndDashboardAnalytics = true;
        this.showActualIncomeAndExpenseAnalytics = true
        switch (period.id) {
        case 1:
            this.getCashFlowExpenseAndIncomeDetails();
            this.showActualIncomeAndExpenseAnalytics = false
            break;
        case 2:
        case 3:
            if (this.view !== Views.DEFAULT) {
                this.getIncomeAndExpenseViews();
            } else {
                this.getCashFlowExpenseAndIncomeDetails();
            }
            if (this.selectedPeriodIndex == 2) {
                this.showExpensesAndDashboardAnalytics = false;
            }
            this.showActualIncomeAndExpenseAnalytics = true
            break
        default:
            break;
        }
    }

    getIncomeAndExpenseViews() {
        this.getTopSixCategories();
        this.getTopFiveCategories();

        if (this.view === Views.INCOME || this.view === Views.SUB_INCOME) {
            this.getTopPOSByLocation();
        }
        if (this.view === Views.SUB_INCOME || this.view === Views.SUB_EXPENSES) {
            this.getTopSubCategory(this.selectedSubCategory, true)
        }
    }

    getCashFlowExpenseAndIncomeDetails() {
        this.getActualExpectedIncomeAndExpense();

        if (this.selectedPeriodIndex == 1) {
            this.getTodayExpectedIncomeAndExpense()
        }
        if (this.selectedPeriodIndex == 2) {
            this.getCurrentMonthExpectedIncomeAndExpense()
        }
        if (this.bfmBaseRequest.periodType != 1) {
            this.getBalanceCashFlowDataSet();
        }
    }

    showDetails() {
        if (this.view === Views.INCOME) {
            this.getTopSixCategories();
            this.getTopFiveCategories();
            this.getTopPOSByLocation();
        } else if (this.view === Views.EXPENSES) {
            this.getTopSixCategories();
            this.getTopFiveCategories();
        }
    }

    getTopSixCategories() {
        const topByCategoryRequest = new TopByCategoryRequest();
        topByCategoryRequest.IBAN = this.selectedAccountIBAN
        topByCategoryRequest.currency = (this.selectedCurrency) ? this.selectedCurrency : "SAR";
        topByCategoryRequest.periodType = this.selectedPeriodIndex + 1
        topByCategoryRequest.noOfCats = 5;
        this.businessFinManagementService.getTopByCategory(topByCategoryRequest).subscribe(
            (res: any) => {
                if (this.view === Views.INCOME) {
                    this.topIncomeByCategoryBarChartData = new ChartRepresentation();
                    this.fetchIncomeBarChartDetails(res)
                } else if (this.view === Views.EXPENSES) {
                    this.topExpenseByCategoryBarChartData = new ChartRepresentation();
                    this.fetchExpensesBarChartDetails(res);
                }
            }
        )
    }

    getTopFiveCategories() {
        const topByCategoryRequest = new TopByCategoryRequest();
        topByCategoryRequest.IBAN = this.selectedAccountIBAN
        topByCategoryRequest.currency = (this.selectedCurrency) ? this.selectedCurrency : "SAR";
        topByCategoryRequest.periodType = this.selectedPeriodIndex + 1
        topByCategoryRequest.noOfCats = 5;
        this.businessFinManagementService.getTopByCategory(topByCategoryRequest).subscribe(
            (res: any) => {
                if (this.view === Views.INCOME) {
                    this.topIncomeDoughnutChartData = new ChartRepresentation();
                    this.fetchIncomeDoughnutChartDetails(res, false);
                } else if (this.view === Views.EXPENSES) {
                    this.topExpenseDoughnutChartData = new ChartRepresentation();
                    this.fetchExpenseDoughnutChartDetails(res, false);
                }
            }
        )
    }

    getTopPOSByLocation() {
        this.topIncomePOSByLocationChartData = new ChartRepresentation()
        const topByCategoryRequest = new POSLocation();
        topByCategoryRequest.IBAN = this.selectedAccountIBAN
        topByCategoryRequest.currency = (this.selectedCurrency) ? this.selectedCurrency : "SAR";
        topByCategoryRequest.periodType = this.selectedPeriodIndex + 1
        topByCategoryRequest.noOfCities = 5;

        this.businessFinManagementService.getPOSLocation(topByCategoryRequest).subscribe(
            (res: any) => {
                this.topIncomePOSByLocationChartData.data = [];
                this.topIncomePOSByLocationChartData.labels = [];
                if ((this.view === Views.INCOME || this.view === Views.SUB_INCOME) && res && res.length > 0) {
                    const dataSet = [];
                    const labels = [];
                    this.totalIncomePOSByLocation = 0;
                    for (const income of res) {
                        dataSet.push(income.total);
                        labels.push(income.city);
                        this.totalIncomePOSByLocation += income.total;
                    }
                    this.topIncomePOSByLocationChartData.data = [{
                        data: dataSet,
                        fill: true,
                        lineTension: 0.1,
                    }]
                    this.topIncomePOSByLocationChartData.labels = labels;
                }
            }
        )
    }

    getTopSubCategory(category: string, force = false) {
        if(category) {
            if (this.view < 4 || force) {
                this.selectedSubCategory = category
                const topBySubCategoryRequest = new TopBySubCategoryRequest()
                topBySubCategoryRequest.codes = category
                topBySubCategoryRequest.noOfSubCats = 5
                topBySubCategoryRequest.currency = (this.selectedCurrency) ? this.selectedCurrency : "SAR";
                topBySubCategoryRequest.periodType = this.selectedPeriodIndex + 1

                this.businessFinManagementService.getTopSubCategory(topBySubCategoryRequest).subscribe((res) => {
                    if (this.view === Views.INCOME || this.view === Views.SUB_INCOME) {
                        this.topIncomeDoughnutChartData = new ChartRepresentation();
                        this.topIncomeByCategoryBarChartData = new ChartRepresentation();
                        this.fetchIncomeDoughnutChartDetails(res, true);
                        this.fetchIncomeBarChartDetails(res, true)
                        this.view = 4
                    } else if (this.view === Views.EXPENSES || this.view === Views.SUB_EXPENSES) {
                        this.topExpenseDoughnutChartData = new ChartRepresentation();
                        this.fetchExpenseDoughnutChartDetails(res, true);
                        this.fetchExpensesBarChartDetails(res, true)
                        this.view = 5
                    }
                })
            }
        }
    }

    getActualExpectedIncomeAndExpense() {
        this.businessFinManagementService.getActualAndExpected(this.bfmBaseRequest).subscribe((res: any) => {
            this.actualExpenseCurrency = res.actual.expense.currency;
            this.actualIncomeCurrency = res.actual.income.currency;
            this.actualExpenseAmount = res.actual.expense.total;
            this.actualIncomeAmount = res.actual.income.total;
            this.expectedExpenseCurrency = res.expected.expense?.currency;
            this.expectedIncomeCurrency = res.expected.income?.currency;
            this.expectedExpenseAmount = res.expected.expense?.total;
            this.expectedIncomeAmount = res.expected.income?.total;
        });
    }


    getTodayExpectedIncomeAndExpense() {
        const bfmRequest = {...this.bfmBaseRequest};
        bfmRequest.periodType = 1
        this.businessFinManagementService.getActualAndExpected(bfmRequest).subscribe((res: any) => {
            this.expectedTodayExpenseAmount = res.expected.expense?.total;
            this.expectedTodayIncomeAmount = res.expected.income?.total;
        });
    }

    getBalanceCashFlowDataSet() {
        this.businessFinManagementService.getBalanceAndCashFlow(this.bfmBaseRequest).subscribe((res: any) => {
            this.fetchCashFlowDataset(res.cashFlow)
            this.fetchBalanceDataset(res.balance)
        });
    }

    fetchIncomeBarChartDetails(res: any, isSubCategory = false) {
        if (res && res.income && res.income.length > 0) {
            const dataSet = [];
            const labels = [];
            for (const income of res.income) {
                dataSet.push({x: isSubCategory ? income.subCategoryName : income.categoryName, y: income.total});
                labels.push(isSubCategory ? income.subCategoryName : income.categoryName);
            }

            this.topIncomeByCategoryBarChartData.data = [{
                label: "Income By Category",
                barThickness: 30,
                maxBarThickness: 60,
                minBarLength: 10,
                hoverBackgroundColor: 'rgba(0,0,0)',
                data: dataSet,
                type: 'bar'
            }];

            this.topIncomeByCategoryBarChartData.labels = labels;
        }
    }


    getCurrentMonthExpectedIncomeAndExpense() {
        const bfmRequest = {...this.bfmBaseRequest};
        bfmRequest.periodType = 2
        this.businessFinManagementService.getActualAndExpected(bfmRequest).subscribe((res: any) => {
            this.expectedCurrentMonthExpenseAmount = res.expected.expense?.total;
            this.expectedCurrentMonthIncomeAmount = res.expected.income?.total;
        });
    }

    fetchIncomeDoughnutChartDetails(res: any, isSubCategory = false) {
        if (res && res.income && res.income?.length > 0) {
            const dataSet = [];
            const labels = [];
            this.totalIncomeDoughnutChart = 0;
            for (const income of res.income) {
                dataSet.push(income.total);
                labels.push(isSubCategory ? income.subCategoryName : income.categoryName);

                if (isSubCategory) {
                    this.topIncomeCategories.clear()
                } else {
                    this.topIncomeCategories.set(income.categoryName, income.codes)
                }

                this.totalIncomeDoughnutChart += income.total;
            }
            this.topIncomeDoughnutChartData.data = [{
                hidden: false,
                data: dataSet,
                fill: true,
                lineTension: 0.1,
            }]
            this.topIncomeDoughnutChartData.labels = labels;
        }
    }

    fetchExpensesBarChartDetails(res: any, isSubCategory = false) {
        this.topExpenseByCategoryBarChartData = new ChartRepresentation();
        const dataSet = [];
        const labels = [];
        for (const expense of res.expense) {
            dataSet.push({
                x: isSubCategory ? expense.subCategoryName : expense.categoryName,
                y: expense.total < 0 ? (-1 * expense.total) : expense.total
            });
            labels.push(isSubCategory ? expense.subCategoryName : expense.categoryName);
        }
        this.topExpenseByCategoryBarChartData.data = [{
            label: "Expense By Category",
            barThickness: 30,
            maxBarThickness: 60,
            minBarLength: 15,
            hoverBackgroundColor: 'rgba(0,0,0)',
            data: dataSet,
            type: 'bar'
        }]
        this.topExpenseByCategoryBarChartData.labels = labels;
    }

    fetchExpenseDoughnutChartDetails(res: any, isSubCategory = false) {
        const dataSet = [];
        const labels = [];
        this.totalExpenseByCategory = 0;
        for (const expense of res.expense) {
            dataSet.push(expense.total < 0 ? (-1 * expense.total) : expense.total);
            labels.push(isSubCategory ? expense.subCategoryName : expense.categoryName);
            if (isSubCategory) {
                this.topExpenseCategories.clear()
            } else {
                this.topExpenseCategories.set(expense.categoryName, expense.codes)
            }

            this.totalExpenseByCategory += expense.total;
        }
        this.topExpenseDoughnutChartData.data = [{
            data: dataSet,
            fill: true,
            hidden: false,
            lineTension: 0.1
        }]
        this.topExpenseDoughnutChartData.labels = labels;
    }

    isTabActive(tabId) {
        return this.activeTab == tabId
    }

    changeView($event) {
        if ($event === Views.INCOME) {
            this.view = Views.INCOME;
            this.showDetails()
        } else if ($event === Views.EXPENSES) {
            this.view = Views.EXPENSES;
            this.showDetails()
        } else {
            this.view = Views.DEFAULT;
            this.getCashFlowExpenseAndIncomeDetails();
        }
    }

    navigateToMainDashboard() {
        switch (this.view) {
        case 4:
            this.changeView(1)
            break
        case 5:
            this.changeView(2)
            break
        default:
            this.view = 3;
            this.changePeriod(this.actionsCashFlow[this.selectedPeriodIndex]);
        }
    }

    changeColorEvent(index) {
        return this.selectedCurrencyIndex === index;
    }

    getFormattedDate(date) {
        const year = date.substring(6, 10);
        const month = parseInt(date.substring(3, 5), 10);
        const day = date.substring(0, 2);
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        return day + "/" + String(month);
    }

    changeCurrency(currency, index) {
        this.selectedCurrencyIndex = index;
        if (index === 0) {
            this.selectedCurrency = null;
        } else {
            this.selectedCurrency = this.modelPipe.transform('currencyIso', currency);
        }
        this.accounts[0].currency = currency
        this.accounts[0].availableBalance = this.currenciesList[index].totalBalance
        this.changePeriod(this.actionsCashFlow[this.selectedPeriodIndex]);
    }

    onAccountChange(account: Account) {
        this.selectedAccount = account;
        // @ts-ignore
        if (account.fullAccountNumber !== "All Accounts" && account.fullAccountNumber !== "جميع الحسابات") {
            this.selectedAccountIBAN = account.ibanNumber;
            this.selectedCurrency = this.modelPipe.transform('currencyIso', account.currency.toString());
        } else {
            this.selectedAccountIBAN = null;
        }
        this.changePeriod(this.actionsCashFlow[this.selectedPeriodIndex]);
    }

    getAccounts() {
        if (!this.loadedAllAccounts) {
            this.accountBalanceService
                .getUserAccounts('', '', ++this.accountsListOffset, HOME_PAGE_SIZE, 'ECAL')
                .subscribe((pagedData) => {
                    if (this.accounts.length < pagedData.page.totalElements) {

                        this.accounts.push(...pagedData.data)
                        this.addAccountsCurrencies(pagedData.data)
                        this.accounts[0].availableBalance = this.currenciesList[this.selectedCurrencyIndex].totalBalance

                        if (this.accounts.length >= pagedData.page.totalElements) {
                            this.loadedAllAccounts = true
                        }
                    }
                })
        }
    }

    doesCurrencyExist(currency: string): boolean {

        for (let i = 0; i < this.currenciesList.length; i++) {
            if (this.currenciesList[i].currency == currency) {
                return true
            }
        }

        return false
    }

    addAccountsCurrencies(accounts: Account[]) {
        for (const account of accounts) {
            if (!this.doesCurrencyExist(account.currency)) {

                this.currenciesList.push({
                    currency: account.currency,
                    totalBalance: account.availableBalance
                });
            } else {
                this.currenciesList[
                    this.currenciesList.findIndex((currencyObj) => currencyObj.currency == account.currency)
                ]
                    .totalBalance += account.availableBalance
            }
        }
    }

    isAllAccountsSelected(): boolean {
        return this.selectedAccount?.fullAccountNumber == "All Accounts" || this.selectedAccount?.fullAccountNumber == "جميع الحسابات"
    }

    fetchCashFlowDataset(res) {
        this.cashOverFlowChartData = new ChartRepresentation();
        this.cashOverFlowChartData.labels = []
        this.cashFlowIncomeDataSet = [];
        this.cashFlowActualDataSet = [];
        const colorIncome = [];
        const colorExpense = [];
        this.cashFlowIncomeDataSet = [];
        this.cashFlowExpenseDataSet = [];
        if(res.length>0) {
            let expectedExpense = [{x: res[res.length - 1].dateTime, y: this.expectedExpenseAmount}]
            let expectedIncome = [{x: res[res.length - 1].dateTime, y: this.expectedIncomeAmount}]

            if (this.selectedPeriodIndex == 1) {
                expectedExpense = [{x: res[res.length - 1].dateTime, y: this.expectedTodayExpenseAmount}]
                expectedIncome = [{x: res[res.length - 1].dateTime, y: this.expectedTodayIncomeAmount}]
            }

            if (this.selectedPeriodIndex == 2) {
                expectedExpense = [{x: res[res.length - 1].dateTime, y: this.expectedCurrentMonthExpenseAmount}]
                expectedIncome = [{x: res[res.length - 1].dateTime, y: this.expectedCurrentMonthIncomeAmount}]
            }

            for (const item of res) {
                this.cashOverFlowChartData.labels.push(item.dateTime)
                this.cashFlowIncomeDataSet.push({x: item.dateTime, y: item.totalIncome});
                this.cashFlowExpenseDataSet.push({x: item.dateTime, y: item.totalExpense});
                colorIncome.push('rgba(59,130,246,0.93)');
                colorExpense.push('rgba(239,68,68,0.87)');
                this.cashFlowActualDataSet.push({x: item.dateTime, y: item.cashFlow})
            }
            this.cashOverFlowChartData.data =
                [{
                    label: this.translate.instant('bfm.INCOME'),
                    barThickness: 25,
                    maxBarThickness: 30,
                    minBarLength: 10,
                    backgroundColor: colorIncome,
                    hoverBackgroundColor: 'rgb(0,0,0)',
                    data: this.cashFlowIncomeDataSet,
                    order: 2
                },
                {
                    label: this.translate.instant('bfm.EXPENSES'),
                    barThickness: 25,
                    maxBarThickness: 30,
                    minBarLength: 10,
                    backgroundColor: colorExpense,
                    hoverBackgroundColor: 'rgb(0,0,0)',
                    data: this.cashFlowExpenseDataSet,
                    order: 2
                },
                {
                    label: this.translate.instant('bfm.ACTUAL-CASH-FLOW'),
                    barThickness: 25,
                    maxBarThickness: 30,
                    minBarLength: 10,
                    pointHoverRadius: 6,
                    data: this.cashFlowActualDataSet,
                    backgroundColor: ['rgb(0,0,0)'],
                    hoverBackgroundColor: 'rgb(0,0,0)',
                    order: 1,
                    borderWidth: 2,
                    type: "line"
                },
                {
                    label: this.translate.instant('bfm.EXPECTED-INCOME'),
                    barThickness: 25,
                    maxBarThickness: 30,
                    minBarLength: 10,
                    backgroundColor: 'rgba(59,130,246,0.37)',
                    hoverBackgroundColor: 'rgb(0,0,0)',
                    data: expectedIncome
                },
                {
                    label: this.translate.instant('bfm.EXPECTED-EXPENSE'),
                    barThickness: 25,
                    maxBarThickness: 30,
                    minBarLength: 10,
                    backgroundColor: 'rgba(239,68,68,0.42)',
                    hoverBackgroundColor: 'rgb(0,0,0)',
                    data: expectedExpense
                }
                ]
        }
    }

    fetchBalanceDataset(res) {
        this.availableBalanceChartData = new ChartRepresentation();
        this.availableBalanceChartData.labels = [];
        this.availableBalanceDates = [];
        this.availableBalanceList = [];
        if(res.length>0) {
            for (const item of res) {
                this.availableBalanceDates.push(item.lasTransactionTime);
                this.availableBalanceList.push({x: item.lasTransactionTime, y: item['balance']});
            }
            this.availableBalanceChartData.data = [{
                label: 'AVAILABLE BALANCE',
                data: this.availableBalanceList,
                lineTension: 0.4,
                cubicInterpolationMode: 'monotone',
                backgroundColor: ['rgba(166, 185, 255, 1)'],
                borderColor: ['rgba(77, 114, 255, 1)'],
                pointBorderColor: 'rgba(0, 0, 0, 0)',
                pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                pointHoverBackgroundColor: 'rgba(77, 114, 255, 1)',
                pointHoverBorderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 1
            }
            ];
            this.availableBalanceChartData.labels = this.availableBalanceDates;
        }
    }

    ngAfterViewInit(): void {
        this.changeDetector.detectChanges();
    }
}


// eslint-disable-next-line no-shadow
enum Views {
    INCOME = 1,
    EXPENSES = 2,
    DEFAULT = 3,
    SUB_INCOME = 4,
    SUB_EXPENSES = 5
}