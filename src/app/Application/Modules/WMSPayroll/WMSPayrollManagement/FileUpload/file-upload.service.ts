import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { Exception } from '../../../../Model/exception'

@Injectable()
export class FileUploadService {
  servicesUrl: string

  constructor(private http: HttpClient, public config: ConfigResourceService) {
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
    const errorService: Exception = new Exception('handle', errMsg)
    return observableThrowError(errorService)
  }

  public uploadFileEmployees(batchName: string, file: File): Observable<any> {
    //console.log("uploadFileEmployees");
    const headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data',
    })
    const formData = new FormData()
    formData.append('file', file)
    return this.http
      .post(
        this.servicesUrl +
          `/payrollWPS/salaryPayment/file/validate/${batchName}`,
        formData,
        { headers },
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

  public uploadFileSalary(batchName: string, file: File): Observable<any> {
    const formData = new FormData()

    //formData.append('json', JSON.stringify(data));
    formData.append('file', file)
    const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data')

    return this.http
      .post(
        this.servicesUrl +
          `/payrollWPS/salaryPayment/file/validate/${batchName}`,
        formData,
        { headers },
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

  public undoOperation(fileReference: string) {
    const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data')

    return this.http
      .delete(
        this.servicesUrl +
          `/payrollWPS/salaryPayment/file/undoOperation/${fileReference}`,
        { headers },
      )
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
          } else {
            const output = body
            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  public confirm(
    salaryPaymentDetails: any,
    payrollBatch: any,
    requestValidate: any,
  ) {
    const data = {
      payrollBatch,
      requestValidate,
      salaryPaymentDetails,
    }

    return this.http
      .post(this.servicesUrl + '/payrollWPS/salaryPayment/file/confirm', data)
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
            const output = body
            return output
          }
        }),
        catchError(this.handleError),
      )
  }
}
