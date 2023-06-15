
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigResourceService } from 'app/core/config/config.resource.local';

@Injectable()
export class RequestStatusService {
    route = '/userManagement/requestStatus/'
    servicesUrl: string;
    userDetails: any;
    constructor(private http: HttpClient, private config: ConfigResourceService) {

        this.servicesUrl = config.getServicesUrl();
    }

    getList(page, rows): Observable<any> {
        const data: any = {};
        data.page = page;
        data.rows = rows;

        const body = JSON.stringify(data);

        return this.http.post(this.servicesUrl + this.route + "list", body).pipe(map((response: any, index: number) => {
            let result: any = {};

            const output = response;

            if (output.errorCode !== "0") {
                result.error = true;
                result.errorCode = output.errorCode;
                result.errorDescription = output.errorDescription;
            }
            else {
                result = output;
                if (result) {
                    const items = result['userBatchList']['items'].sort((a, b) => {
                        return a['initiationDate'] > b['initiationDate'] ? -1 : b['initiationDate'] > a['initiationDate'] ? 1 : 0
                    })
                }
                result.error = false;
            }
            return result;
        }));

    }

    setUserDetails(details) {
        this.userDetails = details;

    }

    getUserDetails() {
        return this.userDetails;
    }


}