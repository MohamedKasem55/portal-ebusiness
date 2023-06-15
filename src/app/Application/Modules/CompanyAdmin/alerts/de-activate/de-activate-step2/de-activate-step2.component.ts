import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DatatableMobileComponent} from "../../../../../../core/responsive/datatable-mobile.component";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {CompanyAdminAlertsService} from "../../../Services/company-admin-alert.service";
import {SelectedUserDesactivateAlertDataService} from "../../../Services/selected-user-desactivate-alert-data-service";
import {Exception} from "../../../../../Model/exception";

@Component({
    selector: 'app-de-activate-step2',
    templateUrl: './de-activate-step2.component.html',
    styleUrls: ['./de-activate-step2.component.scss']
})
export class DeActivateStep2Component extends DatatableMobileComponent
    implements OnInit, OnDestroy {
    @ViewChild('userAlertTable', {static: true}) table: any
    form: FormGroup
    userAlerts: any[]

    subscriptions: Subscription[] = []
    messageError: any = {}

    constructor(
        public fb: FormBuilder,
        public router: Router,
        public service: CompanyAdminAlertsService,
        public serviceData: SelectedUserDesactivateAlertDataService,
    ) {
        super()
        this.form = this.fb.group({})
        this.userAlerts = []
        this.userAlerts = this.serviceData.getUsers()
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
        this.userAlerts = []
        this.userAlerts = this.serviceData.getUsers()
        // this.serviceData.clear()
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub: Subscription) => {
            sub.unsubscribe()
        })
        this.subscriptions = []
    }

    confirm() {
        //console.log('userAlert: '+this.userAlerts.length)
        this.subscriptions.push(
            this.service.confirmDesactivate(this.userAlerts).subscribe((result) => {
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
                    this.router.navigate(['/companyadmin/alerts/desactivate/desactivate3'])
                }
            }),
        )
    }

    back() {
        this.serviceData.setUsers(this.userAlerts)
        this.router.navigate(['/companyadmin/alerts/registration'])
    }

    isChecked(value) {
        return value == 'Y'
    }
}

