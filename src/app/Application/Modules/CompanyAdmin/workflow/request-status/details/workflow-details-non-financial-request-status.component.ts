import {Component, Inject, Injector, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {WorkflowDetailsNonFinancialRequestStatusService} from "./workflow-details-non-financial-request-status.service";
import { AbstractAppComponent } from 'app/Application/Modules/Common/Components/Abstract/abstract-app.component';
import { WorkflowNonFinancialRequestStatusService } from '../../../Services/workflow/request-status/workflow-non-financial-request-status.service';
import { StaticService } from 'app/Application/Modules/Common/Services/static.service';
import { AuthenticationService } from 'app/core/security/authentication.service';

@Component({
    selector: 'app-workflow-details-non-financial-request-status',
    templateUrl: './workflow-details-non-financial-request-status.component.html',
    styleUrls: ['./workflow-details-non-financial-request-status.component.scss']
})
export class WorkflowDetailsNonFinancialRequestStatusComponent extends AbstractAppComponent
    implements OnInit, OnDestroy {

    selectedItem: any

    detailsData: any

    entityProperties: any[] = []
    formModel: FormGroup
    combosKeys: any[] = [
        'batchTypes'
    ]
    combosData: any = {};

    routes: any[] = [
        ['companyAdmin.companyAdmin'],
        ['workflow.workflow', ['/companyadmin/workflow']],
        ['workflow.requestStatus.requestStatus', ['/companyadmin/workflow/requestStatus']],
        ['workflow.requestStatus.detailsNonFinancial'],
    ]

    constructor(
        public deleteService: WorkflowDetailsNonFinancialRequestStatusService,
        public workflowNonFinancialService: WorkflowNonFinancialRequestStatusService,
        public detailsService :WorkflowDetailsNonFinancialRequestStatusService,
        public fb: FormBuilder,
        public translate: TranslateService,
        public staticService: StaticService,
        public authenticationService: AuthenticationService,
        public router: Router,
        protected injector: Injector,
        @Inject(LOCALE_ID) private _locale: string,
    ) {
        super(translate)
        this.formModel = this.fb.group({})
    }

    ngOnInit() {
        this.selectedItem = this.workflowNonFinancialService.getSelectedItem();
        if (!this.selectedItem || !this.selectedItem['batchPk']) {
            this.router.navigate([this.getBackUrl()])
        } else {
            this.detailsData = Object.assign({}, this.selectedItem)
            this.entityProperties = this.detailsService.configureDetailsFormModel(
                this.detailsData,
            )
        }
        this.refreshData();
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

    isBackAllowed(){
        return true;
    }

    refreshData() {
        super.refreshData()
        this.subscriptions.push(
            this.staticService
                .getAllCombosAsArrays(this.combosKeys)
                .subscribe((resultC) => {
                    const data: any = resultC
                    // tslint:disable-next-line:prefer-for-of
                    for (let i = 0; i < this.combosKeys.length; i++) {
                        this.combosData[this.combosKeys[i]] = data[this.combosKeys[i]]
                    }
                    // -------------------------------------------------
                     this.detailsService.setCombosData(this.combosData)
                }),
                )
            }

}
