import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../../../../core/config/config.resource.local'
import { DateFormatPipe } from '../../../../../../../Components/common/Pipes/date-format-pipe'
import { Exception } from '../../../../../../../Model/exception'

@Injectable()
export class RequestReactivateUploadFileService {
  servicesUrl: string
  dateFormat = 'yyyy-MM-dd'

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    private dateFormatPipe: DateFormatPipe,
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

  public reInitiateUploadFile(batch): Observable<any> {
    const data = batch
    return this.http
      .post(
        this.servicesUrl + '/payrollCards/requestStatus/uploadFile/validate',
        data,
      )
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

  public saveUploadFile(batch, requestValidate): Observable<any> {
    const data = {
      payrollCardUploadBatch: batch,
      requestValidate,
    }

    return this.http
      .post(
        this.servicesUrl + '/payrollCards/requestStatus/uploadFile/confirm',
        data,
      )
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

  public deleteUploadFile(batch): Observable<any> {
    const data = {
      payrollCardUploadBatch: batch,
    }

    let _param: HttpParams = new HttpParams()
    _param = _param.append('deletebody', JSON.stringify(data))

    return this.http
      .delete(
        this.servicesUrl + '/payrollCards/requestStatus/uploadFile/delete',
        { params: _param },
      )
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
            return body
          }
        }),
        catchError(this.handleError),
      )
  }
}
