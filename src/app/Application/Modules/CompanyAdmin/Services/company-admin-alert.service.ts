import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {Observable, throwError as observableThrowError} from 'rxjs'
import {catchError, map} from 'rxjs/operators'
import {ConfigResourceService} from '../../../../core/config/config.resource.local'
import {Exception} from 'app/Application/Model/exception'
import {PagedData} from '../../../Model/paged-data'
import {DesactivateAlert} from '../Model/desactivate-alert'
import {RegistrationAlert} from '../Model/registration-alert'
import {RenewalAlert} from '../Model/renewal-alert'
import {ReportAlert} from '../Model/reports-alert'

@Injectable()
export class CompanyAdminAlertsService {
    constructor(private http: HttpClient, public config: ConfigResourceService) {
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

    registration(pageNumber: number, size: any): Observable<any> {
        const data = {
            page: pageNumber,
            rows: size,
        }
        const url = this.config.getServicesUrl() + '/smsAlerts/registration'
        return this.http.post(url, data).pipe(
            map((response: any) => {
                const body = response
                if (response.errorCode !== '0') {
                    const errorService: Exception = new Exception(
                        body.errorCode,
                        body.errorDescription,
                    )
                    return observableThrowError(errorService)
                } else {
                    const output = response
                    const result = new PagedData<RegistrationAlert>()
                    const page = result.page
                    page.pageNumber = pageNumber
                    page.pageSize = size
                    page.totalElements = output.companyUserAlertPaginateOutput.total
                    page.totalPages = output.companyUserAlertPaginateOutput.total / size
                    page.size =
                        output.companyUserAlertPaginateOutput.companyUserListDTO.length
                    result.data.push(output)
                    return result
                }
            }),
            catchError(this.handleError),
        )
    }

    registrationList(): Observable<any> {
        const url = this.config.getServicesUrl() + '/smsAlerts/registration/list'
        return this.http.get(url).pipe(
            map((response: any) => {
                const body = response
                if (response.errorCode !== '0') {
                    const errorService: Exception = new Exception(
                        body.errorCode,
                        body.errorDescription,
                    )
                    return observableThrowError(errorService)
                } else {
                    return response
                }
            }),
            catchError(this.handleError),
        )
    }

    confirmRegistration(account: Account, users: any[]): Observable<any> {
        const data = {
            accountSelected: account,
            usersListData: [],
        }

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < users.length; i++) {
            data.usersListData.push({
                fees: users[i].userFee,
                user: {
                    userPk: users[i].userPk,
                    userId: users[i].userId,
                    userName: users[i].userName,
                    type: users[i].userType,
                    mobile: users[i].mobileNumber,
                    email: users[i].email,
                },
            })
        }
        //
        //console.log(users);
        const url = this.config.getServicesUrl() + '/smsAlerts/registration/add'
        return this.http.post(url, data).pipe(catchError(this.handleError))
    }

    renewal(pageNumber: number, size: any): Observable<any> {
        const data = {
            page: pageNumber,
            rows: size,
        }

        const url = this.config.getServicesUrl() + '/smsAlerts/renewal'
        //console.log(body);
        return this.http.post(url, data).pipe(
            map((response: any) => {
                const body = response
                if (response.errorCode !== '0') {
                    const errorService: Exception = new Exception(
                        body.errorCode,
                        body.errorDescription,
                    )
                    return observableThrowError(errorService)
                } else {
                    const output = response
                    const result = new PagedData<RenewalAlert>()
                    const page = result.page
                    page.pageNumber = pageNumber
                    page.pageSize = size
                    page.totalElements = output.output.total
                    page.totalPages = output.output.total / size
                    page.size = output.output.reportList.length
                    result.data.push(output)
                    return result
                }
            }),
            catchError(this.handleError),
        )
    }

    renewalList(): Observable<any> {
        const url = this.config.getServicesUrl() + '/smsAlerts/renewal/list'
        return this.http.get(url).pipe(
            map((response: any) => {
                const body = response
                if (response.errorCode !== '0') {
                    const errorService: Exception = new Exception(
                        body.errorCode,
                        body.errorDescription,
                    )
                    return errorService
                } else {
                    return response
                }
            }),
            catchError(this.handleError),
        )
    }

    confirmRenewal(account: Account, users: any[]): Observable<any> {
        const data = {
            acc: account,
            listReports: users,
        }

        const url = this.config.getServicesUrl() + '/smsAlerts/renewal/add'
        //console.log(body);
        return this.http.post(url, data).pipe(
            map((response: any) => {
                const body = response
                if (response.errorCode !== '0') {
                    const errorService: Exception = new Exception(
                        body.errorCode,
                        body.errorDescription,
                    )
                    return observableThrowError(errorService)
                } else {
                    const output = response
                    const result = output

                    return result
                }
            }),
            catchError(this.handleError),
        )
    }

    desactivate(pageNumber: number, size: any): Observable<any> {
        const data = {
            page: pageNumber,
            rows: size,
        }
        const url = this.config.getServicesUrl() + '/smsAlerts/deactivate'
        //console.log(body);
        return this.http.post(url, data).pipe(
            map((response: any) => {
                const body = response
                if (response.errorCode !== '0') {
                    const errorService: Exception = new Exception(
                        body.errorCode,
                        body.errorDescription,
                    )
                    return observableThrowError(errorService)
                } else {
                    const output = response
                    const result = new PagedData<DesactivateAlert>()
                    const page = result.page
                    page.pageNumber = pageNumber
                    page.pageSize = size
                    page.totalElements = output.output.total
                    page.totalPages = output.output.total / size
                    page.size = output.output.reportList.length
                    result.data.push(output)
                    return result
                }
            }),
            catchError(this.handleError),
        )
    }

    desactivateList(): Observable<any> {
        const url = this.config.getServicesUrl() + '/smsAlerts/deactivate/list'
        return this.http.get(url).pipe(
            map((response: any) => {
                const body = response
                if (response.errorCode !== '0') {
                    const errorService: Exception = new Exception(
                        body.errorCode,
                        body.errorDescription,
                    )
                    return observableThrowError(errorService)
                } else {
                    return response
                }
            }),
            catchError(this.handleError),
        )
    }

    confirmDesactivate(users: any[]): Observable<any> {
        const data = {
            reportList: users,
        }
        const url = this.config.getServicesUrl() + '/smsAlerts/deactivate/add'
        //console.log(body);
        return this.http.post(url, data).pipe(
            map((response: any) => {
                const body = response
                if (response.errorCode !== '0') {
                    const errorService: Exception = new Exception(
                        body.errorCode,
                        body.errorDescription,
                    )
                    return observableThrowError(errorService)
                } else {
                    const output = response
                    const result = output

                    return result
                }
            }),
            catchError(this.handleError),
        )
    }

    solePropertyFreeSMSRegister(): Observable<any> {
        const url = this.config.getServicesUrl() + '/smsAlerts/soloProperty/freeSmsAlert/registration'
        return this.http.post(url, null, {headers: new HttpHeaders({'IgnoreError': "true"})}).pipe(
            map((response: any) => response)
        );
    }

    reports(pageNumber: number, size: any): Observable<any> {
        const data = {
            page: pageNumber,
            rows: size,
        }
        const url = this.config.getServicesUrl() + '/smsAlerts/reports'
        //console.log(body);
        return this.http.post(url, data).pipe(
            map((response: any) => {
                const body = response
                if (response.errorCode !== '0') {
                    const errorService: Exception = new Exception(
                        body.errorCode,
                        body.errorDescription,
                    )
                    return observableThrowError(errorService)
                } else {
                    const output = response
                    //
                    const result = new PagedData<ReportAlert>()
                    const page = result.page
                    page.pageNumber = pageNumber
                    page.pageSize = size
                    page.totalElements = output.output.total
                    page.totalPages = output.output.total / size
                    page.size = output.output.reportList.length
                    result.data.push(output)
                    return result
                }
            }),
            catchError(this.handleError),
        )
    }

    reportsList(): Observable<any> {
        const url = this.config.getServicesUrl() + '/smsAlerts/reports/list'
        return this.http.get(url).pipe(
            map((response: any) => {
                const body = response
                if (response.errorCode !== '0') {
                    const errorService: Exception = new Exception(
                        body.errorCode,
                        body.errorDescription,
                    )
                    return observableThrowError(errorService)
                } else {
                    return response
                }
            }),
            catchError(this.handleError),
        )
    }

    isSolePropertyAdmin(): Observable<any> {
        const url = this.config.getServicesUrl() + '/smsAlerts/soloProperty/validate'
        return this.http.get(url).pipe(
            map((response: any) => {
                if (response.errorCode !== '0') {
                    const errorService: Exception = new Exception(
                        response.errorCode,
                        response.errorDescription
                    )
                    return observableThrowError(errorService)
                } else {
                    return response
                }
            })
        )
    }





}
