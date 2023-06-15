import { Component, OnDestroy, OnInit, Input } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Exception } from 'app/Application/Model/exception';
import { FormGroup, FormBuilder } from '@angular/forms';
import {ConfigResourceService} from "../../../../../core/config/config.resource.local";



@Component({
    selector: 'wps-payroll-new-step3',
    templateUrl: './wps-payroll-new-step3.component.html',
    styleUrls: ['./wps-payroll-new-step3.component.scss'],
})
export class WpsPayrollNewComponentStep3
    implements OnInit, OnDestroy {

    @Input() formModel: FormGroup;
    @Input() showDetails: boolean = false;

    
    public combosData: any = [];

    constructor(
        public fb: FormBuilder,
        public router: Router,
        public translate: TranslateService,
        public config: ConfigResourceService,
    ) {
    }

    showTC() {
        let url_to_open =
            `${this.config.getDocumentUrl()}/Payroll-eRegistarion-TC.PDF`
        window.open(url_to_open, '_blank')
    }

    ngOnDestroy(): void {

    }

    ngOnInit(): void {

    }

}