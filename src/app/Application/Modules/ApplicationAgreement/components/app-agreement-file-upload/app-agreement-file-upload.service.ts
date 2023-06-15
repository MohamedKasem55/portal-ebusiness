import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ConfigResourceService} from "../../../../../core/config/config.resource.local";
import {Observable} from 'rxjs'

@Injectable({
    providedIn: 'root'
})
export class AppAgreementFileUploadService {
    private servicesUrl = this.config.getServicesUrl()

    constructor(private http: HttpClient,
                public config: ConfigResourceService) {
    }

    public uploadAgreement(uploadAgreementReq: any) {
        const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data')
        return this.http
            .post(this.servicesUrl + `/template/upload/`, uploadAgreementReq, {headers})
    }

    public regions(): Observable<any> {
        const data: any = {}
        data.name = 'agreementRegion'
        return this.http.post(this.servicesUrl + '/statics/model', data)
    }


}
