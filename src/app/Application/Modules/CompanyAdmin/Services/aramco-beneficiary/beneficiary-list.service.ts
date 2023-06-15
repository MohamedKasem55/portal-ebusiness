import { DatePipe } from '@angular/common'
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { Exception } from '../../../../Model/exception'

@Injectable()
export class BeneficiaryListService {
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
    const data = {
      passNumber: dataSearch.searchCriteria.customerId
        ? dataSearch.searchCriteria.customerId
        : null,
      name: dataSearch.searchCriteria.customerName
        ? dataSearch.searchCriteria.customerName
        : null,
      createDateFrom: dataSearch.searchCriteria.createDateFrom
        ? this.datePipe.transform(
            dataSearch.searchCriteria.createDateFrom,
            'yyyy-MM-dd',
          )
        : null,
      createDateTo: dataSearch.searchCriteria.createDateTo
        ? this.datePipe.transform(
            dataSearch.searchCriteria.createDateTo,
            'yyyy-MM-dd',
          )
        : null,
      rows: dataSearch.rows ? dataSearch.rows : 20,
      page: dataSearch.page ? dataSearch.page : 1,
    }
    return this.http
      .post(this.servicesUrl + '/aramcoBeneficiaries/list', data)
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

  public listDetails(dataDetails, page, row): Observable<any> {
    const data = {
      beneficiary: dataDetails,
      page,
      rows: row,
    }
    return this.http
      .post(this.servicesUrl + '/aramcoBeneficiaries/detail', data)
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

  public delete(dataDelete): Observable<any> {
    const data = {
      beneficiaryList: dataDelete,
    }
    let _param: HttpParams = new HttpParams()
    _param = _param.append('deletebody', JSON.stringify(data))
    return this.http
      .delete(this.servicesUrl + '/aramcoBeneficiaries/delete', {
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
            const output = body
            return output
          }
        }),
        catchError(this.handleError),
      )
  }
}
