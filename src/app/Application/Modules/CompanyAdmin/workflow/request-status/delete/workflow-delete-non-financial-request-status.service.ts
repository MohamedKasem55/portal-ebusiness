import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Validators } from '@angular/forms';
import { AbstractActionModifyService } from 'app/Application/Modules/Common/Services/Abstract/abstract-action-modify.service';
import { ConfigResourceService } from 'app/core/config/config.resource.local';
import { DateFormatPipe } from 'app/Application/Components/common/Pipes/date-format-pipe';
import { StatusPipe } from 'app/Application/Components/common/Pipes/status-pipe';

@Injectable()
export class WorkflowDeleteNonFinancialRequestStatusService extends AbstractActionModifyService {

    validateResponse: any

    detailsData = null;

    constructor(
        protected router: Router,
        protected http: HttpClient,
        public config: ConfigResourceService,
        protected injector: Injector,
        @Inject(LOCALE_ID) private _locale: string,
    ) {
        super(http, config)
    }

    configureDeleteFormModel(detailsData, futureLevels = false) {

        this.validateResponse = null;
        this.detailsData = detailsData;

        const _fieldsConfigForForm = []

        _fieldsConfigForForm.push({
            key: 'paymentId',
            title: 'paymentId',
            translate: 'requestStatus.serviceId',
            // type: 'text',
            type: 'select',
            select_combo_key: "batchTypes",
            required: false,
            default: detailsData.paymentId,
            validators: [],
            widget: 'text',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
            updatable: false,
            disabled: true,
            readonly: true,
            isFormField: true,
            isForValidate: true,
            isForConfirm: true,
            maxlength: 50
        }),

            _fieldsConfigForForm.push({
                key: 'type',
                title: 'type',
                translate: 'requestStatus.operationType',
                type: 'select',
                select_combo_key: "batchTypes",
                required: false,
                default: detailsData.type,
                validators: [],
                widget: 'text',
                widget_container_class: 'col-xs-12 col-sm-3',
                widget_container_init_row: false,
                widget_container_end_row: false,
                updatable: false,
                disabled: true,
                readonly: true,
                isFormField: true,
                isForValidate: true,
                isForConfirm: true,
                maxlength: 50
            })

        _fieldsConfigForForm.push({
            key: 'initiationDate',
            title: 'initiationDate',
            translate: 'requestStatus.initiationDate',
            type: 'date',
            required: false,
            default: detailsData.initiationDate
                ? new DateFormatPipe(this.injector, this._locale).transform(
                    detailsData.initiationDate,
                    'dd/MM/yyyy',
                )
                : '',
            validators: [],
            widget: 'datepicker',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
            select_combo_key: '',
            updatable: false,
            disabled: true,
            readonly: true,
            isFormField: true,
            isForValidate: true,
            isForConfirm: true
        })

        _fieldsConfigForForm.push({
            key: 'initiatedBy',
            title: 'deletionReason',
            translate: 'requestStatus.initiatedBy',
            type: 'text',
            required: false,
            default: detailsData.securityLevelsDTOList ? detailsData?.securityLevelsDTOList[0]?.updater : '',
            validators: [],
            widget: 'text',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
            select_combo_key: '',
            updatable: false,
            disabled: true,
            isFormField: true,
            isForValidate: true,
            isForConfirm: true,
        })

        _fieldsConfigForForm.push({
            key: 'status',
            title: 'status',
            translate: 'requestStatus.status',
            type: 'text',
            required: false,
            default: detailsData.status
                ? new StatusPipe(this.injector).transform(
                    detailsData.status,
                )
                : '',
            validators: [],
            widget: 'text',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
            select_combo_key: 'statusPipe',
            updatable: false,
            disabled: true,
            readonly: true,
            isFormField: true,
            isForValidate: true,
            isForConfirm: true
        })

        _fieldsConfigForForm.push({
            key: 'deletionReason',
            title: 'deletionReason',
            translate: 'requestStatus.deletionReason',
            type: 'text',
            required: true,
            default: '',
            validators: [Validators.required],
            widget: 'text',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
            select_combo_key: '',
            updatable: true,
            isFormField: true,
            isForValidate: true,
            isForConfirm: true,
        })

        return _fieldsConfigForForm
    }

    protected createValidateRequest(values: any): Observable<any> {
        this.validateResponse = {
            workflowNonFinancialBatch: Object.assign({}, this.detailsData)
        }

        return of({
            errorCode: "0",
            result: values
        })
    }

    protected createConfirmRequest(values: any): Observable<any> {
        const params = this.validateResponse

        let _param: HttpParams = new HttpParams();
        _param = _param.append("deletebody", JSON.stringify(params));

        return this.http.delete(
            this.config.getServicesUrl() +
            '/workflow/requestStatus/nonFinancial/delete',
            { params: _param },
        ).pipe(
            map((result: any) => {
                if (result && result.errorCode == "0") {
                    this.validateResponse = null;
                    this.detailsData = null;
                }
                return result;
            })
        )
    }

    back(route: string) {
        this.router.navigate([route]).then()
    }
}
