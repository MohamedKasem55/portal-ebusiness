import {HttpClient, HttpResponse} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {Observable, of, throwError as observableThrowError} from 'rxjs'
import {catchError, map} from 'rxjs/operators'
import {ConfigResourceService} from '../../../../../core/config/config.resource.local'
import {Exception} from '../../../../Model/exception'
import {Page} from '../../../../Model/page'
import {PagedData} from '../../../../Model/paged-data'
import {CombinedFileDownloadRequest} from "../../../../Model/combined-file-download-request";

@Injectable()
export class ProcessedFileService {
    servicesUrl: string

    constructor(private http: HttpClient, public config: ConfigResourceService) {
        this.servicesUrl = config.getServicesUrl()
    }

    public getAccounts(): Observable<any> {
        const data = {
            order: '',
            orderType: '',
            page: 1,
            rows: 100,
            txType: 'ECIA',
        }

        const body = JSON.stringify(data)
        return this.http.post(this.servicesUrl + '/accounts/combo', body).pipe(
            map((response: any) => {
                const result = []
                const output = response

                // tslint:disable-next-line:prefer-for-of
                for (let i = 0; i < output.accountComboList.length; i++) {
                    result.push(output.accountComboList[i]['value'])
                }

                return result
            }),
        )
    }

    public handleError(error: HttpResponse<any> | any) {
        // In a real world app, you might use a remote logging infrastructure
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

    public searcher(data): Observable<any> {
        return this.http
            .post(this.servicesUrl + '/bulkPayments/processedFile/list', data)
            .pipe(
                map((response: any) => {
                    let result: any
                    const page = data.page
                    const rows = data.rows
                    const body = response
                    if (response.errorCode !== '0') {
                        const exception: Exception = new Exception(
                            body.errorCode,
                            body.errorDescription,
                        )
                        return observableThrowError(exception)
                    } else {
                        //console.log("success", body);
                        const output = body.listFile.items
                        const pagedData = new PagedData<any>()
                        const pageObject = new Page()

                        pageObject.pageNumber = page
                        pageObject.pageSize = rows
                        pageObject.size = body.listFile.size
                        pageObject.totalElements = body.listFile.total
                        pageObject.totalPages =
                            pageObject.totalElements / pageObject.pageSize

                        pagedData.data = output
                        pagedData.page = pageObject
                        result = pagedData
                        result['payrollCompanyDetails'] = body.payrollCompanyDetails
                        return result
                    }
                }),
                catchError(this.handleError),
            )
    }

    public filterRelatedFiles(data) {
        const rows = 20
        const request = {
            file: data,
            page: 1,
            rows,
        }
        return this.http
            .post(this.servicesUrl + '/bulkPayments/processedFile/related', request)
            .pipe(
                map((response: any) => {
                    let result: any
                    const body = response

                    if (response.errorCode !== '0') {
                        return null
                    } else {
                        const output = body.files
                        const pagedData = new PagedData<any>()
                        const pageObject = new Page()
                        //
                        pageObject.pageNumber = 1
                        pageObject.pageSize = rows
                        pageObject.size = body.files.length
                        pageObject.totalElements = body.files.length
                        pageObject.totalPages =
                            pageObject.totalElements / pageObject.pageSize

                        pagedData.data = output
                        pagedData.page = pageObject
                        result = pagedData
                        return result
                    }
                }),
                catchError(this.handleError),
            )
    }

    public getFileDetail(value): Observable<any> {
        const data = {
            file: value,
            fromPage: 0,
            page: 1,
            print: true,
            rows: 20,
        }

        return this.http
            .post(this.servicesUrl + '/bulkPayments/processedFile/details', data)
            .pipe(
                map((response: any) => {
                    if (response.errorCode !== '0') {
                        return null
                    } else {
                        const output = response
                        return output
                    }
                }),
                catchError(this.handleError),
            )
    }

    public getViewCancel(value): Observable<any> {
        const data = {
            file: value,
            page: 1,
            rows: 20,
        }

        return this.http
            .post(this.servicesUrl + '/bulkPayments/sentFile/viewCancelFiles', data)
            .pipe(
                map((response: any) => {
                    if (response.errorCode !== '0') {
                        return null
                    } else {
                        const output = response
                        return output
                    }
                }),
                catchError(this.handleError),
            )
    }

    public deleteFile(value, request): Observable<any> {
        const data = {
            bulkFileCancel: value,
            requestValidate: request,
        }

        return this.http
            .post(this.servicesUrl + '/bulkPayments/sentFile/cancel', data)
            .pipe(
                map((response: any) => {
                    if (response.errorCode !== '0') {
                        return null
                    } else {
                        const output = response
                        return output
                    }
                }),
                catchError(this.handleError),
            )
    }

    downloadFile(bulkPaymentsDetails, fileDetail): Observable<any> {
        const data = {
            bulkPaymentsDetails,
            fileDetail,
        }
        return this.http.post(
            this.servicesUrl + '/bulkPayments/processedFile/exportFile',
            data,
            {responseType: 'blob'},
        )
    }

    downloadCombinedFileReceipt(data: CombinedFileDownloadRequest) {
        const output = {
            file: new Blob(),
            fileName: '',
        }
        return this.http.post(this.servicesUrl + '/bulkPayments/processedFile/combined-trx/receipt', data, {
            responseType: 'blob',
        })
            .pipe(
                map((res: any) => {
                    if (res.errorCode || res.type != 'application/pdf') {
                        return null
                    } else {
                        output.file = res
                        output.fileName = data.beneficiaryAccount +'-'+ data.systemLineReference
                        return output
                    }
                }),
            )
    }

}
