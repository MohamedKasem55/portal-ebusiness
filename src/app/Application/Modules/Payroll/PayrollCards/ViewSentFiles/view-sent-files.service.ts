import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'

@Injectable()
export class ViewSentFilesService {
  servicesUrl: string

  constructor(private http: HttpClient, private config: ConfigResourceService) {
    this.servicesUrl = config.getServicesUrl()
  }

  getUploadedFiles(page, rows): Observable<any> {
    const data: any = {}
    data.page = page
    data.rows = rows

    const body = JSON.stringify(data)

    return this.http
      .post(this.servicesUrl + '/payrollCards/getFiles/sentUploadedCards', body)
      .pipe(
        map((response: any, index: number) => {
          let result: any = {}

          const output = response

          if (output.errorCode !== '0') {
            result.error = true
            result.errorCode = output.errorCode
            result.errorDescription = output.errorDescription
          } else {
            result = output
            result.error = false
          }
          return result
        }),
      )
  }

  getCardPayments(page, rows): Observable<any> {
    const data: any = {}
    data.page = page
    data.rows = rows

    const body = JSON.stringify(data)

    return this.http
      .post(this.servicesUrl + '/payrollCards/getFiles/sentCardPayments', body)
      .pipe(
        map((response: any, index: number) => {
          let result: any = {}

          const output = response

          if (output.errorCode !== '0') {
            result.error = true
            result.errorCode = output.errorCode
            result.errorDescription = output.errorDescription
          } else {
            result = output
            result.error = false
          }
          return result
        }),
      )
  }
  /*DELETE FILES (Error Not available) */
  deleteFiles(files): Observable<any> {
    const data = {
      filesToDelete: [],
    }
    for (let i = files.length - 1; i >= 0; i--) {
      data.filesToDelete.push({
        dataReceived: files[i].dataReceived,
        dirUploadArchive: files[i].dirUploadArchive,
        fileSize: files[i].fileSize,
        userFileName: files[i].userFileName,
        batchName: files[i].batchName,
        fileName: files[i].fileName,
      })
    }

    const _param: HttpParams = new HttpParams().append(
      'deletebody',
      JSON.stringify(data),
    )

    return this.http
      .delete(this.servicesUrl + '/payrollCards/deleteSentFilesConfirm', {
        params: _param,
      })
      .pipe(
        map((response: any) => {
          let result: any = {}

          const output = response

          if (output.errorCode !== '0') {
            result.error = true
            result.errorCode = output.errorCode
            result.errorDescription = output.errorDescription
          } else {
            result = output
            result.error = false
          }
          return result
        }),
      )
  }

  //DETALLES DEL ARCHIVO (No devuelve datos)
  detailsFile(file, page, rows): Observable<any> {
    const data: any = {}
    data.batchName = file.batchName
    data.dirUploadArchive = file.dirUploadArchive
    data.fileName = file.fileName
    data.page = page
    data.rows = rows

    const body = JSON.stringify(data)

    return this.http
      .post(this.servicesUrl + '/payrollCards/detailsFile', body)
      .pipe(
        map((response: any, index: number) => {
          let result: any = {}

          const output = response

          if (output.errorCode !== '0') {
            result.error = true
            result.errorCode = output.errorCode
            result.errorDescription = output.errorDescription
          } else {
            result = output
            result.error = false
            // result['listDetails'].forEach((item) => {
            // const tempDate = item['date']
            //   item['_received'] =
            //     tempDate.substring(6, 8) +
            //     '/' +
            //     tempDate.substring(4, 6) +
            //     '/' +
            //     tempDate.substring(0, 4)
            // })
          }
          return result
        }),
      )
  }
}
