import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { Exception } from '../../../../../Application/Model/exception'
import { Page } from '../../../../../Application/Model/page'
import { PagedData } from '../../../../../Application/Model/paged-data'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { ModelServiceMoiFeedBackFilesList } from '../Model/moi-feedback-files-list-service.model'

@Injectable()
export class FeedBackFiles {
  servicesUrl: string
  fileName: any

  constructor(private http: HttpClient, public config: ConfigResourceService) {
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

  public getResults(): Observable<any> {
    const data = {
      page: 1,
      rows: 10,
    }

    const req = JSON.stringify(data)

    return this.http
      .post(this.servicesUrl + '/moiPayment/feedbackFile/list', req)
      .pipe(
        map((response: any) => {
          //console.log("REPOJNSE: ", response);

          const result: any = {}

          if (response.errorCode !== '0') {
            return null
          } else {
            /////////////////////////////////////////////////////////////////////////////////
            // CODE FOR DOWNLOADED FEEDBACK FILES

            const bodyDownloadableFile =
              response.fileDownloadListsOutputDTO.downloadableFile
            const pagedDataDownloadedFiles =
              new PagedData<ModelServiceMoiFeedBackFilesList>()
            const pageObjectDownloadedFiles = new Page()

            pageObjectDownloadedFiles.pageNumber = 1
            pageObjectDownloadedFiles.size = bodyDownloadableFile.length
            pageObjectDownloadedFiles.totalElements =
              bodyDownloadableFile.length
            pageObjectDownloadedFiles.totalPages = 1
            pageObjectDownloadedFiles.pageSize = data.rows
            pagedDataDownloadedFiles.data = bodyDownloadableFile

            pagedDataDownloadedFiles.page = pageObjectDownloadedFiles
            result.dataDownloaded = pagedDataDownloadedFiles

            /////////////////////////////////////////////////////////////////////////////////
            // CODE FOR FILES IN PROCESS

            const bodyFileInProcess =
              response.fileDownloadListsOutputDTO.filesInProcess
            const pagedDataFileInProcess =
              new PagedData<ModelServiceMoiFeedBackFilesList>()
            const pageObjectFileInProcess = new Page()

            pageObjectFileInProcess.pageNumber = 1
            pageObjectFileInProcess.size = bodyFileInProcess.length
            pageObjectFileInProcess.totalElements = bodyFileInProcess.length
            pageObjectFileInProcess.totalPages = 1
            pageObjectFileInProcess.pageSize = data.rows
            pagedDataFileInProcess.data = bodyFileInProcess

            pagedDataFileInProcess.page = pageObjectFileInProcess
            result.dataFileInProcess = pagedDataFileInProcess
            return result
          }
        }),
        catchError(this.handleError),
      )
  }

  public details(_filename): Observable<any> {
    const data = {
      fileReference: _filename,
    }
    const req = JSON.stringify(data)
    return this.http
      .post(this.servicesUrl + '/moiPayment/feedbackFile/detail', req)
      .pipe(
        map((result: any) => {
          return result
        }),
        catchError(this.handleError),
      )
  }

  setFileName(_filename) {
    this.fileName = _filename
  }

  getFileName() {
    return this.fileName
  }
}
