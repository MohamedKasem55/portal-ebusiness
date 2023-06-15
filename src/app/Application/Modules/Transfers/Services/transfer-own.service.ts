import {HttpClient, HttpResponse} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {Observable, throwError as observableThrowError} from 'rxjs'
import {catchError, map} from 'rxjs/operators'
import {ConfigResourceService} from '../../../../core/config/config.resource.local'
import {Account} from '../../../Model/account'
import {Exception} from 'app/Application/Model/exception'
import {TransferLimit} from '../Model/transfer-limit'
import {ExchangeRateRequest} from "../../../Model/ExchangeRateRequest";
import {ExchangeRateResponse} from "../../../Model/ExchangeRateResponse";
import {OwnTransferValidate} from "../Model/own-transfer-validate";
import {RequestValidate} from "../../../Model/requestvalidateType";

@Injectable()
export class TransferOwnService {
    servicesUrl: string

    constructor(private http: HttpClient, public config: ConfigResourceService) {
        this.servicesUrl = config.getServicesUrl()
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

    public limit(): Observable<any> {
        const data = {}

        return this.http
            .get(this.servicesUrl + '/transfers/own/initiate/v2', data)
            .pipe(
                map((response: any) => {
                    if (response.errorCode !== '0') {
                        return null
                    } else {
                        const output = response
                        //let output = TransferLimitMock;
                        const result = new TransferLimit(output.transferLimit)
                        const accounts = output.accountList
                        // tslint:disable-next-line:prefer-for-of
                        for (let i = 0; i < accounts.length; i++) {
                            result.accountList.push(accounts[i] as Account)
                        }
                        // tslint:disable-next-line:prefer-for-of
                        for (let i = 0; i < accounts.length; i++) {
                            result.accountListTo.push(accounts[i] as Account)
                        }
                        return result
                    }
                }),
                catchError(this.handleError),
            )
    }

    public valid(object: OwnTransferValidate): Observable<any> {
        const body = JSON.stringify(object)
        return this.http
            .post(this.servicesUrl + '/transfers/own/validate/v2', body)
            .pipe(
                map((response: any) => {
                    if (response.errorCode !== '0') {
                        return null
                    } else {
                        return response
                    }
                }),
                catchError(this.handleError),
            )
    }

    public add(accountFrom: Account,
               accountTo: Account,
               remarks: string,
               currencyDeal: string,
               amountDealt: any,
               checkAndSeparateInitiationPermission: any,
               inqRates?: any,
               requestValidate?: RequestValidate): Observable<any> {
        const data = {
            accountDTOFrom: accountFrom,
            accountDTOTo: accountTo,
            remarks: remarks,
            currencyDeal: currencyDeal,
            amountDealt: amountDealt,
            inqRates: inqRates,
            batchList: checkAndSeparateInitiationPermission,
            requestValidate: requestValidate
        }
        //
        const body = JSON.stringify(data)
        return this.http
            .post(this.servicesUrl + '/transfers/own/confirm/v2', body)
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

    /**
     * @description Get Exchange Rate For Own Account transfer
     *
     * @param exchangeRateRequest

     * @returns Observable<ExchangeRateResponse>
     *
     * */
    public getExchangeRate(exchangeRateRequest: ExchangeRateRequest) {

        const body = JSON.stringify(exchangeRateRequest)
        return this.http
            .post(this.servicesUrl + '/exchange/fxrates', body)
            .pipe(
                map((response: any) => {
                    if (response.errorCode && response.errorCode !== '0') {
                        return null
                    } else {
                        const output = response
                        return output
                    }
                }),
                catchError(this.handleError),
            )
    }
}
