import {Component, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DatatableMobileComponent} from "../../../../../../core/responsive/datatable-mobile.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ConfirmRegistrationAlert} from "../../../Model/confirm-registration-alert";
import {BehaviorSubject, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {CompanyAdminAlertsService} from "../../../Services/company-admin-alert.service";
import {SelectedUserAlertDataService} from "../../../Services/selected-user-alert-data-service";
import {TranslateService} from "@ngx-translate/core";
import {DatePipe} from "@angular/common";
import {StaticService} from "../../../../Common/Services/static.service";
import {map} from "rxjs/operators";
import {SimpleMQ} from "ng2-simple-mq";

@Component({
    selector: 'app-alerts-registration-step3',
    templateUrl: './alerts-registration-step3.component.html',
    styleUrls: ['./alerts-registration-step3.component.scss']
})
export class AlertsRegistrationStep3Component
    extends DatatableMobileComponent
    implements OnInit, OnDestroy {
    @ViewChild('userAlertTable', {static: true}) table: any
    form: FormGroup
    confirmData: ConfirmRegistrationAlert
    _userAlerts: BehaviorSubject<any> = new BehaviorSubject([])
    accounts: any[]
    sumaryAlerts: any
    subscriptions: Subscription[] = []
    messageError: any = {}
    statusOk = true
    combosData: any = {}
    confirmSoleProperty: boolean;

    constructor(
        public fb: FormBuilder,
        public router: Router,
        public service: CompanyAdminAlertsService,
        public serviceData: SelectedUserAlertDataService,
        public translateService: TranslateService,
        public datePipe: DatePipe,
        private staticService: StaticService,
        private injector: Injector,
    ) {
        super();
        this.confirmSoleProperty = this.serviceData.getSoleProperty();
        this.form = this.fb.group({
            account: [{value: '', disabled: true}, Validators.required],
            registrationDate: [{value: '', disabled: true}],
            expiryDate: [{value: '', disabled: true}],
        })

        this.confirmData = serviceData.getConfirm()
        //console.log(serviceData.getConfirm());
        this.form.controls.registrationDate.patchValue(
            datePipe.transform(this.confirmData.registrationDate, 'dd/MM/yyyy'),
        )
        this.form.controls.expiryDate.patchValue(
            datePipe.transform(this.confirmData.expiryDate, 'dd/MM/yyyy'),
        )

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
        this.accounts = []
        this.accounts.push(this.serviceData.getAccount())
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
        this.router.navigate(['/companyadmin/alerts/registration'])
    }

    public confirm() {
        //console.log("to do submit");
        this.serviceData.clear()
        this.router.navigate(['/companyadmin/alerts/registration'])
    }

    prepareItems() {
        const userAlerts = []
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.confirmData.usersSelectedOk.length; i++) {
            this.confirmData.usersSelectedOk[i]['user']['fee'] =
                +this.confirmData.usersSelectedOk[i]['fees']
            this.confirmData.usersSelectedOk[i]['user']['status'] =
                this.confirmData.usersSelectedOk[i]['status']
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
            this.router.navigate(['/companyadmin/alerts/registration'])
        }
    }

    later() {
        void this.router.navigate(['/myprofile/alerts/registration']);
    }

    configure() {
        void this.router.navigate(['/myprofile/alerts/create']);
    }
}
