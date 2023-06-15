import { Injectable } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { AbstractService } from '../../Common/Services/Abstract/abstract.service'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { catchError, map } from 'rxjs/operators'
import { Exception } from '../../../Model/exception'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { StorageService } from 'app/core/storage/storage.service'
import { TranslateService } from '@ngx-translate/core'

@Injectable()
export class WpsRequestStatus extends AbstractService {

    constructor(
        protected http: HttpClient,
        public config: ConfigResourceService,
        protected fb: FormBuilder,
        public storage: StorageService,
        public translateService: TranslateService
    ) {
        super(http, config)
    }

    public createForm(data): FormGroup {
        if (!data.agreementTemplate) {
            data.agreementTemplate = {};
        }
        const form = this.fb.group(
            {
                monthlyFees: [data.agreementTemplate.monthlyFees, []],
                employeeFees: [data.agreementTemplate.employeeFees, []],
                molID: [data.mol_ID, []],
                chargeAccount: [data.account, []],
                requestNumber: [data.agreementId, []],
                requestType: ['', []],
                requestUser: [data.initiatedBy, []],
                initiatorID: [data.initiatorID, []],
                initiatorMobileNumber: [data.initiatorMobileNumber, []],
                authorizerMobileNumber: data.authorizerMobileNumber,
                requestStatus: [data.status, []],
                ownerID: ['', []],
                ownerName: ['', []],
                startDate: [data.startDate, []],
                expiryDate: [data.endDate, []],
                mobile: ['', []],
                consumed: ['', []],
                dateTime: ['', []],
                assingned: [data.agreementTemplate.employeeCountMaximum, []],
                employeeCount: [data.employeeCount, []],
                profileNumber: [data.profileNumber, []],
                classification: [data.classification, []]
            });
        return form;
    }

    public getAccounts(): Observable<any> {
        const data = {
            order: '',
            orderType: '',
            page: 1,
            rows: 100,
            txType: 'ECIA',
        }
        return this.http.post(this.servicesUrl + '/accounts', data).pipe(
            map((response: any) => response),
            catchError(this.handleError),
        )
    }

    public getRequestStatus() {
        return this.http
            .get(this.servicesUrl + '/payroll/agreement/company/list')
            .pipe(
                map((response: any) => {
                    const body = response;
                    if (response.errorCode !== '0') {
                        const exception: Exception = new Exception(
                            body.errorCode,
                            body.errorDescription,
                        )
                        return observableThrowError(exception);
                    } else {
                        body.companyPayrollAgreementDTOS.forEach(agreement => {
                            agreement.status === "ACTIVE" ? agreement.status = this.translateService.instant('newProduct.requestStatus.active')
                            : agreement.status = this.translateService.instant('newProduct.requestStatus.notActive')
                        })
                        return body
                    }
                }),
                catchError(this.handleError),
            )
    }

    public getRequestStatusDetails(agreementId) {
        return this.http
            .get(this.servicesUrl + '/payroll/agreement/company/details/' + agreementId)
            .pipe(
                map((response: any) => {
                    const body = response;
                    if (response.errorCode !== '0') {
                        const exception: Exception = new Exception(
                            body.errorCode,
                            body.errorDescription,
                        )
                        return observableThrowError(exception);
                    } else {
                        return body;
                    }
                }),
                catchError(this.handleError),
            )
    }


    public handleError(error: HttpResponse<any> | any) {
        let errMsg: string
        if (error instanceof HttpResponse) {
            const err = error['error'] || JSON.stringify(error)
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`
        } else {
            errMsg = error.message ? error.message : error.toString()
        }
        const errorService: Exception = new Exception('handle', errMsg)
        return observableThrowError(errorService)
    }
}
