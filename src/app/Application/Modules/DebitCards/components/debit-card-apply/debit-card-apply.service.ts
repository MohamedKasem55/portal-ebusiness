import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ConfigResourceService} from "../../../../../core/config/config.resource.local";
import {AbstractService} from "../../../Common/Services/Abstract/abstract.service";
import {Observable} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {SimpleMQ} from "ng2-simple-mq";
import {ConfirmMadaCardRequest} from "./confirm-mada-card-request";

@Injectable()
export class DebitCardApplyService extends AbstractService {
    headers = new HttpHeaders({'IgnoreError': 'true'})

    constructor(
        protected http: HttpClient,
        private smq: SimpleMQ,
        public config: ConfigResourceService,
    ) {
        super(http, config)
    }

    initializeApplyMadaDebitCard(): Observable<any> {
        return this.http.post(this.servicesUrl + '/debitcard/init', {})
    }
    getAllCitiesOfBranches(): Observable<any> {
        const req = {"name": "allCititesOfBranches"}
        return this.http.post(this.servicesUrl + '/statics/model', req)
    }


    getBranchList(city): Observable<any> {
        const req = {"name":"allCititesOfBranches","key":city}
        return this.http.post(this.servicesUrl + '/statics/getBranchOfCity', req)
    }

    sendOwnerOTP(): Observable<any> {
        return this.http.post(this.servicesUrl + '/debitcard/validate', {})
    }

    applyMadaDebitCard(request: ConfirmMadaCardRequest): Observable<any> {
        return this.http.post(this.servicesUrl + '/debitcard/confirm', request, {headers: this.headers}).pipe( map((response: any) => response),
            catchError(this.handleError));
    }

    public getTermsAndConditions(file: string, fileName) {
        return this.http
            .get(`${this.config.getDocumentUrl()}/${file}`, {
                responseType: 'blob',
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
                }),
            )
    }

}
