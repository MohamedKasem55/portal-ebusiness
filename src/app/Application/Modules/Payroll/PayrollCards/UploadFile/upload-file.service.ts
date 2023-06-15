import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
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
    console.error(errMsg)
    const errorService: Exception = new Exception('handle', errMsg)
    return observableThrowError(errorService)
  }

  public uploadFile(
    file: File,
    batchName: any,
    payrollDetails: any,
  ): Observable<any> {
    const data = {
      batchName,
    }

    const formData = new FormData()

    formData.append('json', JSON.stringify(data))
    formData.append('file', file)
    const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data')

    return this.http
      .post(
        this.servicesUrl + '/payrollCards/validateFilePayrollCardsPayments',
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

  public saveFile(
    payrollBatchDTO: any,
    requestValidate: RequestValidate,
  ): Observable<any> {
    const data = {
      cardsFeesInquiryDTO: payrollBatchDTO.cardsFeesInquiryDTO, //(PayrollCardsFeesInquiryOutTXDTO, optional),
      payrollCardUploadBatch: payrollBatchDTO.payrollCardUploadBatch, //(PayrollCardUploadBatchDSO, optional),
      requestValidate, //(RequestValidatePayments, optional),
      tmpFile: payrollBatchDTO.tmpFile, //(string, optional),
      totalAmount: payrollBatchDTO.totalAmount, //(number, optional),
      totalPayments: payrollBatchDTO.totalPayments, //(integer, optional),
      wsStatus: payrollBatchDTO.wsStatus, //(string, optional)
    }

    return this.http
      .post(this.servicesUrl + '/payrollCards/uploadFilePaymentConfirm', data)
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
