import {HttpClient, HttpResponse} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {Observable, of} from 'rxjs'
import {catchError, map} from 'rxjs/operators'
import {ConfigResourceService} from '../../../../../core/config/config.resource.local'
import {AbstractActionForWizardService} from '../../../Common/Services/Abstract/abstract-action-for-wizard.service'
import {AbstractService} from "../../../Common/Services/Abstract/abstract.service";
import {PagedData} from "../../../../Model/paged-data";
import {AccountsPosTerminalList} from "../../../PoSStatement/accounts-pos-terminal-list.model";
import {Page} from "../../../../Model/page";
import {Exception} from "../../../../Model/exception";
import {throwError as observableThrowError} from "rxjs/internal/observable/throwError";

@Injectable()
export class BulkPaymentsService extends AbstractService {
    constructor(
        protected http: HttpClient,
        public config: ConfigResourceService,
    ) {
        super(http, config)
    }


    public handleError(error: HttpResponse<any> | any) {
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

    //-----------------------------------------------------------------------

    getDownloadedFile(file): Observable<any> {
        const output = {
            file: new Blob(),
            fileName: file,
        }
        const data = {
            name: file
        }

        return this.http
            .post(this.servicesUrl + '/template/download', data, {
                responseType: 'blob',
            })
            .pipe(
                map((res) => {
                    output.file = res
                    output.fileName = data.name
                    return output
                }),
            )
    }


    public prepareBulkAlienControl(batch: any): Observable<any> {
        let data = {
            batch
        }
        return this.http
            .post(this.servicesUrl + '/moiPayment/prepareAlienControl/withoutInquiry', data)
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


    public validate(data): Observable<any> {
        return this.http
            .post(this.servicesUrl + '/moiPayment/validate', data)
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

    public confirm(data): Observable<any> {
        return this.http
            .post(this.servicesUrl + '/moiPayment/confirm', data)
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

    public getModel(name): Observable<any> {
        const data: any = {}
        data.name = name
        return this.http.post(this.servicesUrl + '/statics/model', data).pipe(
            map((response: any) => {
                return response['props']
            }),
        )
    }
}
