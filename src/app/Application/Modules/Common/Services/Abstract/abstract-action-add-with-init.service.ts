import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { Page } from '../../../../Model/page'
import { PagedData } from '../../../../Model/paged-data'
import { AbstractActionAddService } from './abstract-action-add.service'

@Injectable()
export abstract class AbstractActionAddWithInitService extends AbstractActionAddService {
  protected constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
  ) {
    super(http, config)
  }

  public getResults(
    criteria: any,
    order: string,
    orderType: string,
    page: number,
    rows: number,
  ): Observable<PagedData<any>> {
    return this.createDataRequest(criteria, order, orderType, page, rows).pipe(
      map((response: any) => {
        const _body = response

        if (response.errorCode != 0) {
          return null
        } else {
          const output = this.getOutputFromRequestedData(_body)
          const pagedData = new PagedData<any>()
          const pageObject = new Page()

          pageObject.pageNumber = page
          pageObject.pageSize = rows
          pageObject.size = output.size
          pageObject.totalElements = output.total
          pageObject.totalPages = pageObject.totalElements / pageObject.pageSize

          pagedData.data = output['data'] ? output['data'] : output['items']
          pagedData.page = pageObject

          return pagedData
        }
      }),
      catchError(this.handleError),
    )
  }

  protected abstract createDataRequest(
    criteria: any,
    order: string,
    orderType: string,
    page: number,
    rows: number,
  ): Observable<any>

  protected abstract getOutputFromRequestedData(_body): any
}
