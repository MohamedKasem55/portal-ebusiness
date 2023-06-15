import {Component, OnDestroy, OnInit, Input} from '@angular/core'
import {Router} from '@angular/router'
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {Exception} from 'app/Application/Model/exception';
import {FormGroup, FormBuilder} from '@angular/forms';
import {WpsPayrollService} from '../wps-payroll-new.service';


@Component({
    selector: 'wps-payroll-new-step1',
    templateUrl: './wps-payroll-new-step1.component.html',
    styleUrls: ['./wps-payroll-new-step1.component.scss'],
})
export class WpsPayrollNewComponentStep1
    implements OnInit, OnDestroy {

    @Input() formModel: FormGroup;
    @Input() showDetails: boolean
    @Input() combosData: any;

    public currency = "SAR";

    constructor(
        public fb: FormBuilder,
        public router: Router,
        public translate: TranslateService,
    ) {
    }

    ngOnDestroy(): void {

    }

    ngOnInit(): void {
    }
}
