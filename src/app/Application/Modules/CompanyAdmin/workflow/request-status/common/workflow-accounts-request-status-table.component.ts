import { Component, OnInit, OnDestroy, EventEmitter, Output, Injector } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import { AbstractDatatableMobileComponent } from 'app/Application/Modules/Common/Components/Abstract/abstract-datatable-mobile.component';
import { WorkflowAccountsRequestStatusService } from '../../../Services/workflow/request-status/workflow-accounts-request-status.service';
import { StaticService } from 'app/Application/Modules/Common/Services/static.service';
import { AuthenticationService } from 'app/core/security/authentication.service';
import { AuthorizationLevelPopUpComponent } from 'app/core/authorizationPopUp/authorization-popup.component';
import { LevelFormatPipe } from 'app/Application/Components/common/Pipes/getLevels-pipe';

@Component({
    selector: 'app-workflow-accounts-request-status-table',
    templateUrl: './workflow-accounts-request-status-table.component.html',
    styleUrls: ['./workflow-accounts-request-status-table.component.scss']
})
export class WorkflowAccountsRequestStatusTableComponent extends AbstractDatatableMobileComponent implements OnInit, OnDestroy {

    combosData: any = {}

    futureLevels = false;

    constructor(
        public fb: FormBuilder,
        public service: WorkflowAccountsRequestStatusService,
        public staticService: StaticService,
        private injector: Injector,
        public translate: TranslateService,
        public authenticationService: AuthenticationService,
        public router: Router,
    ) {
        super(fb, translate, authenticationService, router)

        this.order = ''
        this.orderType = 'desc'

        this.searchForm = this.fb.group({})

    }

    ngOnInit(): void {
        super.ngOnInit();

        const combosKeys = ['currency', 'currencyIso']

        this.subscriptions.push(
            this.staticService
                .getAllCombosAsArrays(combosKeys, true)
                .subscribe((resultC) => {
                    if (resultC === null) {
                        this.onError(resultC)
                    } else {
                        const data: any = resultC
                        // tslint:disable-next-line:prefer-for-of
                        for (let i = 0; i < combosKeys.length; i++) {
                            this.combosData[combosKeys[i]] = data[combosKeys[i]]
                        }
                        this.search()
                    }
                }),
        )
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    getId(row): any {
        return row['batchPk'] + '-' + row['accountNumber'] + '-' + row['initiationDate'] + '-' + row['paymentId'];
    }

    getList(searchElement, order, orderType, offset, pageSize) {
        const searchCriteria = {}
        this.subscriptions.push(
            this.service
                .getResults(searchCriteria, order, orderType, offset, pageSize)
                .subscribe((result: any) => {
                    if (result === null) {
                        this.onError(result)
                    } else {
                        this.elementsPage = result
                        this.processItemsLevels(result.data)
                    }
                }),
        )
    }

    openModal(levels, popup: AuthorizationLevelPopUpComponent): void {
        popup.openModal(levels)
    }

    // openModal(row, popup): void {
    //     if (this.futureLevels) {
    //         popup.openModal(row.futureSecurityLevelsDTOList);
    //     } else {
    //         popup.openModal(row.securityLevelsDTOList);
    //     }
    // }

    goActivate(row): void {
        this.service.setSelectedItem(row);
        this.router.navigate(['/companyadmin/workflow/requestStatus/account-reinitiate']);
    }

    getTableSelectionType() {
        return this.defaultSelectionTypeSingle;
    }

    protected processItemsLevels(items) {
        if (Array.isArray(items) && items.length > 0) {
            items.forEach((item) => {
                if (item.securityLevelsDTOList != null) {
                    item['currentStatus'] = new LevelFormatPipe(this.injector).transform(
                        item.securityLevelsDTOList,
                        'status',
                    )
                    item['nextStatusExport'] = new LevelFormatPipe(
                        this.injector,
                    ).transform(item.securityLevelsDTOList, 'nextStatus')
                }
                else {
                    item["currentStatus"] = new LevelFormatPipe(this.injector).transform(
                        item.futureSecurityLevelsDTOList,
                        "status"
                    );
                    item["nextStatusExport"] = new LevelFormatPipe(
                        this.injector
                    ).transform(item.futureSecurityLevelsDTOList, "nextStatus");
                }
            })
        }
    }
}
