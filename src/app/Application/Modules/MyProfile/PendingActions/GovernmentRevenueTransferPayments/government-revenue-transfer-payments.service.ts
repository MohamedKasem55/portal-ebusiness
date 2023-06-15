import { HttpClient } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { NgbDateCustomParserFormatter } from '../../../../../core/alt-calendar/date-custom-parse-formatter'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { AuthenticationService } from '../../../../../core/security/authentication.service'
import { StorageService } from '../../../../../core/storage/storage.service'
import { Company } from '../../../../Model/company'
import { AbstractService } from "../../../Common/Services/Abstract/abstract.service";
import { DatePipe } from "@angular/common";
@Injectable()
export class GovernmentRevenueTransferPaymentsService extends AbstractService {
    private _company: Company
    dateFormatter: NgbDateCustomParserFormatter

    constructor(
        protected http: HttpClient,
        public config: ConfigResourceService,
        public authenticationService: AuthenticationService,
        public storageService: StorageService,
        public translate: TranslateService,
        private datePipe: DatePipe,
    ) {
        super(http, config);
        this.dateFormatter = new NgbDateCustomParserFormatter()
    }

    public getPendingGovernmentRevenueFilterInit(): Observable<any> {
        return this.http
            .get(this.servicesUrl + '/governmentRevenue/newPayment/init')
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

    protected getParsedFiltersData(filters: any): any {

        const data: any = {
            batchName: filters.batchName && filters.batchName.trim() != "" ? filters.batchName : null,
            accountPk: filters.accountPk && filters.accountPk != "" ? filters.accountPk : null,
            beneficiaryBank: filters.beneficiaryBank && filters.beneficiaryBank != "" ? filters.beneficiaryBank : null,
            letterNumber: filters.letterNumber && filters.letterNumber.trim() != "" ? filters.letterNumber : null,
            letterValueDate: filters.letterValueDate ? this.dateFormatter.formatToRrequest(filters.letterValueDate) : null,
            letterDateFrom: filters.letterDateFrom ? this.dateFormatter.formatToRrequest(filters.letterDateFrom) : null,
            letterDateTo: filters.letterDateTo ? this.dateFormatter.formatToRrequest(filters.letterDateTo) : null,
            closingDateFinYear: filters.closingDateFinYear && filters.closingDateFinYear.trim() != "" ? filters.closingDateFinYear : null,
            status: filters.status && filters.status.trim() != "" ? filters.status : null,
            initiationDateFrom: filters.initiationDateFrom ? this.datePipe.transform(filters.initiationDateFrom, 'yyyy-MM-dd') : null,
            initiationDateTo: filters.initiationDateTo ? this.datePipe.transform(filters.initiationDateTo, 'yyyy-MM-dd') : null,
            initiatedBy: filters.initiatedBy && filters.initiatedBy.trim() != "" ? filters.initiatedBy : null,
            totalAmountFrom: filters.totalAmountFrom && filters.totalAmountFrom > 0 ? Number.parseFloat(filters.totalAmountFrom) : null,
            totalAmountTo: filters.totalAmountTo && filters.totalAmountTo > 0 ? Number.parseFloat(filters.totalAmountTo) : null,
        }
        return data;
    }

    public getPendingGovernmentRevenueTransferPayments(filters, page, rows): Observable<any> {
        const data: any = this.getParsedFiltersData(filters);
        data.page = page
        data.rows = rows
        return this.http
            .post(this.servicesUrl + '/governmentRevenue/pendingActions/list', data)
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

    public getPendingGovernmentRevenueFileTransferPayments(filters, page, rows,): Observable<any> {
        const data: any = this.getParsedFiltersData(filters);
        data.page = page
        data.rows = rows
        return this.http
            .post(this.servicesUrl + '/governmentRevenue/pendingActions/file/list', data)
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

    public authorizeValidate(batchList, batchFileList): Observable<any> {
        //console.log("STEP 2");
        const data: any = {
            batchList,
            batchFileList
        }

        return this.http
            .post(
                this.servicesUrl + '/governmentRevenue/pendingActions/validate',
                data,
            )
            .pipe(
                map((response: any, index: number) => {
                    let result: any = {}
                    const output = response
                    //
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

    public refuseConfirm(batchList, batchFileList, rejectReason): Observable<any> {
        const data: any = {
            batchList,
            batchFileList,
            rejectReason
        }

        return this.http
            .post(this.servicesUrl + '/governmentRevenue/pendingActions/refuse', data)
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

    public approveConfirm(batchList, batchFileList, requestValidate): Observable<any> {
        const data: any = {
            batchList: [].concat(
                batchList.toProcess,
                batchList.toAuthorize,
                batchList.notAllowed,
            ),
            batchFileList: [].concat(
                batchFileList.toProcess,
                batchFileList.toAuthorize,
                batchFileList.notAllowed,
            ),
            requestValidate,
            saveCheck: true
        }

        return this.http
            .post(
                this.servicesUrl + '/governmentRevenue/pendingActions/confirm',
                data,
            )
            .pipe(
                map((response: any, index: number) => {
                    let result: any = {}

                    const output = response

                    if (output.errorCode !== '0') {
                        result.error = true
                        result.errorCode = output.errorCode
                        result.errorDescription = output.errorDescription
                        if (output.errorCode === '-3') {
                            result.generateChallengeAndOTP = output.generateChallengeAndOTP
                        }
                    } else {
                        result = output
                        result.error = false
                    }
                    return result
                }),
                catchError(this.handleError),
            )
    }

    get company() {
        if (!this._company) {
            const currentUser = JSON.parse(
                this.storageService.retrieve('currentUser'),
            )
            this._company = currentUser.company
        }
        return this._company
    }
}
