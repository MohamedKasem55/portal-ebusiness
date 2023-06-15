import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { AppService } from '../../../../../core/service/app.service'
import { AppResponse } from '../../../../Model/app.response'
import { PagedData } from '../../../../Model/paged-data'
import { DepositorOriginator } from '../../Model/depositor-originator'

@Injectable()
export class BeneficiaryOriginatorService extends AppService {
  serviceUrl: string

  private _modifiedBeneficiaries: any

  constructor(private http: HttpClient, config: ConfigResourceService) {
    super()
    this.serviceUrl = config
      .getServicesUrl()
      .concat('/governmentRevenue/admin/')
  }
  pushModifiedBeneficiaries(modifiedBeneficiaries: DepositorOriginator[]) {
    this._modifiedBeneficiaries = JSON.stringify(modifiedBeneficiaries)
  }

  pullModifiedBeneficiaries(): DepositorOriginator[] {
    let result: DepositorOriginator[] = []
    try {
      result = JSON.parse(this._modifiedBeneficiaries)
    } catch (e) {
      result = []
    }
    return result
  }

  getList(criteria: any,
    order: string,
    orderType: string,
    page: number,
    rows: number,

  ): Observable<PagedData<DepositorOriginator>> {
    const params = {
      order,
      orderType,
      page,
      rows,
      ...criteria
    }
    return this.http
      .post<DepositorOriginatorListResponse>(
        this.serviceUrl + 'list',
        params,
      )
      .pipe(
        map((response: DepositorOriginatorListResponse) => {
          const resultData = new PagedData<DepositorOriginator>()
          if (response.errorCode !== '-1') {
            const output = response.depositorOriginatorNameList
            resultData.page.size = output.size
            resultData.page.totalElements = output.total
            resultData.page.totalPages = Math.ceil(
              resultData.page.totalElements / resultData.page.size,
            )
            resultData.page.pageNumber = params.page - 1
            resultData.page.pageSize = params.rows
            resultData.data = output.items
          }
          return resultData
        }),
        catchError(this.handleError),
      )
  }

  confirmDepositorList(
    depositorList: DepositorOriginator[],
  ): Observable<AppResponse> {
    const data = {
      depositorList,
    }
    return this.http
      .post<DepositorOriginatorListResponse>(this.serviceUrl + 'confirm', data)
      .pipe(catchError(this.handleError))
  }
}

export class DepositorOriginatorListResponse extends AppResponse {
  depositorOriginatorNameList: {
    items: Array<DepositorOriginator>
    size: number
    total: number
  }
}
