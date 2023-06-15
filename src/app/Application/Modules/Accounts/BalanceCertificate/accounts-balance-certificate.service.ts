import { Observable, throwError as observableThrowError } from 'rxjs'
/**
 * Service to obtain the balance certificate
 */

import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { StorageService } from '../../../../core/storage/storage.service'
import { Exception } from '../../../Model/exception'
import { Page } from '../../../Model/page'
import { PagedData } from '../../../Model/paged-data'
import { ModelServiceBalanceCertificate } from '../Model/account-balance-cetificate-service.model'

@Injectable()
export class AccountsService {
  token: string
  servicesUrl: string
  currentUser

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

  public getResults(
    order: string,
    orderType: string,
    page: number,
    rows: number,
  ): Observable<PagedData<ModelServiceBalanceCertificate>> {
    const data = {
      order,
      orderType,
      page,
      rows,
    }

    return this.http
      .post(this.servicesUrl + '/balanceCertificate/list', data)
      .pipe(
        map((response: any) => {
          const _body = response

          if (response.errorCode !== '0') {
            return null
          } else {
            // output is the father node of the content response
            const output = _body.cetificates
            const pagedData = new PagedData<ModelServiceBalanceCertificate>()
            const pageObject = new Page()

            pageObject.pageNumber = page
            pageObject.pageSize = rows
            pageObject.size = _body.size
            pageObject.totalElements = _body.total
            pageObject.totalPages =
              pageObject.totalElements / pageObject.pageSize

            for (let i = 0; i < pageObject.size; i++) {
              const jsonObj = output[i]
              const list = new ModelServiceBalanceCertificate(
                jsonObj.balanceCertificatePk,
                jsonObj.company,
                jsonObj.city,
                jsonObj.postalCode,
                jsonObj.requestDate,
                jsonObj.account,
                jsonObj.cic,
                jsonObj.processDate,
              )
              pagedData.data.push(list)
            }
            pagedData.page = pageObject

            return pagedData
          }
        }),
        catchError(this.handleError),
      )
  }
}
