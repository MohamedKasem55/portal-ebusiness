import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from '../../../Model/exception'

@Injectable({
  providedIn: 'root',
})
export class UploadFileService {
  private servicesUrl: string

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
    console.error(errMsg)
    const errorService: Exception = new Exception('handle', errMsg)
    return observableThrowError(errorService)
  }

  getCompanyDetails(): Observable<any> {
    return this.http
      .get(this.servicesUrl + '/bulkPayments/companyDetails')
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

  public validateUpload(file: File, batchName: any): Observable<any> {
    const data = {
      batchName,
    }

    const formData = new FormData()

    formData.append('json', JSON.stringify(data))
    formData.append('file', file)
    const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data')

    return this.http
      .post(this.servicesUrl + '/bulkPayments/importFile', formData, {
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

  confirm(initPayment: any): Observable<any> {
    //console.log(initPayment)
    const data = {
      bulkPaymentsBatchDTO: initPayment.bulkPaymentsBatchDTO,
      bulkPaymentsDetailsDTO: initPayment.bulkPaymentsDetailsDTO,
    }

    return this.http
      .post(this.servicesUrl + '/bulkPayments/confirmUploadFile', data)
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

  Process(BatchDTO: any, requestValidate: any): Observable<any> {
    const data = {
      bulkPaymentsBatchDTO: BatchDTO.bulkPaymentsBatchDTO,
      requestValidate,
    }

    return this.http
      .post(this.servicesUrl + '/bulkPayments/processUploadFile', data)
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
}
