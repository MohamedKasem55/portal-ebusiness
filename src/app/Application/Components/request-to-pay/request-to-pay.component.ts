import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core'
import {ModalDirective} from 'ngx-bootstrap/modal'
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import {CustomPropertiesService} from '../../Modules/CompanyAdmin/Services/custom-properties.service'
import {StorageService} from '../../../core/storage/storage.service'
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";


@Component({
    templateUrl: './request-to-pay.component.html',
    styleUrls: ['./request-to-pay.component.scss'],
    selector: 'request-to-pay-modal',
})
export class RequestToPayComponent implements OnInit, OnDestroy {

    @ViewChild('RTPCompanyModal', {static: true})
    rTPCompanyModal: ModalDirective

    constructor(
        public fb: FormBuilder,
        public router: Router,
        private translate:TranslateService,
        private _storage: StorageService,
    ) {
    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
    }

    show() {
        this.rTPCompanyModal.show()
    }

    close() {
        this.rTPCompanyModal.hide()
    }

    goTo() {
        localStorage.setItem("RTP_TAB", "2")
        this.rTPCompanyModal.hide()
        this.router.navigateByUrl('/transfers/rtPay').then(() => {
        })
    }


    getTranslatedText(text) {
        return this.translate.instant(text)
    }
}