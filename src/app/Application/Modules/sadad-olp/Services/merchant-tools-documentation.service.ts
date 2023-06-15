import { Injectable } from '@angular/core'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Router } from '@angular/router'
import { Exception } from '../../../Model/exception'
import { throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { PagedData } from '../../../Model/paged-data'
import { Page } from '../../../Model/page'
import { IBop } from '../Model/bop.model'

@Injectable({
  providedIn: 'root',
})
export class MerchantToolsDocumentationService {
  servicesUrl: string

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    private router: Router,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  public getList(page: number, rows: number) {
    return this.http
      .get(this.servicesUrl + '/sadadolp/merchantToolsDocumentation/list')
      .pipe(
        map((response: any) => {
          const pagedData = new PagedData<IBop>()

          const items = []
          if (
            typeof response.bopsList != 'undefined' &&
            response.bopsList != null &&
            response.bopsList.length > 0
          ) {
            const size = response.bopsList.length
            for (let _i = 0; _i < size; _i++) {
              const jsonObj = response.bopsList[_i]
              items.push(jsonObj as IBop)
            }
          }
          const pageObject = new Page()

          pageObject.pageNumber = page
          pageObject.pageSize = items.length ? items.length : 50
          pageObject.size = items.length
          pageObject.totalElements = items.length
          pageObject.totalPages = pageObject.totalElements / pageObject.pageSize

          pagedData.page = pageObject
          pagedData.data = items

          return pagedData
        }),
        catchError(this.handleError),
      )
  }

  public downloadBop(bop: IBop) {
    const output = {
      file: new Blob(),
      fileName: '',
    }

    const data = {
      sadadOLPBopDto: bop,
    }

    const body = JSON.stringify(data)

    return this.http
      .post(
        this.servicesUrl + '/sadadolp/merchantToolsDocumentation/download',
        body,
        { responseType: 'blob' },
      )
      .pipe(
        map((res: Blob) => {
          const url_split = bop.url.split('/')
          const fileName = url_split[url_split.length - 1]
          output.file = res
          output.fileName = fileName

          return output
        }),
      )
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
}
