import { DatePipe } from '@angular/common'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from 'app/Application/Model/exception'

@Injectable()
export class MultiPaymentService {
  servicesUrl: string

  constructor(
    private http: HttpClient,
    private config: ConfigResourceService,
    private datePipe: DatePipe,
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

  public list(dataSearch): Observable<any> {
    //console.log('envio',dataSearch);
    const data = {
      accountNumber: dataSearch.accountNumber ? dataSearch.accountNumber : null,
      amountFrom: dataSearch.searchCriteria.amountFrom
        ? dataSearch.searchCriteria.amountFrom
        : null,
      amountTo: dataSearch.searchCriteria.amountTo
        ? dataSearch.searchCriteria.amountTo
        : null,
      billerId: dataSearch.billerId ? dataSearch.billerId : null,
      dueDateFrom: dataSearch.searchCriteria.dateFrom
        ? this.datePipe.transform(
            dataSearch.searchCriteria.dateFrom,
            'yyyy-MM-dd',
          )
        : null,
      dueDateTo: dataSearch.searchCriteria.dateTo
        ? this.datePipe.transform(
            dataSearch.searchCriteria.dateTo,
            'yyyy-MM-dd',
          )
        : null,
      payerID: dataSearch.payerId ? dataSearch.payerId : null,
      sadadInvoiceId: dataSearch.invoiceId ? dataSearch.invoiceId : null,
      supplierName: dataSearch.searchCriteria.supplierName
        ? dataSearch.searchCriteria.supplierName
        : null,
      rows: dataSearch.rows ? dataSearch.rows : 20,
      page: dataSearch.page ? dataSearch.page : 1,
    }
    return this.http.post(this.servicesUrl + '/sadadInvoice/list', data).pipe(
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

  public validate(dataSearch): Observable<any> {
    const data = {
      batchList: dataSearch.tableSelectedRows,
      pending: false,
    }
    return this.http
      .post(this.servicesUrl + '/sadadInvoice/validate', data)
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

  public confirm(dataSearch, sendMail): Observable<any> {
    const data = {
      batchList: dataSearch.batchList,
      requestValidate: dataSearch.requestValidate,
      pending: false,
      sendMail,
    }
    return this.http
      .post(this.servicesUrl + '/sadadInvoice/confirm', data)
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
