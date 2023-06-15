import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core'
import {
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms'
import { AbstractService } from '../../Common/Services/Abstract/abstract.service'
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ConfigResourceService } from '../../../../core/config/config.resource.local';
import { catchError, map } from 'rxjs/operators';
import { Exception } from '../../../Model/exception';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { StorageService } from 'app/core/storage/storage.service';
import { ModelPipe } from '../../../Components/common/Pipes/model-pipe'

@Injectable()
export class WpsPayrollService extends AbstractService {
    constructor(
        protected http: HttpClient,
        public config: ConfigResourceService,
        protected fb: FormBuilder,
        public storage: StorageService,
        @Inject(LOCALE_ID) private _locale: string,
        private injector: Injector,

    ) {
        super(http, config)
    }


     modelPipe = new ModelPipe(this.injector)

    public createForm(): FormGroup {
        const form = this.fb.group(
            {
                numberOfEmployees: [null, [Validators.required, Validators.pattern("[0-9]{1,6}")]],
                templateId: ['', []],
                monthlyFees: ['', []],
                employeeFees: ['', []],
                molID: [null, [Validators.required, Validators.pattern("[0-9]{2}-[0-9]{5,15}$")]],
                chargeAccount: ['', [Validators.required]],
                termsAccept: [false, [Validators.requiredTrue]]
            });
        return form;
    }

    public createFormWithData(data): FormGroup {
        const form = this.fb.group(
            {
                numberOfEmployees: [data.employeeCount, [Validators.required, Validators.pattern("[0-9]{1,6}")]],
                templateId: [data.agreementTemplateId, []],
                monthlyFees: [data.agreementTemplate.monthlyFees, []],
                employeeFees: [data.agreementTemplate.employeeFees, []],
                molID: [data.mol_ID, [Validators.required, Validators.pattern("[0-9]{2}-[0-9]{5,15}$")]],
                chargeAccount: ['', [Validators.required]],
                termsAccept: [false, [Validators.requiredTrue]]
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
            map((response: any) => {
              return response.listAccount.map(account => {
                const acc = Object.assign({}, account)
                acc.displayAccount = account.fullAccountNumber + ' - ' + account.availableBalance
                + ' SAR' + ' - ' + account.alias
                return acc;
              }).filter(response => {
                return response.currency == '608'
              })
            }),
            catchError(this.handleError),
        )
    }

    public getPayrollAgreement(employeeCount: number) {
        return this.http.get(this.servicesUrl + '/payroll/agreement/template/' + employeeCount);
    }

    public validateAgreement(data: any) {
        let URL = this.servicesUrl + '/payroll/agreement/register/validate';
        return this.http
            .post(this.servicesUrl + '/payroll/agreement/register/validate', data)
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

    public confirmAgreement(data: any) {
        return this.http
            .post(this.servicesUrl + '/payroll/agreement/register/confirm', data)
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

    public getPayrollAgreementTemplates() {
        return this.http
            .get(this.servicesUrl + '/payroll/agreement/template/all')
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

    public getPayrollAgreementEligibility(){
        return this.http
            .get(this.servicesUrl + '/payroll/agreement/eligibility')
            .pipe(
                map((response: any) => {
                    const body = response;
                    if(response.errorCode !== '0') {
                        const exception: Exception = new Exception(
                            body.errorCode,
                            body.errorDescription,
                        )
                        return observableThrowError(exception);
                    } else {
                        return body
                    }
                }),
                catchError(this.handleError),
            )
    }

    public getCompanyActiveAgreements(): Observable<any>{
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
              return body
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
        console.error(errMsg)
        const errorService: Exception = new Exception('handle', errMsg)
        return observableThrowError(errorService)
    }
}
