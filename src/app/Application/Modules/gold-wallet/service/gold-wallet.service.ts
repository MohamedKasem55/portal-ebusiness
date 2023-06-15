import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ConfigResourceService} from "../../../../core/config/config.resource.local";
import {AbstractService} from "../../Common/Services/Abstract/abstract.service";
import {Observable} from "rxjs";
import {WalletOnBoardingValidationRequest} from "../model/wallet-on-boarding-validation-request";
import {WalletOnBoardingConfirmReq} from "../model/wallet-on-boarding-confirm-req";
import {GoldWalletTransactionsReq} from "../model/gold-wallet-transactions-req";
import {BuyGoldValidateReq} from "../model/buy-gold-validate-req";
import {BuyGoldConfirmReq} from "../model/buy-gold-confirm-req";
import {SellGoldValidateReq} from "../model/sell-gold-validate-req";
import {SellGoldConfirmReq} from "../model/sell-gold-confirm-req";
import {catchError, map} from "rxjs/operators";
import {SimpleMQ} from "ng2-simple-mq";
import {GoldWalletDashboardRes} from "../model/gold-wallet-dashboard-res";
import {GoldDetails} from "../model/gold-wallet-transactions-res";

@Injectable()
export class GoldWalletService extends AbstractService {

    dashboard: GoldWalletDashboardRes;
    transactionDetails: GoldDetails;
    public callBackTimes = 0;

    constructor(public http: HttpClient,
                public config: ConfigResourceService,
                private smq: SimpleMQ) {
        super(http, config);
        this.servicesUrl = config.getServicesUrl().concat('/gold-wallet/')

    }

    getTermsAndConditions(file: string) {
        return this
            .http.get(`${this.config.getDocumentUrl()}/${file}`, {
                responseType: 'blob'
            });
    }

    downloadTermsAndConditions(file: string, fileName) {
        return this.http
            .get(`${this.config.getDocumentUrl()}/${file}`, {
                responseType: 'blob'
            })
            .pipe(
                map((res: any) => {
                    const urlBlob = URL.createObjectURL(res);
                    const link = document.createElement('a');
                    link.download = fileName;
                    link.href = urlBlob;
                    document.body.appendChild(link);
                    link.click();
                }),
                catchError((): Observable<any> => {
                    this.smq.publish(
                        'error-mq',
                        'Document Not Found',
                    );
                    return null;
                })
            )
    }

    checkWalletAvaility(): Observable<any> {
        return this.doGet(this.servicesUrl + 'on-boarding/initiate');
    }

    validateWalletOnBoarding(request: WalletOnBoardingValidationRequest): Observable<any> {
        return this.doPost(this.servicesUrl + 'on-boarding/validate', request);
    }

    confirmWalletOnBoarding(request: WalletOnBoardingConfirmReq): Observable<any> {
        return this.http.post(this.servicesUrl + 'on-boarding/confirm', request, {headers: new HttpHeaders({'IgnoreError': "true"})});
    }

    getWalletDashboard(): Observable<any> {
        return this.doGet(this.servicesUrl + 'dashboard');
    }

    getWalletTransactions(req: GoldWalletTransactionsReq): Observable<any> {
        return this.doPost(this.servicesUrl + 'transactions', req);
    }

    getAvailableGoldBullion(): Observable<any> {
        return this.doGet(this.servicesUrl + 'buy-gold/available-bullion');
    }

    validateBuyGold(req: BuyGoldValidateReq): Observable<any> {
        return this.doPost(this.servicesUrl + 'buy-gold/validate', req);
    }

    confirmBuyGold(req: BuyGoldConfirmReq): Observable<any> {
        return this.http.post(this.servicesUrl + 'buy-gold/confirm', req, {headers: new HttpHeaders({'IgnoreError': "true"})});
    }

    getSellGoldPrice(): Observable<any> {
        return this.doGet(this.servicesUrl + 'sell-gold/price');
    }

    validateSellGold(req: SellGoldValidateReq): Observable<any> {
        return this.doPost(this.servicesUrl + 'sell-gold/validate', req);
    }

    confirmSellGold(req: SellGoldConfirmReq): Observable<any> {
        return this.http.post(this.servicesUrl + 'sell-gold/confirm', req, {headers: new HttpHeaders({'IgnoreError': "true"})});
    }

    setDashboardObject(dashboard) {
        this.dashboard = dashboard;
    }

    getDashBoardObject() {
        return this.dashboard;
    }

    setTransaction(trnx) {
        this.transactionDetails = trnx;
    }

    getTransaction() {
        return this.transactionDetails;
    }

    getSARAccounts(): Observable<any> {
        return this.http.get(this.config.getServicesUrl() + '/userProfile/getSARAccounts').pipe(
            map((response: any) => response),
            catchError(this.handleError),
        )
    }
}
