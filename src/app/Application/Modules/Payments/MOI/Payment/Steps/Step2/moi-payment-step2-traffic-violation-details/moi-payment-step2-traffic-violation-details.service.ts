import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {AbstractListDynamicService} from "../../../../../../Common/Services/Abstract/abstract-list-dynamic.service";
import {HttpClient} from "@angular/common/http";
import {ConfigResourceService} from "../../../../../../../../core/config/config.resource.local";
import {Observable} from "rxjs"

@Injectable()
export class MoiPaymentStep2TrafficViolationDetailsService extends AbstractListDynamicService {

    constructor(protected translate: TranslateService,
                protected http: HttpClient,
                public config: ConfigResourceService,
                @Inject(LOCALE_ID) private locale: string) {
        super(translate, http, config)
    }

    protected createDataRequest(criteria: any, order: string, orderType: string, page: number, rows: number): Observable<any> {
        return undefined;
    }

    protected getOutputFromRequestedData(_body): any {
    }

    getFieldsConfigForSearchForm(): any[] {
        return [];
    }

    getFieldsConfigForList(): any[] {
        const _fieldsConfigForList: any[] = [
            {
                key: 'feeType',
                propName: 'feeType',
                propValue: (row, service, combosData) => row.feeType,
                translate: 'payments.moiPayments.feeType',
                parent_div_class: 'col-xs-6',
                export: true,
            },
            {
                key: 'feeAmount',
                propName: 'feeAmount',
                propValue: (row, service, combosData) => row.feeAmount,
                translate: 'payments.moiPayments.feesAmount',
                parent_div_class: 'col-xs-6',
                export: true,
            }
        ]
        return _fieldsConfigForList
    }

    public getExportHeader() {
        return this.translate.instant('payments.moiPayments.trafficViolationsServices.trafficViolations')
    }

    public showExportButtons() {
        return true
    }

    public getExportColumns() {
        const exportColumns = []
        this.getFieldsConfigForList().forEach((_fieldConfig) => {
            if (
                _fieldConfig.hasOwnProperty('export') &&
                _fieldConfig.export === true
            ) {
                exportColumns.push(
                    Object.assign({}, _fieldConfig, {
                        title: this.translate.instant(_fieldConfig.translate),
                        dataKey: _fieldConfig.exportKey
                            ? _fieldConfig.exportKey
                            : _fieldConfig.key,
                        modelKey: _fieldConfig.modelKey,
                        width: _fieldConfig.export_column_width
                            ? _fieldConfig.export_column_width
                            : _fieldConfig.width
                                ? _fieldConfig.width
                                : 'auto',
                    }),
                )
            }
        })
        return exportColumns
    }
}
