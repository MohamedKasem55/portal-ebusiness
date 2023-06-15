import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DatatableMobileComponent} from "../../../../../../core/responsive/datatable-mobile.component";
import {DatatableComponent} from "@swimlane/ngx-datatable";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subject, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {CompanyAdminAlertsService} from "../../../Services/company-admin-alert.service";
import {SelectedUserAlertDataService} from "../../../Services/selected-user-alert-data-service";
import {TranslateService} from "@ngx-translate/core";
import {CompanyAdminAccountsService} from "../../../Services/company-admin-account.service";
import {Exception} from "../../../../../Model/exception";
import {SimpleMQ} from "ng2-simple-mq";

@Component({
    selector: 'app-alerts-registration',
    templateUrl: './alerts-registration.component.html',
    styleUrls: ['./alerts-registration.component.scss']
})
export class AlertsRegistrationComponent extends DatatableMobileComponent
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
    selectAllOnPage: any = []
    model: any = {}
    isCollapsedContent = true
    isSolePropertyAdmin = null;
    formRadio: FormGroup;
    selectedAdmin: any;

    constructor(
        public fb: FormBuilder,
        public fbRadio: FormBuilder,
        public router: Router,
        public service: CompanyAdminAlertsService,
        public serviceData: SelectedUserAlertDataService,
        public translate: TranslateService,
        private caAccountService: CompanyAdminAccountsService,
        private smq: SimpleMQ
    ) {
        super()

        this.serviceData.clear();
        this.initializePreRequisites();

        this.initElements()
    }

    search() {
        const aux = []
        for (let i = 0; i < this.datos.reportList.length; ++i) {
            if (this.filter(this.datos.reportList[i])) {
                aux.push(this.datos.reportList[i])
            }
        }
        this.userAlerts = []
        this.userAlerts.push(...aux)
    }

    getAllTables(): any[] {
        const tablas = []
        tablas.push(this.table)
        return tablas
    }

    filter(user) {
        //console.log(this.model);
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
                    user.mobileNumber.indexOf(this.model.mobileNumber) != -1))
        )
    }

    clearModel() {
        this.model.userId = ''
        this.model.userName = ''
        this.model.mobileNumber = ''
    }

    reset() {
        this.clearModel()
        this.userAlerts = []
        this.userAlerts.push(...this.datos.reportList)
        //this.selectRows(this.findUser(this.tableSelectedRows));
    }


    initElements() {
        this.accounts = []
        this.userAlerts = []
        this.pageSizeAlert = 10
    }

    setPageSize(event: any) {
        this.pageSizeAlert = +event.target.value
        this.table.offset = 0
        this.table.recalculate()
    }

    ngOnInit() {
        super.ngOnInit()
    }

    initializePreRequisites() {
        this.smq.publish('loader-mq', true);
        this.messageError = {}
        this.subscriptions.push(
            this.caAccountService.getAllAccounts().subscribe((result) => {
                this.accounts = []
                this.accounts = this.extractAccountKeyValue(result)

            }), this.service.isSolePropertyAdmin().subscribe((res: any) => {
                this.isSolePropertyAdmin = res.soleProperty;
                this.selectedAdmin = res.user;
                this.serviceData.setSoleProperty(!!(this.isSolePropertyAdmin && this.selectedAdmin));

            })
        )
        this.subscriptions.push(
            this.service.registrationList().subscribe((result) => {
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
                    // this.accounts = [];
                    this.userAlerts = []
                    this.datos = result
                    this.userAlerts.push(...this.datos.reportList)
                }
                this.smq.publish('loader-mq', false);
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
        this.formRadio = this.fbRadio.group({
            operationType: ['', Validators.required],
        })
        this.form = this.fb.group({
            account: ['', Validators.required],
        })
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

    onSelect(event): void {
        if (!event.selected) {
            return
        }
        this.selectAllOnPage[this.userAlertTable?.offset] = false
        this.tableSelectedRows.splice(0, this.tableSelectedRows.length)
        this.tableSelectedRows.push(...event.selected)
    }

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
        return (
            this.form.valid &&
            this.tableSelectedRows.length > 0 &&
            this.hasNoErrorSelected()
        )
    }

    hasNoErrorSelected() {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.tableSelectedRows.length; i++) {
            if (this.tableSelectedRows[i]['error']) {
                return false
            }
        }
        return true
    }

    sumary() {
        this.serviceData.setUsers(this.tableSelectedRows)
        this.serviceData.setAccount(this.accounts[this.form.value.account])
        this.router.navigate(['/companyadmin/alerts/registration/registration2'])
    }

    getId(row) {
        return row['userId']
    }

    getIdFunction() {
        return this.getId.bind(this)
    }

    updateRowMobile(event, row, rowIndex): void {
        const pattArabian = new RegExp('^\\+966[1-9][0-9]{8}$')
        const pattLocal = new RegExp('^05[0-9]{8}$')
        const pattMobile = new RegExp('^\\+([0-9]){6,19}[0-9]$')

        if (
            (event.target.value.startsWith('+966') &&
                !pattArabian.test(event.target.value)) ||
            (!event.target.value.startsWith('+966') &&
                !event.target.value.startsWith('05') &&
                !pattMobile.test(event.target.value)) ||
            (event.target.value.startsWith('05') &&
                !pattLocal.test(event.target.value))
        ) {
            this.userAlerts[rowIndex]['error'] = true
        } else {
            delete this.userAlerts[rowIndex]['error']
        }

        this.userAlerts[rowIndex]['mobileNumber'] = event.target.value
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
            this.tableSelectedRows.push(...currentTablePageDataList)
            this.selectAllOnPage[this.userAlertTable.offset] = true
        } else {
            currentTablePageDataList.map((alters) => {
                this.tableSelectedRows = this.tableSelectedRows.filter(
                    (selected) => this.getId(selected) !== this.getId(alters),
                )
            })
            this.selectAllOnPage[this.userAlertTable.offset] = false
        }
        console.log(this.tableSelectedRows)
    }

    cancel() {
        this.router.navigate(['/companyadmin/alerts'])
    }

    checkOperationType() {
        const operationType = this.formRadio.value.operationType;
        if (operationType === 'companyUsers') {
            this.isSolePropertyAdmin = false;
            this.selectedAdmin = null;
        } else {
            this.serviceData.setAccount(this.accounts[0]);
            this.serviceData.setUsers([this.selectedAdmin]);
            this.router.navigate(['/companyadmin/alerts/registration/registration2'])
        }
    }
}
