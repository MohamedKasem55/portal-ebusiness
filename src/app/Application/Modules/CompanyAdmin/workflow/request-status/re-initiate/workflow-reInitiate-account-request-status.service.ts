import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Validators } from '@angular/forms';
import { ConfigResourceService } from 'app/core/config/config.resource.local';
import { DateFormatPipe } from 'app/Application/Components/common/Pipes/date-format-pipe';
import { StatusPipe } from 'app/Application/Components/common/Pipes/status-pipe';
import { AbstractActionModifyService } from 'app/Application/Modules/Common/Services/Abstract/abstract-action-modify.service';

@Injectable()
export class WorkflowReInitiateAccountRequestStatusService extends AbstractActionModifyService {

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

    configureReinitiateFormModel(detailsData, futureLevels = false) {

        this.validateResponse = null;
        this.detailsData = detailsData;

        const _fieldsConfigForForm = []


        _fieldsConfigForForm.push({
            key: 'accountNumber',
            title: 'accountNumber',
            translate: 'accountNumber',
            type: 'text',
            required: false,
            default: detailsData.accountNumber,
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
            updatable: false,
            disabled: true,
            readonly: true,
            isFormField: true,
            isForValidate: true,
            isForConfirm: true
        })

        _fieldsConfigForForm.push({
            key: 'rejectedReason',
            title: 'deletionReason',
            translate: 'requestStatus.deletionReason',
            type: 'text',
            required: false,
            default: detailsData.rejectedReason,
            validators: [],
            widget: 'text',
            widget_container_class: 'col-xs-12 col-sm-3',
            widget_container_init_row: false,
            widget_container_end_row: false,
            updatable: false,
            readonly: true,
            isFormField: true,
            isForValidate: true,
            isForConfirm: true,
        })


        return _fieldsConfigForForm
    }

    protected createValidateRequest(values: any): Observable<any> {
        const params = {
            workflowAccountBatch: Object.assign({}, this.detailsData, { deletionReason: values.deletionReason })
        }

        return this.http.post(
            this.config.getServicesUrl() +
            '/workflow/requestStatus/accounts/validate',
            params,
        ).pipe(
            map((result: any) => {
                if (result && result.errorCode == "0") {
                    this.validateResponse = result;
                }
                // return result['workflowAccountBatch'];
                return result;
            })
        )
    }

    protected createConfirmRequest(values: any): Observable<any> {
        const params = {
            workflowAccountBatch: this.validateResponse.workflowAccountBatch,
            // requestValidate: this.validateResponse.requestValidate
            requestValidate: this.validateResponse.requestValidate ? this.validateResponse.requestValidate : {}
        }
        return this.http.post(
            this.config.getServicesUrl() +
            '/workflow/requestStatus/accounts/confirm',
            params,
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

    public deleteConfirmRequest(values: any): Observable<any> {
        const params = { workflowAccountBatch: values }
        let _param: HttpParams = new HttpParams();
        _param = _param.append("deletebody", JSON.stringify(params));
        return this.http.delete(
            this.config.getServicesUrl() +
            '/workflow/requestStatus/accounts/delete',
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
