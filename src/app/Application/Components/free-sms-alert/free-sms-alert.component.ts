import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from "ngx-bootstrap/modal";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CustomPropertiesService} from "../../Modules/CompanyAdmin/Services/custom-properties.service";
import {StorageService} from "../../../core/storage/storage.service";
import {DisclaimerService} from "../common/disclaimer.service";
import {CompanyAdminAlertsService} from "../../Modules/CompanyAdmin/Services/company-admin-alert.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-free-sms-alert',
    templateUrl: './free-sms-alert.component.html',
    styleUrls: ['./free-sms-alert.component.scss']
})
export class FreeSmsAlertComponent implements OnInit, OnDestroy {

    @ViewChild('FreeSmsAlertModal', {static: true})
    FreeSmsAlertModal: ModalDirective;
    showSuccess = null;
    showLater = true;

    constructor(
        public fb: FormBuilder,
        public customPropertiesService: CustomPropertiesService,
        private _storage: StorageService,
        private disclaimerService: DisclaimerService,
        private companyAdminAlertsService: CompanyAdminAlertsService,
        private router: Router
    ) {
    }

    ngOnInit(): void {

    }

    updateLocalStorage() {
        let disclaimerList = this._storage.retrieve('disclaimerList');
        disclaimerList.forEach((item: any) => {
            if (item.type === 'FREE_SMS_ALERT') {
                item.show = false;
            }
        })
        this._storage.store('disclaimerList', disclaimerList);
    }

    showModal() {
        this.FreeSmsAlertModal.show();
    }

    hideModal() {
        this.updateLocalStorage()
        this.FreeSmsAlertModal.hide();
    }

    later() {
        this.disclaimerService.closeFreeSmsAlert().subscribe((res: any) => {
            this.hideModal();
        })
    }

    agree() {
        this.companyAdminAlertsService.solePropertyFreeSMSRegister().subscribe((res: any) => {
            if (res.errorCode === '0') {
                this.showSuccess = true;
                this.updateLocalStorage();
            } else {
                this.showSuccess = false;
            }
        })
    }

    configure() {
        this.updateLocalStorage();
        this.FreeSmsAlertModal.hide();
        void this.router.navigate(['/myprofile/alerts/create']);
    }

    close() {
        this.FreeSmsAlertModal.hide();
    }

    ngOnDestroy(): void {
    }

}