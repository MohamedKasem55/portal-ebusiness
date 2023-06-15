import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DatatableMobileComponent} from "../../../../../../core/responsive/datatable-mobile.component";
import {DatatableComponent} from "@swimlane/ngx-datatable";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {CompanyAdminAlertsService} from "../../../Services/company-admin-alert.service";
import {SelectedUserDesactivateAlertDataService} from "../../../Services/selected-user-desactivate-alert-data-service";
import {TranslateService} from "@ngx-translate/core";
import {Exception} from "../../../../../Model/exception";

@Component({
    selector: 'app-de-activate',
    templateUrl: './de-activate.component.html',
    styleUrls: ['./de-activate.component.scss']
})
export class DeActivateComponent
    extends DatatableMobileComponent
    implements OnInit, OnDestroy {
    @ViewChild('userAlertTable', {static: true})
    userAlertTable: DatatableComponent

    form: FormGroup
    datos: any
    userAlerts: any[]
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
        this.tableSelectedRows = []
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
            (!this.model.expiryDateFrom ||
                (user.expiryDate &&
                    new Date(user.expiryDate).getTime() >=
                    this.model.expiryDateFrom.setHours(0, 0, 0, 0))) &&
            (!this.model.expiryDateTo ||
                (user.expiryDate &&
                    new Date(user.expiryDate).getTime() <=
                    this.model.expiryDateTo.setHours(23, 59, 0, 0))) &&
            (!this.model.registrationDateFrom ||
                (user.registrationDate &&
                    new Date(user.registrationDate).getTime() >=
                    this.model.registrationDateFrom.setHours(0, 0, 0, 0))) &&
            (!this.model.registrationDateTo ||
                (user.registrationDate &&
                    new Date(user.registrationDate).getTime() <=
                    this.model.registrationDateTo.setHours(23, 59, 0, 0))) &&
            (!this.model.renewalDateFrom ||
                (user.renewalDate &&
                    new Date(user.renewalDate).getTime() >=
                    this.model.renewalDateFrom.setHours(0, 0, 0, 0))) &&
            (!this.model.renewalDateTo ||
                (user.renewalDate &&
                    new Date(user.renewalDate).getTime() <=
                    this.model.renewalDateTo.setHours(23, 59, 0, 0)))
        )
    }

    clearModel() {
        this.model.userId = ''
        this.model.userName = ''
        this.model.mobileNumber = ''
        this.model.expiryDateFrom = null
        this.model.expiryDateTo = null
        this.model.registrationDateFrom = null
        this.model.registrationDateTo = null
        this.model.renewalDateFrom = null
        this.model.renewalDateTo = null
    }

    getMaxDateToday(date) {
        return date ? date : this.today
    }

    getMaxDate(date) {
        return date ? date : null
    }

    reset() {
        this.clearModel()
        this.tableSelectedRows = []
        this.userAlerts = []
        this.userAlerts.push(...this.datos.reportList)
        // this.selectRows(this.findUser(this.tableSelectedRows));
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
        public serviceData: SelectedUserDesactivateAlertDataService,
        public translate: TranslateService,
    ) {
        super()
        this.form = this.fb.group({})
        this.initElements()
    }

    initElements() {
        this.userAlerts = []
        this.pageSizeAlert = 20
    }

    setPageSize(event) {
        //console.log(event.target.value);
        this.pageSizeAlert = event.target.value
    }

    ngOnInit() {
        super.ngOnInit()
        this.bsConfig = Object.assign(
            {},
            {
                showWeekNumbers: false,
                adaptivePosition: true,
                containerClass: 'theme-dark-blue',
                dateInputFormat: 'DD/MM/YYYY',
            },
        )

        //console.log("OnInit");
        this.messageError = {}
        this.subscriptions.push(
            this.service.desactivateList().subscribe((result) => {
                if (
                    result.hasOwnProperty('error') &&
                    (<any>result).error instanceof Exception
                ) {
                    const res = <any>result
                    //console.log(res.error);
                    this.messageError['code'] = res.error.errorCode
                    this.messageError['description'] = res.error.errorDescription
                    return
                } else {
                    this.messageError = {}
                    this.userAlerts = []
                    this.datos = result
                    this.userAlerts.push(...this.datos.reportList)
                    // if(this.serviceData.getUsers()){
                    //   // this.selectRows(this.findUser(this.serviceData.getUsers()));
                    // }
                    // this.serviceData.clear();
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

    // onSelect({ selected }) {
    //     this.tableSelectedRows.splice(0, this.tableSelectedRows.length);
    //     this.tableSelectedRows.push(...selected);
    // }

    onSelect({selected}) {
        // Make sure we are no longer selecting all
        // console.log('---select one---');
        // console.log(this.table.offset);
        this.selectAllOnPage[this.userAlertTable.offset] = false

        this.tableSelectedRows.splice(0, this.tableSelectedRows.length)
        this.tableSelectedRows.push(...selected)
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
                currentTablePageDataList.map((alerts) => {
                    this.tableSelectedRows = this.tableSelectedRows.filter(
                        (selected) => this.getId(selected) !== this.getId(alerts),
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
            currentTablePageDataList.map((alerts) => {
                this.tableSelectedRows = this.tableSelectedRows.filter(
                    (selected) => this.getId(selected) !== this.getId(alerts),
                )
            })
            this.selectAllOnPage[this.userAlertTable.offset] = false
            // console.log('-----------UnSelect All');
            // console.log(this.tableSelectedRows)
        }
        //console.log('Select Event',  this.tableSelectedRows);
    }

    selectRows(rows: any[]) {
        this.tableSelectedRows.splice(0, rows.length)
        this.tableSelectedRows.push(...rows)
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub: Subscription) => {
            sub.unsubscribe()
        })
        this.subscriptions = []
    }

    isValid() {
        return this.tableSelectedRows.length > 0
    }

    sumary() {
        this.serviceData.setUsers(this.tableSelectedRows);
        this.router.navigate(['/companyadmin/alerts/desactivate/desactivate2']);
    }

    isChecked(value) {
        return value == 'Y'
    }

    getId(row) {
        return row['userId']
    }

    getIdFunction() {
        return this.getId.bind(this)
    }
}
