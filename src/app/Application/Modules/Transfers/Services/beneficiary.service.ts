import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Beneficiary } from '../../../Model/beneficiary'
import { Exception } from 'app/Application/Model/exception'
import { FillBeneficiaries } from '../../../Model/fillBeneficiaries'
import { Page } from '../../../Model/page'
import { PagedData } from '../../../Model/paged-data'

@Injectable()
export class BeneficiaryService {
  servicesUrl: string
  currentUser

  selectedWithinBeneficiaries: any = []
  selectedLocalBeneficiaries: any = []
  selectedInternationalBeneficiaries: any = []

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

  searchBeneficiaries(value: any, page: number, rows: number): Observable<any> {
    const data = value
    ;(data['page'] = page), (data['rows'] = rows)

    const body = JSON.stringify(data)
    return this.http.post(this.servicesUrl + '/beneficiaries', body).pipe(
      map((response: any) => {
        if (response.errorCode !== '0') {
          //console.log("Error code != 0");
          const exception = new Exception(
            response.errorCode,
            response.errorDescription,
          )
          return observableThrowError(exception)
        } else {
          const output = response.beneficiaryList
          const pagedData = new PagedData<Beneficiary>()
          const pageObject = new Page()

          pageObject.pageNumber = page
          pageObject.pageSize = rows
          pageObject.size = response.size
          pageObject.totalElements = response.total
          pageObject.totalPages = pageObject.totalElements / pageObject.pageSize

          pagedData.page = pageObject
          pagedData.data = output

          pagedData['remitterCategory'] = response.remitterCategory
          pagedData.data.forEach((beneficiary) => {
            if (beneficiary.beneficiaryCategory === 'U') {
              beneficiary.beneficiaryCategory = null
            }
          })
          return pagedData
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

    return this.http
      .post(this.servicesUrl + '/beneficiaries/fillBeneficiaries', data)
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            //console.log("Error code != 0");
            const exception: Exception = new Exception(
              response.errorCode,
              response.errorDescription,
            )
            return observableThrowError(exception)
          } else {
            let output: FillBeneficiaries = new FillBeneficiaries()
            output = response
            return output
          }
        }),
        catchError(this.handleError),
      )
  }
}
