import {Injectable} from '@angular/core'
import {Observable, of} from 'rxjs'
import {map, catchError} from 'rxjs/operators'
import {HttpClient, HttpHeaders} from '@angular/common/http'
import {ConfigResourceService} from "../../../../../core/config/config.resource.local";
import {Exception} from "../../../../Model/exception";
import {AbstractService} from "../../../Common/Services/Abstract/abstract.service";

@Injectable()
export class UploadFileService extends AbstractService {

    constructor(protected http: HttpClient, public config: ConfigResourceService) {
        super(http, config)
    }

    public initiate(data: any): Observable<any> {
        return of({});
        /*
        return this.http
            .get(this.servicesUrl + '/governmentRevenue/file/initiate')
            .pipe(
                map((response: any) => {
                    const body = response
                    if (response.errorCode !== '0') {
                        const exception: Exception = new Exception(
                            body.errorCode,
                            body.errorDescription,
                        )
                        return exception
                    } else {
                        const output = body
                        return output
                    }
                }),
                catchError(this.handleError),
            )
         */
    }

    public validate(file: File, batchName: string, initiateData: any): Observable<any> {
        const data = {
            batchName,
            // initiateData.govRevenueCompanyDetails,
            // initiateData.accountListDTOLocal
        }

        const formData = new FormData()

        formData.append('json', JSON.stringify(data))
        formData.append('file', file)
        const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data')

        return this.http
            .post(this.servicesUrl + '/governmentRevenue/file/validate', formData, {
                headers,
            })
            .pipe(
                map((response: any) => {
                    const body = response
                    if (response.errorCode !== '0') {
                        const exception: Exception = new Exception(
                            body.errorCode,
                            body.errorDescription,
                        )
                        return exception
                    } else {
                        const output = body
                        return output
                    }
                }),
                catchError(this.handleError),
            )
    }

    public confirm(batchDTO: any, requestValidate: any): Observable<any> {

        const data = {
            govRevenueFileUploadBatchDSO: batchDTO.govRevenueFileUploadBatchDSO,
            requestValidate,
        }

        return this.http
            .post(this.servicesUrl + '/governmentRevenue/file/confirm', data)
            .pipe(
                map((response: any) => {
                    const body = response
                    if (response.errorCode !== '0') {
                        const exception: Exception = new Exception(
                            body.errorCode,
                            body.errorDescription,
                        )
                        return exception
                    } else {
                        const output = body
                        return output
                    }
                }),
                catchError(this.handleError),
            );
    }
}
