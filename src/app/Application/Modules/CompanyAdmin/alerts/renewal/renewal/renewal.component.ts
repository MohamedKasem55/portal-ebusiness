import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DatatableMobileComponent} from "../../../../../../core/responsive/datatable-mobile.component";
import {DatatableComponent} from "@swimlane/ngx-datatable";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {CompanyAdminAlertsService} from "../../../Services/company-admin-alert.service";
import {SelectedUserRenewalAlertDataService} from "../../../Services/selected-user-renewal-alert-data-service";
import {TranslateService} from "@ngx-translate/core";
import {CompanyAdminAccountsService} from "../../../Services/company-admin-account.service";
import {Exception} from "../../../../../Model/exception";

@Component({
    selector: 'app-renewal',
    templateUrl: './renewal.component.html',
    styleUrls: ['./renewal.component.scss']
})
export class RenewalComponent
    extends DatatableMobileComponent
    implements OnInit, OnDestroy {
    @ViewChild('userAlertTable', {static: true})
    userAlertTable: DatatableComponent

    form: FormGroup
    datos: any
    userAlerts: any[]
    accounts: any[]
    pageSizeAlert: any

    subscriptions: Subscription[] = []
    messageError: any = {}
    tableSelectedRows: any = []

    model: any = {}
    isCollapsedContent = true
    bsConfig: any
    today = new Date()
    selectAllOnPage: any = []

    search() {
        const aux = []
        for (let i = 0; i < this.datos.reportList.length; ++i) {
            if (this.filter(this.datos.reportList[i])) {
                aux.push(this.datos.reportList[i])
            }
        }
        this.userAlerts = []
        this.userAlerts.push(...aux)
        // this.selectRows(this.findUser(this.tableSelectedRows));
    }

    getAllTables(): any[] {
        const tablas = []
        tablas.push(this.table)
        return tablas
    }

    isEmpty(val) {
        return typeof val == 'undefined' || val == null || val.length <= 0
    }

    filter(user) {
        return (
            (!this.model.userId ||
                this.model.userId == '' ||
                (user.userId && user.userId.indexOf(this.model.userId) != -1)) &&
            (!this.model.userName ||
                this.model.userName == '' ||
                (user.userName && user.userName.indexOf(this.model.userName) != -1)) &&
            (!this.model.mobileNumber ||
                this.model.mobileNumber == '' ||
                (user.mobileNumber &&
                    user.mobileNumber.indexOf(this.model.mobileNumber) != -1)) &&
            (!this.model.maxSMSCountFrom ||
                (!this.isEmpty(user.maxSmsCount) &&
                    +user.maxSmsCount >= +this.model.maxSMSCountFrom)) &&
            (!this.model.maxSMSCountTo ||
                (!this.isEmpty(user.maxSmsCount) &&
                    +user.maxSmsCount <= +this.model.maxSMSCountTo)) &&
            (!this.model.SMSReachedFrom ||
                (!this.isEmpty(user.smsReached) &&
                    +user.smsReached >= +this.model.SMSReachedFrom)) &&
            (!this.model.SMSReachedTo ||
                (!this.isEmpty(user.smsReached) &&
                    +user.smsReached <= +this.model.SMSReachedTo)) &&
            (!this.model.expiryDateFrom ||
                (user.expiryDate &&
                    new Date(user.expiryDate).getTime() >=
                    this.model.expiryDateFrom.setHours(0, 0, 0, 0))) &&
            (!this.model.expiryDateTo ||
                (user.expiryDate &&
                    new Date(user.expiryDate).getTime() <=
                    this.model.expiryDateTo.setHours(23, 59, 0, 0)))
        )
    }

    clearModel() {
        this.model.userId = ''
        this.model.userName = ''
        this.model.mobileNumber = ''
        this.model.maxSMSCountFrom = null
        this.model.maxSMSCountTo = null
        this.model.SMSReachedFrom = null
        this.model.SMSReachedTo = null
        this.model.expiryDateFrom = null
        this.model.expiryDateTo = null
    }

    getMaxDateToday(date) {
        return date ? date : this.today
    }

    getMaxDate(date) {
        return date ? date : null
    }

    reset() {
        this.clearModel()
        this.userAlerts = []
        this.userAlerts.push(...this.datos.reportList)
        //this.selectRows(this.findUser(this.tableSelectedRows));
    }

    findUser(users) {
        const rows = []
        let selected = false
        for (let i = 0; i < users.length; ++i) {
            selected = false
            for (let j = 0; j < this.userAlerts.length; ++j) {
                if (users[i].userId === this.userAlerts[j].userId) {
                    rows.push(this.userAlerts[j])
                    selected = true
                    break
                }
            }
            if (!selected) {
                rows.push(users[i])
            }
        }
        return rows
    }

    constructor(
        public fb: FormBuilder,
        public router: Router,
        public service: CompanyAdminAlertsService,
        public serviceData: SelectedUserRenewalAlertDataService,
        public translate: TranslateService,
        private caAccountService: CompanyAdminAccountsService,
    ) {
        super()
        this.form = this.fb.group({
            account: ['', Validators.required],
        })
        this.initElements()
    }

    initElements() {
        this.accounts = []
        this.userAlerts = []
        this.pageSizeAlert = 10
    }

    setPageSize(event) {
        this.pageSizeAlert = event.target.value
    }

    ngOnInit() {
        super.ngOnInit()
        this.bsConfig = Object.assign(
            {},
            {containerClass: 'theme-dark-blue'},
            {dateInputFormat: 'DD/MM/YYYY'},
        )
        this.messageError = {}
        this.subscriptions.push(
            this.caAccountService.getAllAccounts().subscribe((result) => {
                this.accounts = []
                this.accounts = this.extractAccountKeyValue(result)
                if (this.accounts.length >= 1) {
                    this.form.controls.account.setValue(this.accounts[0].key)
                }
            }),
        )
        this.subscriptions.push(
            this.service.renewalList().subscribe((result) => {
                if (result instanceof Exception) {
                    const res = <any>result
                    //console.log(res.error);
                    this.messageError['code'] = res.error.errorCode
                    this.messageError['description'] = res.error.errorDescription
                    return
                } else {
                    this.messageError = {}
                    // this.accounts = [];
                    this.userAlerts = []
                    this.datos = result
                    this.userAlerts.push(...this.datos.reportList)
                    if (this.serviceData.getUsers()) {
                        //this.selectRows(this.findUser(this.serviceData.getUsers()));
                        //this.serviceData.clear()
                    }
                }
            }),
        )

        if (
            this.serviceData.getUsers() &&
            typeof this.serviceData.getUsers() != 'undefined' &&
            this.serviceData.getUsers().length > 0
        ) {
            this.tableSelectedRows = this.serviceData.getUsers()
        } else {
            this.tableSelectedRows = []
        }
    }

    onSelect({selected}) {
        //console.log('Select Event', selected, this.tableSelectedRows);
        this.selectAllOnPage[this.userAlertTable.offset] = false
        this.tableSelectedRows.splice(0, this.tableSelectedRows.length)
        this.tableSelectedRows.push(...selected)
    }

    getId(row) {
        return row['userId']
    }

    getIdFunction() {
        return this.getId.bind(this)
    }

    // selectRows(rows: any[]){
    //   this.tableSelectedRows.splice(0,rows.length);
    //   this.tableSelectedRows.push(...rows);
    // }

    extractAccountKeyValue(account: any) {
        const accountKeyValue = []
        for (let i = 0; account.length > i; i++) {
            accountKeyValue.push({key: i, value: account[i]})
        }
        return accountKeyValue
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub: Subscription) => {
            sub.unsubscribe()
        })
        this.subscriptions = []
    }

    isValid() {
        return this.form.valid && this.tableSelectedRows.length > 0
    }

    sumary() {
        this.serviceData.setUsers(this.tableSelectedRows)
        this.serviceData.setAccount(this.accounts[this.form.value.account])
        this.router.navigate(['/companyadmin/alerts/renewal/renewal2'])
    }

    selectAll(event) {
        const currentTablePageData = this.userAlertTable.bodyComponent.rowIndexes
        const currentTablePageDataList = []
        currentTablePageData.forEach(function (key, val) {
            currentTablePageDataList.push(val)
        })
        if (!this.selectAllOnPage[this.userAlertTable.offset]) {
            // Unselect all so we dont get duplicates.
            if (this.tableSelectedRows.length > 0) {
                currentTablePageDataList.map((alters) => {
                    this.tableSelectedRows = this.tableSelectedRows.filter(
                        (selected) => this.getId(selected) !== this.getId(alters),
                    )
                })
            }
            // Select all again
            this.tableSelectedRows.push(...currentTablePageDataList)
            this.selectAllOnPage[this.userAlertTable.offset] = true
            // console.log('-----------Select All----');
            // console.log(this.tableSelectedRows);
        } else {
            // Unselect all
            currentTablePageDataList.map((alters) => {
                this.tableSelectedRows = this.tableSelectedRows.filter(
                    (selected) => this.getId(selected) !== this.getId(alters),
                )
            })
            this.selectAllOnPage[this.userAlertTable.offset] = false
            // console.log('-----------UnSelect All');
            // console.log(this.tableSelectedRows);
        }
    }
}
