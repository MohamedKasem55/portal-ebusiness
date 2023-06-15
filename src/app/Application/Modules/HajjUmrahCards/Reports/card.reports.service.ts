import { Injectable } from '@angular/core'
import { AbstractListService } from '../../Common/Services/Abstract/abstract-list.service'
import { HttpClient } from '@angular/common/http'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Observable, of } from 'rxjs'
import { PagedData } from '../../../Model/paged-data'
import { catchError, map } from 'rxjs/operators'
import { Page } from '../../../Model/page'

@Injectable()
export class CardReportsService extends AbstractListService {
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
    const data = {
      page: page ? page : 1,
      rows: rows ? rows : 100,
    }

    return this.http.post(this.servicesUrl + '/hajjumra/reports/list', data)
  }

  protected getOutputFromRequestedData(_body) {
    const filesData = _body.files
    return {
      items: filesData.items,
      total: filesData.total,
      size: filesData.size,
    }
  }

  public downloadFiles(selectedFiles: any[]): Observable<any> {
    return this.createDownloadFilesRequest(selectedFiles).pipe(
      map((response: any) => {
        if (window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(response, 'reports.zip')
        } else {
          const downloadUrl = URL.createObjectURL(response)
          const link = document.createElement('a')
          link.download = 'reports.zip'
          link.href = downloadUrl
          document.body.appendChild(link)
          link.click()
        }
      }),
      catchError(this.handleError),
    )
  }

  protected createDownloadFilesRequest(selectedFiles: any[]): Observable<any> {
    const data = {
      downloadFiles: selectedFiles,
    }

    return this.http.post(
      this.servicesUrl + '/hajjumra/reports/download',
      data,
      { responseType: 'blob' },
    )
  }
}
