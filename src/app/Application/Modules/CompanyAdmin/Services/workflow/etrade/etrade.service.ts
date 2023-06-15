import {HttpClient, HttpResponse} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {Observable, of, throwError as observableThrowError} from 'rxjs'
import {catchError, map} from 'rxjs/operators'
import {ConfigResourceService} from '../../../../../../core/config/config.resource.local'
import {Exception} from '../../../../../Model/exception'

@Injectable()
export class EtradeService {
    private serviceUrl: string

    constructor(private http: HttpClient, public config: ConfigResourceService) {
        this.serviceUrl = this.config.getServicesUrl()
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

    getCompanyDetails(): Observable<any> {
        return this.http.get(this.serviceUrl + '/eTrade/companyDetails')
        .pipe(
             map((response: any) => {
                 const body = response
                 console.log(response);
                 if (response.errorCode !== '0') {
                     const errorService: Exception = new Exception(
                         body.errorCode,
                         body.errorDescription,
                     )
                     return observableThrowError(errorService)
                 } else {
                     console.log(response);
                     return response
                 }
             }),
             catchError(this.handleError),
         )


    }


      validateCompanyDetails(companyEtradeFunctionList: any) {
        console.log(companyEtradeFunctionList)
        const data = {
            batchList: companyEtradeFunctionList,
        }
        return this.http
          .post(this.serviceUrl + '/workflow/eTrade/validate', data)
          .pipe(
            map((response: any) => {
              const body = response
              if (response.errorCode !== '0') {
                const exception: Exception = new Exception(
                  body.errorCode,
                  body.errorDescription,
                )
                return observableThrowError(exception)
              } else {
                return body
              }
            }),
            catchError(this.handleError),
          )
      }

      confirmCompanyDetails(values: any, _requestValidate: any) {
        const data = {
          batchList: values,
          requestValidate: _requestValidate,
        }
        return this.http
          .post(this.serviceUrl + '/workflow/eTrade/confirm', data)
          .pipe(
            map((response: any) => {
              const body = response
              if (response.errorCode !== '0') {
                const exception: Exception = new Exception(
                  body.errorCode,
                  body.errorDescription,
                  body.generateChallengeAndOTP,
                )
                return exception
              } else {
                return body
              }
            }),
            catchError(this.handleError),
          )
      }
}
