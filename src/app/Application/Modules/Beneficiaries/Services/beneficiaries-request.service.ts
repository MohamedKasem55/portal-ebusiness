/**
 * Service to obtain the balance certificate
 */
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { StorageService } from '../../../../core/storage/storage.service'
import { Exception } from '../../../Model/exception'
import { Page } from '../../../Model/page'
import { PagedData } from '../../../Model/paged-data'
import { ModelRequestBeneficiaries } from '../Model/beneficiaries-request.model'

@Injectable()
export class RequestBeneficiariesService {
  public token: string
  public servicesUrl: string
  public currentUser

  element: any
  type: any

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    public storageService: StorageService,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  // Service management error
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

  public getResults(page: number, rows: number): Observable<any> {
    const req = {
      pending: false,
      page,
      rows,
    }

    return this.http
      .post(this.servicesUrl + '/beneficiaries/batch/list', req)
      .pipe(
        map((response: any) => {
          const body = response

          if (response.errorCode !== '0') {
            return null
          } else {
            const data = body.beneficiaries
            const pagedData = new PagedData<any>()
            const pageObject = new Page()

            pageObject.pageNumber = page
            pageObject.pageSize = rows
            pageObject.size = data.size
            pageObject.totalElements = data.total
            pageObject.totalPages =
              pageObject.totalElements / pageObject.pageSize

            pagedData.data = data.items
            pagedData.page = pageObject
            return pagedData
          }
        }),
      )
  }

  public getLocalDetails(row): Observable<any> {
    const data = {
      batchBeneficiary: row,
    }

    return this.http
      .post(
        this.servicesUrl + '/beneficiaries/requestStatus/local/details',
        data,
      )
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            return null
          } else {
            const output = response.batchBeneficiary
            return output
          }
        }),
      )
  }

  public getAlRajhiDetails(row): Observable<any> {
    const data = {
      batchBeneficiary: row,
    }

    return this.http
      .post(
        this.servicesUrl + '/beneficiaries/requestStatus/within/details',
        data,
      )
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            return null
          } else {
            const output = response.batchBeneficiary
            return output
          }
        }),
      )
  }

  public getInternationalDetails(row): Observable<any> {
    const data = {
      batchBeneficiary: row,
    }

    return this.http
      .post(
        this.servicesUrl + '/beneficiaries/requestStatus/international/details',
        data,
      )
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            return null
          } else {
            const output = response.batchBeneficiary
            return output
          }
        }),
      )
  }

  getLevel(status: string, levels): string {
    let response = ''
    if (status != 'R') {
      for (let i = 0; i < levels.length; i++) {
        if (levels[i]['status'] == 'A' || levels[i]['status'] == 'I') {
          response += 'L' + levels[i]['level'] + ' '
        }
      }
    }
    return response
  }

  getNextLevel(status: string, levels): string {
    let response = ''
    for (let i = 0; i < levels.length; i++) {
      if (status == 'R' || levels[i]['status'] == 'P') {
        response += 'L' + levels[i]['level'] + ' '
      }
    }
    return response
  }

  getElement() {
    return this.element
  }

  setElement(element) {
    this.element = element
  }

  getType() {
    return this.type
  }

  setType(element) {
    this.type = element
  }
}
