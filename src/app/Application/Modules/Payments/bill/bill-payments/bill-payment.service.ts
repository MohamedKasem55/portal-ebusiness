import {DatePipe} from '@angular/common'
import {HttpClient, HttpParams} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {map} from 'rxjs/operators'
import {ConfigResourceService} from '../../../../../core/config/config.resource.local'
import {AuthenticationService} from '../../../../../core/security/authentication.service'
import {Page} from '../../../../Model/page'
import {PagedData} from '../../../../Model/paged-data'
import {BillPayment} from '../../Model/bill-payment'

@Injectable()
export class BillPaymentService {
    servicesUrl: string
    statusValue

    constructor(
        private datePipe: DatePipe,
        private http: HttpClient,
        public config: ConfigResourceService,
        public authenticationService: AuthenticationService,
    ) {
        this.servicesUrl = config.getServicesUrl()
    }

    public getResults(
        page: number,
        rows: number,
        searchAmountFrom: number,
        searchAmountTo: number,
        searchBillCode: any,
        searchBillRef: string,
        searchDateFrom: Date,
        searchDateTo: Date,
        searchNickname: string,
    ): Observable<any> {
        const data: any = {}
        data.page = page + 1
        data.rows = rows
        if (searchAmountFrom) {
            data.searchAmountFrom = searchAmountFrom
        }
        if (searchAmountTo) {
            data.searchAmountTo = searchAmountTo
        }
        if (searchBillCode) {
            data.searchBillCode = searchBillCode.billCode
        }
        if (searchBillRef) {
            data.searchBillRef = searchBillRef
        }
        if (searchDateFrom || searchDateTo) {
            data.searchDateFrom = '1900-01-01'
            data.searchDateTo = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
        }
        if (searchDateFrom) {
            data.searchDateFrom = this.datePipe.transform(
                searchDateFrom,
                'yyyy-MM-dd',
            )
        }
        if (searchDateTo) {
            data.searchDateTo = this.datePipe.transform(searchDateTo, 'yyyy-MM-dd')
        }
        if (searchNickname) {
            data.searchNickname = searchNickname
        }

        return this.http
            .post(this.servicesUrl + '/billPaymentService/list', data)
            .pipe(
                map((response: any) => {
                    const result: any = {}

                    const output = response
                    if (output.errorCode !== '0') {
                        result.error = true
                        result.errorCode = output.errorCode
                        result.errorDescription = output.errorDescription

                        result.pagedData = new PagedData<BillPayment>()
                        result.billCodes = []
                        const pageObject = new Page()

                        pageObject.pageNumber = page
                        pageObject.pageSize = rows ? rows : 50
                        pageObject.size = 0
                        pageObject.totalElements = 0
                        pageObject.totalPages =
                            pageObject.totalElements / pageObject.pageSize

                        result.pagedData.page = pageObject
                        result.pagedData.data = []
                    } else {
                        result.error = false
                        result.pagedData = new PagedData<BillPayment>()
                        result.billCodes = output.billCodeList
                        const body = output.searchBillList
                        const pageObject = new Page()

                        pageObject.pageNumber = page
                        pageObject.pageSize = rows ? rows : 50
                        pageObject.size = body.billsList.length
                        pageObject.totalElements = body.total
                        pageObject.totalPages =
                            pageObject.totalElements / pageObject.pageSize

                        result.pagedData.page = pageObject
                        for (let _i = 0; _i < pageObject.size - 1; _i++) {
                            const jsonObj = body.billsList[_i]
                            jsonObj.billPaymentDetailsPk = jsonObj.billCode + jsonObj.billRef
                            const element = new BillPayment(
                                jsonObj.billPaymentDetailsPk,
                                jsonObj.billCode,
                                jsonObj.billRef,
                                jsonObj.nickname,
                                jsonObj.amount,
                                jsonObj.amountPaid,
                                jsonObj.amountWithoutVat,
                                jsonObj.vatAmount,
                                jsonObj.dueDate,
                                jsonObj.statusCode,
                                jsonObj.save,
                                jsonObj.advanced,
                                jsonObj.addDescriptionEn,
                                jsonObj.addDescriptionAr,
                                jsonObj.applyVat,
                                jsonObj.partial,
                                jsonObj.futureSecurityLevelsDTOList,
                            )
                            result.pagedData.data.push(element)
                        }
                        result['accounts'] = output.accountsWithSaudiRials
                        result.pagedData.data = body.billsList
                        //console.log(result.pagedData.data);
                        for (const value of result.pagedData.data) {
                            if (value.amount > 0) {
                                value.status1 = 'D'
                            } else {
                                if (value.advanced) {
                                    value.status1 = 'A'
                                } else {
                                    value.status1 = 'P'
                                }
                            }
                            //console.log(result)
                        }
                    }
                    return result
                }),
            )
    }

    public updateNickname(newNickname: string, value): Observable<any> {
        const data: any = {}
        //
        this.statusValue = value.status1
        data.newNickName = newNickname
        data.billPaymentDetails = {}
        data.billPaymentDetails = value
        data.billPaymentDetails.status = true
        data.billPaymentDetails.status1 = undefined
        const body = JSON.stringify(data)

        return this.http
            .put(this.servicesUrl + '/billPaymentService/updatingNickame', body)
            .pipe(
                map((response: any) => {
                    const result: any = {}
                    data.billPaymentDetails.status1 = this.statusValue
                    const output = response
                    if (output != null) {
                        if (output.errorCode !== '0') {
                            result.error = true
                            result.errorCode = output.errorCode
                            result.errorDescription = output.errorDescription
                        }
                    } else {
                        result.error = true
                        result.errorCode = 999
                        result.errorDescription = 'Generic Error'
                    }

                    return result
                    //
                }),
            )
    }

    getBillCodes(): Observable<any> {
        return this.http
            .get(this.servicesUrl + '/billPaymentService/management/getBillCodes')
            .pipe(
                map((response: any) => {
                    const result: any = {}
                    const output = response

                    if (output.errorCode !== '0') {
                        result.error = true
                        result.errorDescription = output.errorDescription
                        result.errorCode = output.errorCode
                    } else {
                        result.billCodes = output.billCodesList.billsList
                    }
                    return result
                }),
            )
    }

    payBills(
        batchListsContainer: any,
        challenge: any,
        request: any,
    ): Observable<any> {
        const data: any = {}
        data.requestValidate = {
            challengeNumber:
                challenge && 'CHALLENGE' == challenge.typeAuthentication
                    ? request.challengeNumber
                    : '',
            challengeResponse:
                challenge && 'CHALLENGE' == challenge.typeAuthentication
                    ? request.challengeResponse
                    : '',
            otp:
                challenge && 'OTP' == challenge.typeAuthentication ? request.otp : '',
            password:
                challenge && 'STATIC' == challenge.typeAuthentication
                    ? request.password
                    : '',
        }
        data.batchListsContainer = batchListsContainer
        data.emailChecked = '0'

        return this.http
            .post(this.servicesUrl + '/billPaymentService/registerBillPay', data)
            .pipe(
                map((response: any) => {
                    const result: any = {}

                    const output = response
                    if (output.errorCode !== '0') {
                        result.error = true
                        result.errorDescription = output.errorDescription
                        result.errorCode = output.errorCode
                    } else {
                        result.error = false
                        for (let i = 0; i < output.billPayProcessList.length; ++i) {
                            output.billPayProcessList[i]['originalAmount'] =
                                data.batchListsContainer.toProcess[i]['amountOriginal']
                            output.billPayProcessList[i]['vatAmount'] =
                                data.batchListsContainer.toProcess[i]['vatAmount']
                            output.billPayProcessList[i]['amountWithoutVat'] =
                                data.batchListsContainer.toProcess[i]['amountWithoutVat']
                            output.billPayProcessList[i]['paymentType'] =
                                data.batchListsContainer.toProcess[i]['paymentType']
                            if (output.billPayProcessList[i].amountPaid < 0) {
                                output.billPayProcessList[i]['billStatus'] = 'A'
                            } else if (output.billPayProcessList[i].amountPaid > 0) {
                                output.billPayProcessList[i]['billStatus'] = 'D'
                            } else if (output.billPayProcessList[i].amountPaid == 0) {
                                output.billPayProcessList[i]['billStatus'] = 'P'
                            }
                        }
                        result.billPayProcessList = output.billPayProcessList

                    }
                    return result
                }),
            )
    }

    deleteBills(
        accountSelected: any,
        billSelecteds: any,
        challenge: any,
        request: any,
    ): Observable<any> {
        const data: any = {}

        data.billsToDelete = []
        for (const bill of billSelecteds) {
            data.billsToDelete.push({
                billCodeSelected: bill.billCode,
                billReference: bill.billRef,
                billCode: bill.billCode,
            })
        }
        const body = JSON.stringify(data)

        return this.http
            .post(this.servicesUrl + '/billPaymentService/management/delete', body)
            .pipe(
                map((response: any) => {
                    const result: any = {}

                    const output = response
                    if (output.errorCode !== '0') {
                        result.error = true
                        result.errorDescription = output.errorDescription
                        result.errorCode = output.errorCode
                    } else {
                        result.error = false
                    }

                    return result
                }),
            )
    }

    validateNewBill(
        billCodeSelected: string,
        billReference: string,
        nickname: string,
    ): Observable<any> {
        const data: any = {}
        data.billCodeSelected = billCodeSelected
        data.billReference = billReference
        data.newNickName = nickname

        const body = JSON.stringify(data)

        return this.http
            .post(this.servicesUrl + '/billPaymentService/management/validate', body)
            .pipe(
                map((response: any) => {
                    const output = response

                    return output
                }),
            )
    }

    addNewBill(batch: any, requestValidate: any): Observable<any> {
        const data: any = {}
        data.billAddBatch = batch
        data.requestValidate = requestValidate

        const body = JSON.stringify(data)

        return this.http
            .post(this.servicesUrl + '/billPaymentService/management/register', body)
            .pipe(
                map((response: any) => {
                    const result: any = {}

                    const output = response

                    if (output.errorCode !== '0') {
                        result.error = true
                        result.errorDescription = output.errorDescription
                        result.errorCode = output.errorCode
                    } else {
                        result.error = false
                    }

                    return output
                }),
            )
    }

    validate(accountSelected: any, billSelecteds: any, step?: any): Observable<any> {
        const data: any = {}
        data.accountNumber = accountSelected.fullAccountNumber
        data.emailChecked = '0'
        data.billSelected = []
        for (const bill of billSelecteds) {
            data.billSelected.push({
                billCodeSelected: bill.billCode,
                billReference: bill.billRef,
                amountPaid: bill.amount,
                nickName: bill.nickname,
                dueDate: this.datePipe.transform(bill.dueDate, 'yyyy-MM-dd'),
            })
        }

        const body = JSON.stringify(data)
        const reqOptions = new HttpParams().append('inquiry', 'true')

        return this.http
            .post(this.servicesUrl + '/billPaymentService/validateBillPay', body,step===1
            ? {
                params: reqOptions,
              }
              : undefined)
            .pipe(
                map((response: any) => {
                    const output = response
                    //

                    return output
                }),
            )
    }

    getFile() {
        const output = {
            file: new Blob(),
            fileName: '',
        }

        return this.http
            .get(this.servicesUrl + '/billPaymentService/getBulkTemplate', {
                responseType: 'blob',
            })
            .pipe(
                map((res: any) => {
                    if (!res.errorCode) {
                        output.file = res
                        output.fileName = "BulkBillPayment.xls"
                        return output
                    } else {
                        return res
                    }
                }),
            )
    }
}
