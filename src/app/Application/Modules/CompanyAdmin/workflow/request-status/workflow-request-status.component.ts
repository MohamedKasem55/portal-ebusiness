import { Component, Inject, Injector, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import { AbstractAppComponent } from 'app/Application/Modules/Common/Components/Abstract/abstract-app.component';
import { WorkflowAccountsRequestStatusTableComponent } from './common/workflow-accounts-request-status-table.component';
import { WorkflowNonFinancialRequestStatusTableComponent } from './common/workflow-non-financial-request-status-table.component';
import { WorkflowAccountsRequestStatusService } from '../../Services/workflow/request-status/workflow-accounts-request-status.service';
import { WorkflowNonFinancialRequestStatusService } from '../../Services/workflow/request-status/workflow-non-financial-request-status.service';
import { StaticService } from 'app/Application/Modules/Common/Services/static.service';
import { AuthenticationService } from 'app/core/security/authentication.service';

@Component({
    selector: 'app-workflow-request-status',
    templateUrl: './workflow-request-status.component.html',
    styleUrls: ['./workflow-request-status.component.scss']
})
export class WorkflowRequestStatusComponent extends AbstractAppComponent implements OnInit {

    @ViewChild('AccountsRequestStatusTable', { static: true })
    accountsRequestStatusTable: WorkflowAccountsRequestStatusTableComponent;

    @ViewChild('NonFinancialRequestStatusTable', { static: true })
    nonFinancialRequestStatusTable: WorkflowNonFinancialRequestStatusTableComponent

    selectedType: null | 'ACCOUNTS' | 'NON-FINANCIAL' = null;

    selectedAccounts: any[] = [];
    static nonFinancial: string = 'WN'
    static account: string = 'WO'
    selectedNonFinancial: any[] = [];
    statusSelected: any = '';
    constructor(
        public detailsAccountsService: WorkflowAccountsRequestStatusService,
        public detailsNonFinancialService: WorkflowNonFinancialRequestStatusService,
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

    ngOnInit(): void {
        super.ngOnInit();
    }

    onSelectAccounts(selected: any[]): void {
        this.selectedAccounts = selected;
        this.selectedType = selected.length ? 'ACCOUNTS' : null;
        this.statusSelected = selected.length ? this.getStatusSelected(selected) : null;
        this.selectedNonFinancial = [];
        this.nonFinancialRequestStatusTable.tableSelectedRows = [];
        this.nonFinancialRequestStatusTable.tableSelectedRowsLastSelected = [];

    }

    onSelectNonFinancial(selected: any[]): void {
        this.selectedNonFinancial = selected;
        this.selectedType = selected.length ? 'NON-FINANCIAL' : null;
        this.statusSelected = selected.length ? this.getStatusSelected(selected) : null;
        this.selectedAccounts = [];
        this.accountsRequestStatusTable.tableSelectedRows = [];
        this.accountsRequestStatusTable.tableSelectedRowsLastSelected = [];
    }

    isAllowedAction(action: string): boolean {
        switch (action) {
            case 'back':
                return true;
            case 'delete':
                return true;
            case 'reInitiate':
                return true;
        }
        return false;
    }

    isDisabledAction(action: string): boolean {
        switch (action) {
            case 'back':
                return false;
            case 'delete':
                if (this.selectedNonFinancial.length + this.selectedAccounts.length !== 0 && this.statusSelected === WorkflowAccountsRequestStatusService.isRejected) {
                    return false
                } else { return true }

            case 'reInitiate':
                if (this.selectedNonFinancial.length + this.selectedAccounts.length !== 0 && this.statusSelected === WorkflowAccountsRequestStatusService.isRejected) {
                    return false
                } else { return true }
        }
        return true;
    }
    getStatusSelected(selected: any[]): boolean {
        return selected[0]['status'];
    }

    executeAction(action: string): void {
        if (this.selectedAccounts.length == 1) {
            this.detailsAccountsService.setSelectedItem(this.selectedAccounts[0]);
        } else if (this.selectedNonFinancial.length == 1) {
            this.detailsNonFinancialService.setSelectedItem(this.selectedNonFinancial[0]);
        }
        switch (action) {
            case 'back':
                this.router.navigate(['/companyadmin/workflow']);
                break;
            case 'details':
                const detailSelected =  this.detailsNonFinancialService.getSelectedItem();
                if (detailSelected && detailSelected['type'] === WorkflowRequestStatusComponent.nonFinancial ) {
                    this.router.navigate(['/companyadmin/workflow/requestStatus/details-non-financial']);
                } else if (detailSelected && detailSelected['type'] === WorkflowRequestStatusComponent.account) {
                    this.router.navigate(['/companyadmin/workflow/requestStatus/delete-non-financial']);
                }
                break;
            case 'delete':
                if (this.selectedAccounts.length == 1) {
                    this.router.navigate(['/companyadmin/workflow/requestStatus/delete-account']);
                } else if (this.selectedNonFinancial.length == 1) {
                    this.router.navigate(['/companyadmin/workflow/requestStatus/delete-non-financial']);
                }
                break;
            case 'reInitiate':
                if (this.selectedAccounts.length == 1) {
                    this.router.navigate(['/companyadmin/workflow/requestStatus/account-reinitiate']);
                } else if (this.selectedNonFinancial.length == 1) {
                    this.router.navigate(['/companyadmin/workflow/requestStatus/reInitiate-non-financial']);
                }
                break;
        }
    }

    onActionDetail(row: any) {
        const selected = row;
        if (selected && selected['type'] === WorkflowRequestStatusComponent.nonFinancial) {
            console.warn('NonFinancial');
            this.detailsNonFinancialService.setSelectedItem(selected);
        }
        else {
            console.warn('Account');
            this.detailsAccountsService.setSelectedItem(selected);
        }
        this.executeAction('details')
    }
}
