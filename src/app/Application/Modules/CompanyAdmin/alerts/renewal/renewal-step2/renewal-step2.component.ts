import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DatatableMobileComponent} from "../../../../../../core/responsive/datatable-mobile.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {CompanyAdminAlertsService} from "../../../Services/company-admin-alert.service";
import {SelectedUserRenewalAlertDataService} from "../../../Services/selected-user-renewal-alert-data-service";
import {TranslateService} from "@ngx-translate/core";
import {Exception} from "../../../../../Model/exception";

@Component({
    selector: 'app-renewal-step2',
    templateUrl: './renewal-step2.component.html',
    styleUrls: ['./renewal-step2.component.scss']
})
export class RenewalStep2Component
    extends DatatableMobileComponent
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
        public serviceData: SelectedUserRenewalAlertDataService,
        public translateService: TranslateService,
    ) {
        super()
        this.form = this.fb.group({
            account: [{value: '', disabled: true}, Validators.required],
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
            this.router.navigate(['/companyadmin/alerts/renewal'])
        }
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
        this.userAlerts = this.serviceData.getUsers()
        this.accounts.push(this.serviceData.getAccount())
        this.form.controls.account.patchValue(this.serviceData.getAccount().key)
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub: Subscription) => {
            sub.unsubscribe()
        })
        this.subscriptions = []
    }

    confirm() {
        //let mapPk = this.mapUserIdUserPk();
        this.subscriptions.push(
            this.service
                .confirmRenewal(this.accounts[0].value, this.userAlerts)
                .subscribe((result) => {
                    if (
                        result.hasOwnProperty('error') &&
                        (<any>result).error instanceof Exception
                    ) {
                        const res = <any>result
                        //console.log(res.error);
                        this.messageError['code'] = res.error.errorCode
                        this.messageError['description'] = res.error.errorDescription
                    } else {
                        this.serviceData.clear()
                        this.serviceData.setConfirm(result)
                        this.serviceData.setUsers(this.userAlerts)
                        this.serviceData.setAccount(this.accounts[0])
                        this.router.navigate(['/companyadmin/alerts/renewal/renewal3'])
                    }
                }),
        )
    }

    back() {
        this.serviceData.setUsers(this.userAlerts)
        this.serviceData.setAccount(this.accounts[0])
        this.router.navigate(['/companyadmin/alerts/renewal'])
    }
}
