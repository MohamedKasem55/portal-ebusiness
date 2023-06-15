import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Beneficiary } from 'app/Application/Model/beneficiary'
import { FillBeneficiaries } from 'app/Application/Model/fillBeneficiaries'
import { Observable, of, throwError as observableThrowError } from 'rxjs'
import { catchError, map, switchMap } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from 'app/Application/Model/exception'
import { Page } from '../../../Model/page'
import { PagedData } from '../../../Model/paged-data'

@Injectable()
export class BeneficiaryService {
  servicesUrl: string
  currentUser

  constructor(public http: HttpClient, public config: ConfigResourceService) {
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

  searchBeneficiaries(value: any, page: number, rows: number): Observable<any> {
    const data = value
    ;(data['page'] = page), (data['rows'] = rows)

    return this.http.post(this.servicesUrl + '/beneficiaries', data).pipe(
      switchMap((response: any) => {
        const body = response
        if (response.errorCode !== '0') {
          //console.log("Error code != 0");
          const exception = new Exception(body.errorCode, body.errorDescription)
          return observableThrowError(exception)
        } else {
          const output = body.beneficiaryList
          const pagedData = new PagedData<Beneficiary>()
          const pageObject = new Page()

          pageObject.pageNumber = page
          pageObject.pageSize = rows
          pageObject.size = body.size
          pageObject.totalElements = body.total
          pageObject.totalPages = pageObject.totalElements / pageObject.pageSize

          pagedData.page = pageObject
          pagedData.data = output
          pagedData['remitterCategory'] = body.remitterCategory
          return of(pagedData)
        }
      }),
      catchError(this.handleError),
    )
  }

  fillBeneficiaries(selected): Observable<any> {
    const data = {
      listBeneficiariesSelected: selected,
      remitterCategory: '',
    }

    //console.log(body);
    return this.http
      .post(this.servicesUrl + '/beneficiaries/fillBeneficiaries', data)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            //console.log("Error code != 0");
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return observableThrowError(exception)
          } else {
            let output: FillBeneficiaries = new FillBeneficiaries()
            output = body
            return output
          }
        }),
        catchError(this.handleError),
      )
  }
}
