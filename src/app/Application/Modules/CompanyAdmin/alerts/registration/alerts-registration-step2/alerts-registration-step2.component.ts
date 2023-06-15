import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DatatableMobileComponent} from "../../../../../../core/responsive/datatable-mobile.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {CompanyAdminAlertsService} from "../../../Services/company-admin-alert.service";
import {SelectedUserAlertDataService} from "../../../Services/selected-user-alert-data-service";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-alerts-registration-step2',
    templateUrl: './alerts-registration-step2.component.html',
    styleUrls: ['./alerts-registration-step2.component.scss']
})
export class AlertsRegistrationStep2Component extends DatatableMobileComponent
    implements OnInit, OnDestroy {

    @ViewChild('userAlertTable', {static: true}) table: any

    form: FormGroup
    userAlerts: any[]
    sumaryAlerts: any
    accounts: any[]
    subscriptions: Subscription[] = []
    messageError: any = {}

    constructor(
        public fb: FormBuilder,
        public router: Router,
        public service: CompanyAdminAlertsService,
        public serviceData: SelectedUserAlertDataService,
        public translateService: TranslateService,
    ) {
        super()
        this.form = this.fb.group({
            account: [{value: '', disabled: true}, Validators.required],
            fullAccountNumber: [],
        })
        this.accounts = []
        this.userAlerts = []
        this.sumaryAlerts = []
        this.userAlerts = this.serviceData.getUsers()
        let totalFees = 0
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.userAlerts.length; i++) {
            totalFees = totalFees + this.userAlerts[i].userFee
        }
        this.subscriptions.push(
            translateService
                .get('companyAdmin.alerts.totalFees')
                .subscribe((value) => {
                    this.sumaryAlerts = {
                        userId: '',
                        userName: '',
                        mobile: value,
                        fee: totalFees,
                    }
                }),
        )
        this.accounts.push(this.serviceData.getAccount())
        if (!this.userAlerts || this.userAlerts.length == 0) {
            this.router.navigate(['/companyadmin/alerts']);
        }
    }

    getAllTables(): any[] {
        const tablas = []
        tablas.push(this.table)
        return tablas
    }



    ngOnDestroy() {
        this.subscriptions.forEach((sub: Subscription) => {
            sub.unsubscribe()
        })
        this.subscriptions = []
    }

    confirm() {
        this.subscriptions.push(
            this.service
                .confirmRegistration(this.accounts[0].value, this.userAlerts)
                .subscribe((result) => {
                    if (result.errorCode !== '0') {
                        const res = <any>result;
                        this.messageError['code'] = res.errorCode;
                        this.messageError['description'] = res.errorDescription;
                    } else {
                        this.serviceData.setConfirm(result)
                        this.serviceData.setAccount(this.accounts[0])
                        this.router.navigate(['/companyadmin/alerts/registration/registration3'])
                    }
                }),
        )
    }

    back() {
        this.serviceData.setUsers(this.userAlerts);
        this.serviceData.setAccount([this.accounts[0]]);
        this.router.navigate(['/companyadmin/alerts/registration']);
    }
}
