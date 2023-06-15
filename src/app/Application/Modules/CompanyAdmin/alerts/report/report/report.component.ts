import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DatatableMobileComponent} from "../../../../../../core/responsive/datatable-mobile.component";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {CompanyAdminAlertsService} from "../../../Services/company-admin-alert.service";
import {TranslateService} from "@ngx-translate/core";
import {Exception} from "../../../../../Model/exception";

@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss']
})
export class ReportComponent
    extends DatatableMobileComponent
    implements OnInit, OnDestroy {
    @ViewChild('userAlertTable', {static: true}) table: any

    form: FormGroup
    datos: any
    userAlerts: any[]
    pageSizeAlert: any

    subscriptions: Subscription[] = []
    messageError: any = {}

    model: any = {}
    isCollapsedContent = true
    bsConfig: any
    today = new Date()

    search(): void {
        const aux = []

        for (let report of this.datos.reportList) {
            if (this.filter(report)) aux.push(report)
        }

        this.userAlerts = aux
    }

    getAllTables(): any[] {
        const tablas = []
        tablas.push(this.table)
        return tablas
    }

    filter(user): boolean {
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
                (user.maxSmsCount &&
                    +user.maxSmsCount >= +this.model.maxSMSCountFrom)) &&
            (!this.model.maxSMSCountTo ||
                (user.maxSmsCount && +user.maxSmsCount <= +this.model.maxSMSCountTo)) &&
            (!this.model.SMSReachedFrom ||
                (typeof user.smsReached == 'number' &&
                    +user.smsReached >= +this.model.SMSReachedFrom)) &&
            (!this.model.SMSReachedTo ||
                (typeof user.smsReached == 'number' &&
                    +user.smsReached <= +this.model.SMSReachedTo)) &&
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
                    this.model.registrationDateTo.setHours(23, 59, 0, 0)))
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
        this.model.registrationDateFrom = null
        this.model.registrationDateTo = null
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
    }

    constructor(
        public fb: FormBuilder,
        public router: Router,
        public service: CompanyAdminAlertsService,
        public translate: TranslateService,
    ) {
        super()
        this.form = this.fb.group({
            feeAmountEachReg: [{value: '', disabled: true}],
            maxSmsEachReg: [{value: '', disabled: true}],
        })
        this.initElements()
    }

    initElements() {
        this.userAlerts = []
        this.pageSizeAlert = 20
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
        this.messageError = {}
        this.subscriptions.push(
            this.service.reportsList().subscribe((result) => {
                if (result instanceof Exception) {
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
                    this.form.controls.feeAmountEachReg.patchValue(
                        this.datos.feeAmountEachReg,
                    )
                    this.form.controls.maxSmsEachReg.patchValue(this.datos.maxSmsEachReg)
                }
            }),
        )
    }

    setPageSize(event) {
        //console.log(event.target.value);
        this.pageSizeAlert = event.target.value
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub: Subscription) => {
            sub.unsubscribe()
        })
        this.subscriptions = []
    }

    isChecked(value) {
        return value == 'Y'
    }
}
