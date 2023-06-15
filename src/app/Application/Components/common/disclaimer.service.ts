import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {ConfigResourceService} from "../../../core/config/config.resource.local";
import {Observable} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {Exception} from "../../Model/exception";
import {throwError as observableThrowError} from "rxjs/internal/observable/throwError";

@Injectable()
export class DisclaimerService {


    private servicesUrl: string
    constructor(
        private http: HttpClient,
        public config: ConfigResourceService
    ) {
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

    public closeFreeSmsAlert(): Observable<any> {
        return this.http.get(this.servicesUrl + '/smsAlerts/soloProperty/closeFreeSmsAlert' )
            .pipe(
                map((response: any) => {
                    const body = response
                    return body || {}
                }),
                catchError(this.handleError),
            );


    }


}
