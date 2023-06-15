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
import {SelectedUserDesactivateAlertDataService} from "../../../Services/selected-user-desactivate-alert-data-service";

@Component({
    selector: 'app-de-activate-step3',
    templateUrl: './de-activate-step3.component.html',
    styleUrls: ['./de-activate-step3.component.scss']
})
export class DeActivateStep3Component
    extends DatatableMobileComponent
    implements OnInit, OnDestroy
{
    form: FormGroup
    userAlerts: any[]

    subscriptions: Subscription[] = []
    messageError: any = {}

    constructor(
        public fb: FormBuilder,
        public router: Router,
        public serviceData: SelectedUserDesactivateAlertDataService,
    ) {
        super()
        this.form = this.fb.group({})
    }

    ngOnInit() {
        super.ngOnInit()
        //console.log("OnInit");
        this.messageError = {}
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub: Subscription) => {
            sub.unsubscribe()
        })
        this.subscriptions = []
    }

    finish() {
        this.serviceData.clear()
        this.router.navigate(['/companyadmin/alerts/desactivate'])
    }
}
