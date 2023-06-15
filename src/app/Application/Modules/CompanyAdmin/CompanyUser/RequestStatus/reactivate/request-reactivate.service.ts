
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Exception } from 'app/Application/Model/exception';
import { ConfigResourceService } from 'app/core/config/config.resource.local';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';



@Injectable()
export class RequestReactivateService {
    servicesUrl: string;
    dateFormat = "yyyy-MM-dd";
    route = '/userManagement/requestStatus/'
    constructor(
        private http: HttpClient,
        public config: ConfigResourceService) {

        this.servicesUrl = config.getServicesUrl();
    }

    public handleError(error: HttpResponse<any> | any) {
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof HttpResponse) {

            const err = error['error'] || JSON.stringify(error);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        // console.error(errMsg);
        const errorService: Exception = new Exception('handle', errMsg);
        return observableThrowError(errorService);
    }

    getDetails(userBatch): Observable<any> {
        const data = {
            userBatch: userBatch
        };

        return this.http.post(this.servicesUrl + this.route + "details", data).pipe(map((response: any, index: number) => {
            const body = response;
            if (response.errorCode !== "0") {
                const exception: Exception = new Exception(body.errorCode, body.errorDescription);
                return exception;
            }
            else {
                const output = body;
                return output;
            }
        }), catchError(this.handleError));

    }

    getInit(): Observable<any> {

        return this.http.get(this.servicesUrl + "/userManagement/register/init").pipe(map((response: any, index: number) => {
            const body = response;
            if (response.errorCode !== "0") {
                const exception: Exception = new Exception(body.errorCode, body.errorDescription);
                return exception;
            }
            else {
                const output = body;
                return output;
            }
        }), catchError(this.handleError));

    }


    public validate(batch): Observable<any> {
        //console.log('acounts',accounts,form.account);
        const data = {
            userBatch: batch,
        }
        return this.http.post(this.servicesUrl + this.route + "validate", data).pipe(map((response: any) => {
            const body = response;
            if (response.errorCode !== "0") {
                const exception: Exception = new Exception(body.errorCode, body.errorDescription);
                return exception;
            }
            else {
                const output = body;
                return output;
            }
        }), catchError(this.handleError));
    }



    public save(batch, requestValidate): Observable<any> {
        const data = {
            userBatch: batch,
            requestValidate,
        };
        return this.http.post(this.servicesUrl + this.route + "confirm", data).pipe(map((response: any) => {
            const body = response;
            if (response.errorCode !== "0") {
                const exception: Exception = new Exception(body.errorCode, body.errorDescription, body.generateChallengeAndOTP);
                return exception;
            }
            else {
                return body;
            }
        }), catchError(this.handleError));

    }

    public delete(batch): Observable<any> {
        const data = {
            userBatch: batch,
        };
        let _param: HttpParams = new HttpParams();
        _param = _param.append("deletebody", JSON.stringify(data));
        return this.http.delete(this.servicesUrl + this.route + "delete", { params: _param }).pipe(map((response: any) => {
            const body = response;
            if (response.errorCode !== "0") {
                const exception: Exception = new Exception(body.errorCode, body.errorDescription);
                return exception;
            }
            else {
                return body;
            }
        }), catchError(this.handleError));

    }





}