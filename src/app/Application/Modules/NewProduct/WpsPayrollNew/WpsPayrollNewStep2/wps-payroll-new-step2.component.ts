import { Component, OnDestroy, OnInit, ViewChild, Input } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Exception } from 'app/Application/Model/exception';
import { FormGroup, FormBuilder } from '@angular/forms'
import { ModalDirective } from 'ngx-bootstrap/modal';
import { WpsPayrollService } from '../wps-payroll-new.service';
import {WpsPayrollNewComponent} from "../wps-payroll-new.component";
import {ConfigResourceService} from "../../../../../core/config/config.resource.local";



@Component({
    selector: 'wps-payroll-new-step2',
    templateUrl: './wps-payroll-new-step2.component.html',
    styleUrls: ['./wps-payroll-new-step2.component.scss'],
})
export class WpsPayrollNewComponentStep2
    implements OnInit, OnDestroy {

    @Input() formModel: FormGroup;
    @ViewChild('templatesDetailsModal', { static: true }) templatesDetailsModal: ModalDirective

    public account: any;
    public agreementTemplates: any;

    public currency = "SAR";

    constructor(
        public fb: FormBuilder,
        public router: Router,
        public translate: TranslateService,
        public config: ConfigResourceService,
        private wpsPayrollService: WpsPayrollService,
    ) {
    }

    ngOnDestroy(): void {

    }

    ngOnInit(): void {
        this.account = this.formModel.controls['chargeAccount'].value;
    }

    showModal(): void {
        this.wpsPayrollService.getPayrollAgreementTemplates().subscribe((res) => {
            this.agreementTemplates = res.agreementTemplateDTOList;
            this.templatesDetailsModal.show();
        });
    }

    hideModal(): void {
        this.templatesDetailsModal.hide();

    }

    showTC() {
        let url_to_open =
            `${this.config.getDocumentUrl()}/Payroll-eRegistarion-TC.PDF`
        window.open(url_to_open, '_blank')
    }
}