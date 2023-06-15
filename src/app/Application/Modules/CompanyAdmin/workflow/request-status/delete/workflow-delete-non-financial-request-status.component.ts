import {Component, Inject, Injector, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {WorkflowDeleteNonFinancialRequestStatusService} from "./workflow-delete-non-financial-request-status.service";
import { AbstractAppComponent } from 'app/Application/Modules/Common/Components/Abstract/abstract-app.component';
import { WorkflowNonFinancialRequestStatusService } from '../../../Services/workflow/request-status/workflow-non-financial-request-status.service';
import { StaticService } from 'app/Application/Modules/Common/Services/static.service';
import { AuthenticationService } from 'app/core/security/authentication.service';

@Component({
    selector: 'app-workflow-delete-non-financial-request-status',
    templateUrl: './workflow-delete-non-financial-request-status.component.html',
    styleUrls: ['./workflow-delete-non-financial-request-status.component.scss']
})
export class WorkflowDeleteNonFinancialRequestStatusComponent extends AbstractAppComponent
    implements OnInit, OnDestroy {

    selectedItem: any

    deleteData: any

    entityProperties: any[] = []

    combosKey: any = [];
    combosData: any = {};

    routes: any[] = [
        ['companyAdmin.companyAdmin'],
        ['workflow.workflow', ['/companyadmin/workflow']],
        ['workflow.requestStatus.requestStatus', ['/companyadmin/workflow/requestStatus']],
        ['workflow.requestStatus.deleteNonFinancial'],
    ]

    constructor(
        public deleteService: WorkflowDeleteNonFinancialRequestStatusService,
        public detailsService: WorkflowNonFinancialRequestStatusService,
        public fb: FormBuilder,
        public translate: TranslateService,
        public staticService: StaticService,
        public authenticationService: AuthenticationService,
        public router: Router,
        protected injector: Injector,
        @Inject(LOCALE_ID) private _locale: string,
    ) {
        super(translate)
    }

    ngOnInit() {
        this.selectedItem = this.detailsService.getSelectedItem();
        if (!this.selectedItem || !this.selectedItem['batchPk']) {
            this.router.navigate([this.getBackUrl()])
        } else {
            this.deleteData = Object.assign({}, this.selectedItem)
            this.entityProperties = this.deleteService.configureDeleteFormModel(
                this.deleteData,
            )
        }
    }

    ngOnDestroy() {
        super.ngOnDestroy()
    }

    getBackUrl() {
        return '/companyadmin/workflow/requestStatus'
    }

    isPending(): boolean {
        return false;
    }
}
