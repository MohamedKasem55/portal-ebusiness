import {Component, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DatatableMobileComponent} from "../../../../../../core/responsive/datatable-mobile.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ConfirmRenewalAlert} from "../../../Model/confirm-renewal-alert";
import {BehaviorSubject, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {CompanyAdminAlertsService} from "../../../Services/company-admin-alert.service";
import {SelectedUserRenewalAlertDataService} from "../../../Services/selected-user-renewal-alert-data-service";
import {TranslateService} from "@ngx-translate/core";
import {DatePipe} from "@angular/common";
import {StaticService} from "../../../../Common/Services/static.service";
import {map} from "rxjs/operators";
import {SimpleMQ} from "ng2-simple-mq";

@Component({
    selector: 'app-renewal-step3',
    templateUrl: './renewal-step3.component.html',
    styleUrls: ['./renewal-step3.component.scss']
})
export class RenewalStep3Component extends DatatableMobileComponent
    implements OnInit, OnDestroy {
    @ViewChild('userAlertTable', {static: true}) table: any
    form: FormGroup
    confirmData: ConfirmRenewalAlert
    _userAlerts: BehaviorSubject<any> = new BehaviorSubject([])
    accounts: any[]
    sumaryAlerts: any
    subscriptions: Subscription[] = []
    messageError: any = {}
    statusOk = true
    combosData: any = {}

    constructor(
        public fb: FormBuilder,
        public router: Router,
        public service: CompanyAdminAlertsService,
        public serviceData: SelectedUserRenewalAlertDataService,
        public translateService: TranslateService,
        public datePipe: DatePipe,
        private staticService: StaticService,
        private injector: Injector,
    ) {
        super()
        this.form = this.fb.group({
            account: [{value: '', disabled: true}, Validators.required],
            renewalDate: [{value: '', disabled: true}],
            expiryDate: [{value: '', disabled: true}],
            totalFees: [{value: '', disabled: true}],
        })
        this.accounts = []
        this.sumaryAlerts = []
        this.confirmData = serviceData.getConfirm()

        this.accounts.push(this.serviceData.getAccount())
        this.subscriptions.push(
            translateService
                .get('companyAdmin.alerts.totalFees')
                .subscribe((value) => {
                    this.sumaryAlerts = {
                        userId: '',
                        userName: '',
                        mobile: value,
                        fee: this.confirmData.totalFees,
                    }
                }),
        )
        this.form.controls.renewalDate.patchValue(
            datePipe.transform(this.confirmData.renewalDate, 'dd/MM/yyyy'),
        )
        this.form.controls.expiryDate.patchValue(
            datePipe.transform(this.confirmData.expiryDate, 'dd/MM/yyyy'),
        )
        this.form.controls.totalFees.patchValue(this.confirmData.totalFees)
    }

    get userAlerts() {
        return this._userAlerts.asObservable()
    }

    get userAlertsCount() {
        return this.userAlerts.pipe(map((result: Array<any>) => result.length))
    }

    getAllTables(): any[] {
        const tablas = []
        tablas.push(this.table)
        return tablas
    }

    ngOnInit() {
        super.ngOnInit()
        //console.log("OnInit");
        this.messageError = {}
        this.accounts.push(this.serviceData.getAccount())
        this.form.controls.account.patchValue(this.serviceData.getAccount().key)
        this.serviceData.clear()
        const combosKeys = ['errors']
        this.injector.get(SimpleMQ).publish('loader-mq', true)
        this.subscriptions.push(
            this.staticService.getAllCombos(combosKeys).subscribe((comboData) => {
                this.injector.get(SimpleMQ).publish('loader-mq', false)
                const data = comboData.find((valor) => {
                    return valor['comboName'] === 'errors'
                })
                if (data) {
                    this.combosData['errors'] = data['values']
                }
                this.prepareItems()
            }),
        )
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub: Subscription) => {
            sub.unsubscribe()
        })
        this.subscriptions = []
    }

    finish() {
        this.serviceData.clear()
        this.router.navigate(['/companyadmin/alerts/renewal'])
    }

    confirm() {
        //console.log("to do submit");
        this.serviceData.clear()
        this.router.navigate(['/companyadmin/alerts/renewal'])
    }

    prepareItems() {
        const userAlerts = []
        for (let i = 0; i < this.confirmData.usersSelectedOk.length; i++) {
            this.confirmData.usersSelectedOk[i]['user']['fee'] =
                +this.confirmData.usersSelectedOk[i]['fees']
            this.confirmData.usersSelectedOk[i]['user']['status'] =
                this.confirmData.usersSelectedOk[i]['status']
            if (this.confirmData.usersSelectedOk[i].status === '999') {
                this.statusOk = false
            }
            const alertUser = this.confirmData.usersSelectedOk[i]['user']
            alertUser['statusForExport'] = this.combosData['errors'][
            'errorTable.' + alertUser.status
                ]
                ? this.combosData['errors']['errorTable.' + alertUser.status]
                : alertUser.status
            userAlerts.push(alertUser)
        }
        this._userAlerts.next(userAlerts)

        if (this._userAlerts.getValue().length == 0) {
            this.router.navigate(['/companyadmin/alerts/renewal'])
        }
    }
}
