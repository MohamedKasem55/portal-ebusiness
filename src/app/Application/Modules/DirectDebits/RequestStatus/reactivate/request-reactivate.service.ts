import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { DateFormatPipe } from '../../../../Components/common/Pipes/date-format-pipe'
import { Exception } from '../../../../Model/exception'

@Injectable()
export class RequestReactivateService {
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

  public reInitiate(batch, paymentDate): Observable<any> {
    for (let i = batch.customerList.length - 1; i >= 0; i--) {
      batch.customerList[i].amount = +batch.customerList[i].amount
      batch.customerList[i].claimDate = this.dateFormatPipe.transform(
        paymentDate,
        this.dateFormat,
      )
    }
    batch.directDebit.claimDate = this.dateFormatPipe.transform(
      paymentDate,
      this.dateFormat,
    )
    const data = {
      directDebit: batch.directDebit,
      customerList: batch.customerList,
    }
    return this.http
      .post(
        this.servicesUrl + '/directDebits/requestStatus/batch/initiate',
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

  public reInitiateUpload(batch, paymentDate): Observable<any> {
    batch.directDebit.claimDate = this.dateFormatPipe.transform(
      paymentDate,
      this.dateFormat,
    )
    const data = {
      batch: batch.directDebit,
      //paymentDate:this.dateFormatPipe.transform(paymentDate,this.dateFormat)
    }
    return this.http
      .post(
        this.servicesUrl + '/directDebits/requestStatus/uploadBatch/initiate',
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

  public save(batch, requestValidate): Observable<any> {
    //console.log(batch);
    const data = {
      batch: batch.directDebit,
      requestValidate,
    }

    return this.http
      .post(
        this.servicesUrl + '/directDebits/requestStatus/batch/reInitiate',
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
            return body
          }
        }),
        catchError(this.handleError),
      )
  }

  public saveUpload(batch, requestValidate): Observable<any> {
    const data = {
      batch: batch.batch,
      fileFormat: batch.fileFormat,
      requestValidate,
    }

    return this.http
      .post(
        this.servicesUrl + '/directDebits/requestStatus/uploadBatch/reInitiate',
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
            return body
          }
        }),
        catchError(this.handleError),
      )
  }

  public delete(batch): Observable<any> {
    const data = {
      batch: batch.directDebit,
    }
    let _param: HttpParams = new HttpParams()
    _param = _param.append('deletebody', JSON.stringify(data))

    return this.http
      .delete(this.servicesUrl + '/directDebits/requestStatus/batch/delete', {
        params: _param,
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
            return body
          }
        }),
        catchError(this.handleError),
      )
  }

  public deleteUpload(batch): Observable<any> {
    const data = {
      batch: batch.directDebit,
    }

    let _param: HttpParams = new HttpParams()
    _param = _param.append('deletebody', JSON.stringify(data))
    return this.http
      .delete(
        this.servicesUrl + '/directDebits/requestStatus/uploadBatch/delete',
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
