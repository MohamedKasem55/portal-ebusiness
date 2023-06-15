import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from '../../../Model/exception'
import { Page } from '../../../Model/page'
import { PagedData } from '../../../Model/paged-data'
import { StaticService } from '../../Common/Services/static.service'

@Injectable({
  providedIn: 'root',
})
export class CardinquiresService {
  servicesUrl: string
  combosData: any = {}

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    private staticService: StaticService,
  ) {
    this.servicesUrl = config.getServicesUrl()

    const combosKeys = ['hajjCardsStatus']
    this.combosData['hajjCardsStatus'] = []

    this.staticService.getAllCombos(combosKeys).subscribe((comboData) => {
      const data = comboData

      const hajjCardsStatusValues =
        data[combosKeys.indexOf('hajjCardsStatus')]['values']
      Object.keys(hajjCardsStatusValues).map((key, index) => {
        this.combosData['hajjCardsStatus'][key] = hajjCardsStatusValues[key]
      })
    })
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

  public listData(data) {
    return this.http.post(this.servicesUrl + '/hajjumra/listcards', data).pipe(
      map((response: any) => {
        let result: any
        let page = data.page
        let rows = data.rows
        const body = response

        if (response.errorCode !== '0') {
          return null
        } else {
          const output = this.addTransformValues(
            body.cardIncentiveInstitutionsList.items,
          )
          const pagedData = new PagedData<any>()
          const pageObject = new Page()
          //console.log(pageObject);
          pageObject.pageNumber = page
          pageObject.pageSize = rows
          pageObject.size = body.cardIncentiveInstitutionsList.size
          pageObject.totalElements = body.cardIncentiveInstitutionsList.total
          pageObject.totalPages = pageObject.totalElements / pageObject.pageSize

          pagedData.data = output
          pageObject.size = body.cardIncentiveInstitutionsList.size
          pageObject.totalElements = body.cardIncentiveInstitutionsList.total
          pagedData.page = pageObject
          result = pagedData

          return result
        }
      }),
      catchError(this.handleError),
    )
  }

  public getFileDetail(value): Observable<any> {
    //console.log(value)
    return this.http
      .post(this.servicesUrl + '/hajjumra/detailcards', value)
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            return null
          } else {
            const output = response
            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  private addTransformValues(items): Array<any> {
    if (items == null) {
      return items
    }
    for (const item of items) {
      const hajjCardsStatus = this.combosData['hajjCardsStatus'][item.status]
        ? this.combosData['hajjCardsStatus'][item.status]
        : item.status
      item.statusTrans = hajjCardsStatus
    }

    return items
  }
}
