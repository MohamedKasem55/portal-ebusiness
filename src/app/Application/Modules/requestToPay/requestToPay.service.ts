import {Injectable} from "@angular/core";
import {catchError, map} from "rxjs/operators";
import {AbstractService} from "../Common/Services/Abstract/abstract.service";
import {HttpClient} from "@angular/common/http";
import {ConfigResourceService} from "../../../core/config/config.resource.local";
import {FormBuilder} from "@angular/forms";
import {CommonValidators} from "../Common/constants/common-validators.service";
import {SimpleMQ} from "ng2-simple-mq";
import {Observable} from "rxjs";
import {Exception} from "../../Model/exception";
import {throwError as observableThrowError} from "rxjs/internal/observable/throwError";


@Injectable()
export class RequestToPayService extends AbstractService {

    constructor(
        protected http: HttpClient,
        public config: ConfigResourceService,
        protected fb: FormBuilder,
        public commonValidators: CommonValidators,
        private smq: SimpleMQ,
    ) {
        super(http, config)
    }

    public initiateRTP(): Observable<any> {
        return this.http.post(this.servicesUrl + '/rtp-creditor/initiateRTP', {}).pipe(
            map((response: any) => response),
            catchError(this.handleError),
        )
    }

    public initiateValidateRTP(data): Observable<any> {
        return this.http.post(this.servicesUrl + '/rtp-creditor/initiateValidateRTP', data).pipe(
            map((response: any) => response),
            catchError(this.handleError),
        )
    }

    public initiateConfirmRTP(data): Observable<any> {
        return this.http.post(this.servicesUrl + '/rtp-creditor/initiateConfirmRTP', data).pipe(
            map((response: any) => response),
            catchError(this.handleError),
        )
    }

    public getSentRequest(page, rows): Observable<any> {
        return this.http.get(this.servicesUrl + '/rtp-creditor/getListSentRTP/' + page + '/' + rows).pipe(
            map((response: any) => response),
            catchError(this.handleError),
        )
    }

    public getSentRTPDetails(rtpId): Observable<any> {
        return this.http.get(this.servicesUrl + '/rtp-creditor/getSentRTPDetails/' + rtpId).pipe(
            map((response: any) => response),
            catchError(this.handleError),
        )
    }

    public getReceivedRTPDetails(rtpId): Observable<any> {
        return this.http.get(this.servicesUrl + '/rtp-received/getReceivedRTPDetails/' + rtpId).pipe(
            map((response: any) => response),
            catchError(this.handleError),
        )
    }

    public getReceivedRequest(page, rows): Observable<any> {
        return this.http.get(this.servicesUrl + '/rtp-received/getListReceivedRTP/' + page + '/' + rows).pipe(
            map((response: any) => response),
            catchError(this.handleError),
        )
    }

    public getTransferPurposes(): Observable<any> {
        return this.http.post(this.servicesUrl + '/transfers/reasons', {
            transferPurposeType: 'LOCAL',
        }).pipe(
            map((response: any) => response),
            catchError(this.handleError),
        )
    }

    public getParticipantBankList() {
        return this.http.get(this.servicesUrl + '/ips/paymentOrder/participantbank').pipe(
            map((response: any) => response),
            catchError(this.handleError),
        )
    }


    public cancelRTPRequest(data) {
        return this.http.post(this.servicesUrl + '/rtp-creditor/cancelRTPRequest', data).pipe(
            map((response: any) => response),
            catchError(this.handleError),
        )
    }

    public rejectRTPRequest(data) {
        return this.http.post(this.servicesUrl + '/rtp-received/rejectRTPRequest', data).pipe(
            map((response: any) => response),
            catchError(this.handleError),
        )
    }


    public acceptRTPRequest(data) {
        return this.http.post(this.servicesUrl + '/rtp-received/acceptRTPRequest', data).pipe(
            map((response: any) => response),
            catchError(this.handleError),
        )
    }

    public acceptValidateRTPRequest(data) {
        return this.http.post(this.servicesUrl + '/rtp-received/acceptValidateRTPRequest', data).pipe(
            map((response: any) => response),
            catchError(this.handleError),
        )
    }


    public getAccounts() {
        return this.http.get(this.servicesUrl + '/userProfile/getSARAccounts').pipe(
            map((response: any) => response),
            catchError(this.handleError),
        )
    }

    public later() {
        return this.http.post(this.servicesUrl + '/rtp-received/remindMeLater', {}).pipe(
            map((response: any) => response),
            catchError(this.handleError),
        )
    }

}