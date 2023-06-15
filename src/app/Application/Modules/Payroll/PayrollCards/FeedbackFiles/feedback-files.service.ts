import { DatePipe } from '@angular/common'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { Exception } from '../../../../../Application/Model/exception'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'

@Injectable()
export class FeedBackFilesService {
  servicesUrl: string
  public cacheCombos: Map<String, any> = new Map<String, any>()
  public allComboData: any = []

  public ONLINE_REQUEST = 1
  public VIEW_PAYMENT_USING_FILE = 2
  public VIEW_PAYMENT_USING_CARD = 3
  public DOWNLOAD_MOL_FILE = 4

  selectedFile: any
  optionBack: any

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    public datePipe: DatePipe,
  ) {
    this.servicesUrl = config.getServicesUrl()
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

  public uploadedFiles(requestJson, search): Observable<any> {
    let body: any
    body = JSON.stringify(requestJson)
    //console.log("Params enviados sentUploadedCards");
    //console.log(body);
    return this.http
      .post(this.servicesUrl + '/payrollCards/getFiles/historyUpload', body)
      .pipe(
        map((response: any) => {
          //console.log("resultado");
          //console.log(response);
          const result = response

          if (response.errorCode !== '0') {
            return null
          } else {
            const output = result.outputFilePagination
            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  public onlineRequest(requestJson, search): Observable<any> {
    const data = requestJson
    if (search.dateTo) {
      data.dateTo = this.datePipe.transform(search.dateTo, 'yyyy-MM-dd')
    }
    if (search.dateFrom) {
      data.dateFrom = this.datePipe.transform(search.dateFrom, 'yyyy-MM-dd')
    }
    if (search.fileName) {
      data.fileName = search.fileName
    }
    if (search.batchName) {
      data.batchName = search.batchName
    }
    let body: any
    body = JSON.stringify(data)
    //console.log("Params enviados sentUploadedCards");
    //console.log(body);

    return this.http
      .post(
        this.servicesUrl + '/payrollCards/getFiles/historyOnlineRequests',
        body,
      )
      .pipe(
        map((response: any) => {
          //console.log("resultado");
          //console.log(response);
          const result = response

          if (response.errorCode !== '0') {
            return null
          } else {
            const output = result.outputFilePagination
            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  public downloadWps(requestJson, search): Observable<any> {
    const data = requestJson
    if (search.dateTo) {
      data.dateTo = this.datePipe.transform(search.dateTo, 'yyyy-MM-dd')
    }
    if (search.dateFrom) {
      data.dateFrom = this.datePipe.transform(search.dateFrom, 'yyyy-MM-dd')
    }
    if (search.fileName) {
      data.fileName = search.fileName
    }
    if (search.batchName) {
      data.batchName = search.batchName
    }
    let body: any
    body = JSON.stringify(data)
    //console.log("Params enviados sentUploadedCards");
    //console.log(body);

    return this.http
      .post(this.servicesUrl + '/payrollCards/getFiles/wps', body)
      .pipe(
        map((response: any) => {
          //console.log("resultado");
          //console.log(response);
          const result = response

          if (response.errorCode !== '0') {
            return null
          } else {
            const output = result.outputFilePagination
            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  public cardPayments(requestJson, search): Observable<any> {
    const data = requestJson
    if (search.dateTo) {
      data.dateTo = this.datePipe.transform(search.dateTo, 'yyyy-MM-dd')
    }
    if (search.dateFrom) {
      data.dateFrom = this.datePipe.transform(search.dateFrom, 'yyyy-MM-dd')
    }
    if (search.fileName) {
      data.fileName = search.fileName
    }
    if (search.batchName) {
      data.batchName = search.batchName
    }
    let body: any
    body = JSON.stringify(data)
    //console.log("Params enviados sentUploadedCards");
    //console.log(body);

    return this.http
      .post(this.servicesUrl + '/payrollCards/getFiles/historyPayments', body)
      .pipe(
        map((response: any) => {
          //console.log("resultado");
          //console.log(response);
          const result = response

          if (response.errorCode !== '0') {
            return null
          } else {
            const output = result.outputFilePagination
            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  downloadFile(fileData, upload): Observable<any> {
    const data = {
      file: fileData,
      upload,
    }
    return this.http.post(
      this.servicesUrl + '/payrollCards/downloadFeedbackFile',
      data,
      { responseType: 'blob' },
    )
  }

  //DETALLES DEL ARCHIVO (No devuelve datos)
  detailsFeedbackFile(file, page, rows): Observable<any> {
    const data: any = {}
    data.batchName = file.batchName
    data.dirUploadArchive = file.dirUploadArchive
    data.fileName = file.fileName
    data.page = page
    data.rows = rows

    const body = JSON.stringify(data)

    return this.http
      .post(this.servicesUrl + '/payrollCards/detailsFeebackFile', body)
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
      .post(this.servicesUrl + '/payrollCards/detailsFeebackFile', body)
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

  getSelectedFile(): any {
    return this.selectedFile
  }
  setSelectedFile(file) {
    this.selectedFile = file
  }

  getOptionBack(): any {
    return this.optionBack
  }
  setOptionBack(optionBack) {
    this.optionBack = optionBack
  }
}
