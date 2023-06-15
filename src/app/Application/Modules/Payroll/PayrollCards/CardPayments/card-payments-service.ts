import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { Exception } from '../../../../Model/exception'

@Injectable()
export class PayrollCardPaymentsService {
  servicesUrl: string
  public cacheCombos: Map<String, any> = new Map<String, any>()
  public allComboData: any = []

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

  public searchInitiatePayment(requestJson): Observable<any> {
    let body: any
    body = JSON.stringify(requestJson)
    //console.log("Params enviados getInitiateSearch");
    //console.log(body);

    return this.http
      .post(this.servicesUrl + '/payrollCards/searchInitiatePayment', body)
      .pipe(
        map((response: any) => {
          //let result:any;
          const result = response

          if (response.errorCode !== '0') {
            return null
          } else {
            const output = result.cardIncentiveInstitutionsList
            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  public initiateNewPayment(requestJson): Observable<any> {
    let body: any
    body = JSON.stringify(requestJson)

    return this.http
      .post(this.servicesUrl + '/payrollCards/initiateNewPayment', body)
      .pipe(
        map((response: any) => {
          //let result:any;
          const result = response

          if (response.errorCode !== '0') {
            return null
          } else {
            const output = result
            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  public initiateNewPaymentConfirm(requestJson): Observable<any> {
    let body: any
    body = JSON.stringify(requestJson)
    //console.log("Params enviados initiateNewPaymentConfirm");
    //console.log(body);

    return this.http
      .post(this.servicesUrl + '/payrollCards/initiateNewPaymentConfirm', body)
      .pipe(
        map((response: any) => {
          //let result:any;
          const result = response

          if (response.errorCode !== '0') {
            return null
          } else {
            const output = result
            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  public loadPreviousMonthList(data): Observable<any> {
    const body = data

    return this.http
      .post(this.servicesUrl + '/payrollCards/loadPreviousMonthList', body)
      .pipe(
        map((response: any) => {
          //let result:any;
          const result = response

          if (response.errorCode !== '0') {
            return null
          } else {
            const output = result
            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  ///payrollCards/loadPreviousMonth/{fileName}
  public loadPreviousMonthListDetail(
    fileName,
    dirArchive: boolean,
  ): Observable<any> {
    const data: any = {}
    data.fileName = fileName
    data.dirUploadArchive = dirArchive

    const body = JSON.stringify(data)

    return this.http
      .post(this.servicesUrl + '/payrollCards/loadPreviousMonth', body)
      .pipe(
        map((response: any) => {
          //let result:any;
          const result = response

          if (response.errorCode !== '0') {
            return null
          } else {
            const output = result
            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  public loadPreviousMonthCardList(data): Observable<any> {
    let body: any
    body = JSON.stringify(data)
    //console.log("Params enviados loadPreviousMonthCardList");
    //console.log(body);

    return this.http
      .post(this.servicesUrl + '/payrollCards/loadPreviousMonthCardList', body)
      .pipe(
        map((response: any) => {
          //let result:any;
          const result = response

          if (response.errorCode !== '0') {
            return null
          } else {
            const output = result
            return output
          }
        }),
        catchError(this.handleError),
      )
  }
}
