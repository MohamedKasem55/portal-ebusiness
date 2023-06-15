import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ConfigResourceService } from 'app/core/config/config.resource.local'
import { Observable } from 'rxjs'
import { AbstractListService } from '../../Common/Services/Abstract/abstract-list.service'

@Injectable()
export class ReportsService extends AbstractListService {
  constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
  ) {
    super(http, config)
  }

  protected createDataRequest(
    criteria: any,
    order: string,
    orderType: string,
    page: number,
    rows: number,
  ): Observable<any> {
    const params = {
      reportType: criteria.reportType ? criteria.reportType : '',
      dateFrom: criteria.dateFrom ? criteria.dateFrom : '',
      dateTo: criteria.dateTo ? criteria.dateTo : '',
    }
    if (params.dateFrom == '' && params.dateTo == '') {
      return this.http.get(this.servicesUrl + '/cmReports/list')
    } else {
      return this.http.post(this.servicesUrl + '/cmReports/list', params)
    }
  }

  protected getOutputFromRequestedData(_body) {
    const itemsList = _body.listReport ? _body.listReport : []
    return {
      items: itemsList,
      size: itemsList.length,
      total: itemsList.length,
    }
  }

  public getDownloableReport(fileData): Observable<any> {
    const params = {
      parameter: fileData,
    }
    return this.http.post(this.servicesUrl + '/cmReports/download', params, {
      responseType: 'blob',
    })
  }
}
