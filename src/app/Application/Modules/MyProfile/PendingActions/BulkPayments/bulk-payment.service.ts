import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {Observable, of} from 'rxjs'
import {catchError, map} from 'rxjs/operators'
import {ConfigResourceService} from '../../../../../core/config/config.resource.local'
import {AuthenticationService} from '../../../../../core/security/authentication.service'
import {AppService} from "../../../../../core/service/app.service";
import {AbstractService} from "../../../Common/Services/Abstract/abstract.service";

@Injectable()
export class BulkPaymentService extends AbstractService {
    baseRoute = '/bulkPayments/pendingActions/'

    constructor(
        protected http: HttpClient,
        public config: ConfigResourceService,
        public authenticationService: AuthenticationService,
    ) {
        super(http, config);
    }

    public getPending(page, rows): Observable<any> {
        const data: any = {}
        data.page = page
        data.rows = rows

        // pending bulk payment list
        return this.http
            .post(this.servicesUrl + this.baseRoute + 'getList', data)
            .pipe(
                map((response: any, index: number) => {
                    let result: any = {}

                    const output = response

                    if (output.errorCode !== '0') {
                        result.error = true
                        result.errorCode = output.errorCode
                        result.errorDescription = output.errorDescription
                    } else {
                        result = output
                        result.error = false
                    }
                    return result
                }),
                catchError(this.handleError),
            )
    }

    public authorizeValidate(pendingBulkPaymentsList): Observable<any> {
        const data: any = {}
        data.pendingBulkPaymentsList = pendingBulkPaymentsList

        return this.http
            .post(this.servicesUrl + this.baseRoute + 'validate', data)
            .pipe(
                map((response: any, index: number) => {
                    let result: any = {}

                    const output = response

                    if (output.errorCode !== '0') {
                        result.error = true
                        result.errorCode = output.errorCode
                        result.errorDescription = output.errorDescription
                    } else {
                        result = output
                        result.error = false
                    }
                    return result
                }),
                catchError(this.handleError),
            )
    }

    public authorizeConfirm(batchList, requestValidate): Observable<any> {
        const data: any = {}
        data.batchList = batchList
        data.requestValidate = requestValidate

        return this.http
            .post(this.servicesUrl + this.baseRoute + 'confirm', data)
            .pipe(
                map((response: any, index: number) => {
                    let result: any = {}

                    const output = response

                    if (output.errorCode !== '0') {
                        result.error = true
                        result.errorCode = output.errorCode
                        result.errorDescription = output.errorDescription
                    } else {
                        result = output
                        result.error = false
                    }
                    return result
                }),
                catchError(this.handleError),
            )
    }

    public refuseConfirm(batchList, rejectReason): Observable<any> {
        const data: any = {}
        data.batchList = batchList
        data.rejectionReason = rejectReason

        return this.http
            .post(this.servicesUrl + this.baseRoute + 'refuse', data)
            .pipe(
                map((response: any, index: number) => {
                    let result: any = {}

                    const output = response

                    if (output.errorCode !== '0') {
                        result.error = true
                        result.errorCode = output.errorCode
                        result.errorDescription = output.errorDescription
                    } else {
                        result = output
                        result.error = false
                    }
                    return result
                }),
                catchError(this.handleError),
            )
    }

    public pendingActionDetail(bulkPaymentBatch): Observable<any> {
        const data: any = {}
        data.bulkPaymentBatch = bulkPaymentBatch
        return this.http
            .post(this.servicesUrl + this.baseRoute + 'fileDetails', data)
            .pipe(
                map((response: any, index: number) => {
                    let result: any = {}

                    const output = response

                    if (output.errorCode !== '0') {
                        result.error = true
                        result.errorCode = output.errorCode
                        result.errorDescription = output.errorDescription
                    } else {
                        result = output
                        result.error = false
                    }
                    return result
                }),
                catchError(this.handleError),
            )
    }
}
