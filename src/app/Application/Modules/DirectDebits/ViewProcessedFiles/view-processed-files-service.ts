import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from 'app/Application/Model/exception'
import { Page } from '../../../Model/page'
import { PagedData } from '../../../Model/paged-data'
import { ResponseListFilesDirectDebits } from '../Model/ResponseListFilesDirectDebits.model'

@Injectable()
export class ViewProcessedFilesService {
  servicesUrl: string
  public cacheCombos: Map<String, any> = new Map<String, any>()
  public allComboData: any = []

  constructor(private http: HttpClient, public config: ConfigResourceService) {
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

  getStaticData(combos: string[]): Observable<any[]> {
    const combosRequest: any = []
    for (let i = 0; i < combos.length; i++) {
      if (!this.cacheCombos.has(combos[i])) {
        combosRequest.push(combos[i])
      }
    }
    let data = {}
    if (combosRequest.length > 0) {
      data = {
        names: combosRequest,
      }

      return this.http.post(this.servicesUrl + '/statics/list', data).pipe(
        map((response: any) => {
          const body = response
          this.setComboData(body)
          return this.prepareAllCombos(combos)
        }),
        catchError(this.handleError),
      )
    } else {
      return of(this.prepareAllCombos(combos))
    }
  }

  setComboData(body) {
    const data = body || {}
    for (let i = 0; i < data.length; i++) {
      this.cacheCombos.set(data[i].name, data[i].props)
    }
  }

  prepareAllCombos(combos) {
    const allcombos = []
    for (let i = 0; i < combos.length; i++) {
      allcombos.push({
        comboName: combos[i],
        values: this.cacheCombos.get(combos[i]),
      })
    }
    return allcombos
  }

  public getAccounts(): Observable<any> {
    const data = {
      order: '',
      orderType: '',
      page: 1,
      rows: 100,
      txType: 'ECIA',
    }

    const body = JSON.stringify(data)
    return this.http.post(this.servicesUrl + '/accounts/combo', body).pipe(
      map((response: any) => {
        const result = new Array()
        const output = response

        for (let i = 0; i < output.accountComboList.length; i++) {
          result.push(output.accountComboList[i]['value'])
        }

        return result
      }),
    )
  }

  public processedFiles(
    page: number,
    rows: number,
    amountfrom: number,
    amountto: number,
    batchName: string,
    customerReference: string,
    debitAccount: string,
    fileType: string,
    initiationDatefrom: string,
    initiationDateto: string,
    paymentDatefrom: string,
    paymentDateto: string,
    systemFileName: string,
    purpose: string,
  ): Observable<any> {
    let filtros = false

    if (
      amountfrom != undefined ||
      amountto != undefined ||
      batchName != '' ||
      customerReference != '' ||
      (debitAccount != '' && debitAccount != null) ||
      (fileType != '' && fileType != null) ||
      initiationDatefrom != '' ||
      initiationDateto != '' ||
      paymentDatefrom != '' ||
      paymentDateto != '' ||
      systemFileName != '' ||
      (purpose != '' && purpose != null)
    ) {
      filtros = true
    } else {
      filtros = false
    }

    let data = {}
    if (filtros == false) {
      data = {
        search: false,
        page,
        rows,
      }
    } else {
      data = {
        amountFrom: amountfrom ? amountfrom : '',
        amountTo: amountto ? amountto : '',
        batchName: batchName ? batchName : '',
        customerReference: customerReference ? customerReference : '',
        initiationDateFrom: initiationDatefrom ? initiationDatefrom : '',
        initiationDateTo: initiationDateto ? initiationDateto : '',
        paymentDateFrom: paymentDatefrom ? paymentDatefrom : '',
        paymentDateTo: paymentDateto ? paymentDateto : '',
        systemFileName: systemFileName ? systemFileName : '',
        search: true,
        page,
        rows,
      }
    }

    //console.log("REQUEST SEARCH");

    return this.http
      .post(this.servicesUrl + '/directDebits/files/list', data)
      .pipe(
        map((response: any) => {
          const result: ResponseListFilesDirectDebits =
            new ResponseListFilesDirectDebits()
          const body = response

          if (response.errorCode !== '0') {
            return null
          } else {
            const output = this.addTransformValues(
              body.processedFiles.items,
              body.ddAccountFrom,
            )

            const pagedData = new PagedData<any>()
            const pageObject = new Page()

            pageObject.pageNumber = page
            pageObject.pageSize = rows
            pageObject.size = body.processedFiles.size
            pageObject.totalElements = body.processedFiles.total
            pageObject.totalPages =
              pageObject.totalElements / pageObject.pageSize

            pagedData.data = output
            pageObject.size = body.processedFiles.size
            pageObject.totalElements = body.processedFiles.total
            pagedData.page = pageObject
            result.page = pagedData
            result.accountFrom = body.ddAccountFrom
            return result
          }
        }),
        catchError(this.handleError),
      )
  }

  public relatedProcessedFile(fileName): Observable<any> {
    const name = fileName.split('.')
    const file = name[0]

    return this.http
      .get(this.servicesUrl + '/directDebits/files/related/' + file)
      .pipe(
        map((response: any) => {
          let result: any
          const body = response

          if (response.errorCode !== '0') {
            return null
          } else {
            const output = body.processedFiles.items
            const pagedData = new PagedData<any>()
            const pageObject = new Page()
            //
            pageObject.pageNumber = 1
            pageObject.pageSize = body.processedFiles.size
            pageObject.size = body.processedFiles.size
            pageObject.totalElements = body.processedFiles.total
            pageObject.totalPages =
              pageObject.totalElements / pageObject.pageSize

            pagedData.page = pageObject
            result = pagedData

            pagedData.data = output
            pagedData.page = pageObject
            result = pagedData
            return result
          }
        }),
        catchError(this.handleError),
      )
  }

  public getFileDetail(file): Observable<any> {
    const data = {
      file,
    }
    return this.http
      .post(this.servicesUrl + '/directDebits/files/details', data)
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

  public delete(file: any) {
    const data = {
      filesToDelete: [
        {
          batchName: file.batchName,
          dataReceived: file.dataReceived,
          fileName: file.fileName,
          fileSize: file.fileSize,
          userFileName: file.userFileName,
        },
      ],
    }
    let _param: HttpParams = new HttpParams()
    _param = _param.append('deletebody', JSON.stringify(data))
    return this.http
      .delete(this.servicesUrl + '/directDebits/files/delete', {
        params: _param,
      })
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

  downloadFile(details, salaryFile, typeFile): Observable<any> {
    let url = ''
    const data = {
      file: details,
      fileFormat: salaryFile,
      reportType: '2',
    }

    if (typeFile == 's') {
      url = '/directDebits/files/download/sent'
    } else {
      url = '/directDebits/files/download'
    }

    return this.http.post(this.servicesUrl + url, data, {
      responseType: 'blob',
    })
  }

  private addTransformValues(items, accountFrom): Array<any> {
    if (items == null) {
      return items
    }
    for (const item of items) {
      item.batchNameReference = this.addSeparator([
        item.batchName,
        item.customerReference ? item.customerReference : '',
      ])
      item.accountD = this.addSeparator([accountFrom, item.paymentDate])
      item.total = this.addSeparator([
        item.totalAmount,
        item.rajhiRecordCount + item.localRecordCount,
      ])
      item.rajhiRecord = this.addSeparator([
        item.rajhiRecordAmount,
        item.rajhiRecordCount,
      ])
      item.local = this.addSeparator([
        item.localRecordAmount,
        item.localRecordCount,
      ])
      item.initDBy = this.addSeparator([item.initiatedBy, item.initiationDate])
      item.approvedDBy = this.addSeparator([item.approvedBy, item.approvedDate])
    }

    return items
  }

  private addSeparator(strings) {
    let stringFull = ''
    strings.forEach((item) => {
      stringFull = stringFull + item + '\n'
    })
    return stringFull
  }
}
