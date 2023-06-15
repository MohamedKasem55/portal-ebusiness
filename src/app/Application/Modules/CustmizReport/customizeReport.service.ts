import { Injectable } from '@angular/core'
import { catchError, map } from 'rxjs/operators'
import { AbstractService } from '../Common/Services/Abstract/abstract.service'
import { HttpClient } from '@angular/common/http'
import { ConfigResourceService } from '../../../core/config/config.resource.local'
import { Observable } from 'rxjs'
import { SimpleMQ } from 'ng2-simple-mq'
import { Page } from '../../Model/page'
import { PagedData } from '../../Model/paged-data'
import { TranslateService } from '@ngx-translate/core'


@Injectable()
export class CustomizeReportService extends AbstractService {

  constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
    private smq: SimpleMQ,
    public translate: TranslateService,
  ) {
    super(http, config)
  }

  public getFileList(page, rows, dateFrom, dateTo) {
    const data = {
      reportName: 'POS_MONTHLY',
      page: page + 1,
      rows,
      dateFrom,
      dateTo,
    }
    return this.http
      .post(this.servicesUrl + '/customReport/getFileList', data)
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            return null
          } else {
            const tablePage = new PagedData<any>()

            tablePage.data = response.customReportFileListOutputDTO.fileList
            tablePage.page = new Page()
            tablePage.page.pageNumber = page
            tablePage.page.pageSize = rows
            tablePage.page.size = response.customReportFileListOutputDTO.size
            tablePage.page.totalElements = response.customReportFileListOutputDTO.total
            tablePage.page.totalPages =
              tablePage.page.totalElements / tablePage.page.pageSize

            return tablePage
          }
        }),
      )
  }

  public getPDFFile(fileName) {
    const output = {
      file: new Blob(),
      fileName: fileName,
    }

    return this.http
      .post(this.servicesUrl + '/customReport/downloadFile', {
        reportName: 'POS_MONTHLY',
        fileName,
      }, {
        responseType: 'blob',
      })
      .pipe(
        map((res: any) => {
          output.file = res
          return output
        }),
        catchError((): Observable<any> => {
          this.smq.publish(
            'error-mq',
            'Document Not Found',
          )
          return null
        }),
      )
  }


  public getZipFile(downloadFiles) {
    const output = {
      file: new Blob(),
      fileName: 'POS_Monthly.zip',
    }

    return this.http
      .post(this.servicesUrl + '/customReport/downloadFiles', {
        reportName: 'POS_MONTHLY',
        downloadFiles,
      }, {
        responseType: 'blob',
      })
      .pipe(
        map((res: any) => {
          if (res.type !== 'application/json') {
            output.file = res
            return output
          } else {

            this.translate
              .get('menu.collections_management.pos_ecommerce.fileSizeError')
              .subscribe((value) => this.smq.publish('error-mq', value))
            return null
          }
        }),
        catchError((): Observable<any> => {
          this.smq.publish(
            'error-mq',
            'Document Not Found',
          )
          return null
        }),
      )
  }
}
