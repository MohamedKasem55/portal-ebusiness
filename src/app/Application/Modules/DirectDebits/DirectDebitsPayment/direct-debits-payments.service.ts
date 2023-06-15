import { DatePipe } from '@angular/common'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from 'app/Application/Model/exception'

@Injectable()
export class DirectDebitsPaymentsService {
  servicesUrl: string

  constructor(
    public datePipe: DatePipe,
    private http: HttpClient,
    public config: ConfigResourceService,
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
    //console.error(errMsg);
    const errorService: Exception = new Exception('handle', errMsg)
    return observableThrowError(errorService)
  }

  public validate(batchValue, selectedEmployee): Observable<any> {
    for (let i = selectedEmployee.length - 1; i >= 0; i--)
      selectedEmployee[i].amount = +selectedEmployee[i].amount

    const data = {
      batchName: batchValue.batchName,
      customerReference: batchValue.customerReference,
      maxDate: this.datePipe.transform(batchValue.valueDate, 'dd-MM-yyyy'),
      customerList: selectedEmployee,
    }

    return this.http
      .post(`${this.servicesUrl}/directDebits/claims/validate`, data)
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            throw new Exception(response.errorCode, response.errorDescription)
          } else {
            return response
          }
        }),
        catchError(this.handleError),
      )
  }

  public confirm(directDebits, requestValidate): Observable<any> {
    const data = {
      requestValidate,
      directDebit: directDebits,
    }

    return this.http
      .post(`${this.servicesUrl}/directDebits/claims/confirm`, data)
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            return new Exception(
              response.errorCode,
              response.errorDescription,
              response.generateChallengeAndOTP,
            )
          } else {
            return response
          }
        }),
        catchError(this.handleError),
      )
  }
}
