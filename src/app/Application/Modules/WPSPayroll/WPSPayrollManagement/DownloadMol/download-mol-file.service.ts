import { DatePipe } from '@angular/common'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { Exception } from '../../../../Model/exception'
import { Page } from '../../../../Model/page'
import { PagedData } from '../../../../Model/paged-data'

@Injectable()
export class DownloadMolFileService {
  servicesUrl: string
  public cacheCombos: Map<String, any> = new Map<String, any>()
  public allComboData: any = []

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
    //console.error(errMsg);
    const errorService: Exception = new Exception('handle', errMsg)
    return observableThrowError(errorService)
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

  public getDataTableResults(
    isFirstSearch: boolean,
    page: number,
    rows: number,
    amountfrom: number,
    amountto: number,
    batchName: string,
    customerReference: string,
    debitAccount: string,
    initiateDatefrom: string,
    initiateDateto: string,
    paymentDatefrom: string,
    paymentDateto: string,
    systemFileName: string,
  ): Observable<any> {
    let filtros = false

    //console.log("FILE NAME");
    //console.log(systemFileName);

    if (
      amountfrom != undefined ||
      amountto != undefined ||
      batchName != '' ||
      customerReference != '' ||
      debitAccount != '' ||
      initiateDatefrom != '' ||
      initiateDateto != '' ||
      paymentDatefrom != '' ||
      paymentDateto != '' ||
      systemFileName != ''
    ) {
      filtros = true
    }
    if (
      amountfrom == null &&
      amountto == null &&
      batchName == null &&
      customerReference == null &&
      debitAccount == null &&
      initiateDatefrom == null &&
      initiateDateto == null &&
      paymentDatefrom == null &&
      paymentDateto == null &&
      systemFileName == null
    ) {
      filtros = false
    }
    //console.log(debitAccount);
    let data = {}
    if (filtros == false) {
      data = {
        search: false,
        page,
        rows,
      }
    } else {
      data = {
        amountfrom,
        amountto,
        batchName: batchName == '' ? null : batchName,
        customerReference: customerReference == '' ? null : customerReference,
        debitAccount: debitAccount == '' ? null : debitAccount,
        initiationDatefrom:
          initiateDatefrom == '' || initiateDatefrom == null
            ? null
            : this.datePipe.transform(initiateDatefrom, 'yyyy-MM-dd'),
        initiationDateto:
          initiateDateto == '' || initiateDateto == null
            ? null
            : this.datePipe.transform(initiateDateto, 'yyyy-MM-dd'),
        paymentDatefrom:
          paymentDatefrom == '' || paymentDatefrom == null
            ? null
            : this.datePipe.transform(paymentDatefrom, 'yyyy-MM-dd'),
        paymentDateto:
          paymentDateto == '' || paymentDateto == null
            ? null
            : this.datePipe.transform(paymentDateto, 'yyyy-MM-dd'),
        systemFileName: systemFileName == '' ? null : systemFileName,
        search: true,
        page,
        rows,
      }
    }

    return this.http
      .post(this.servicesUrl + '/payrollWPS/MOLFiles/list', data)
      .pipe(
        map((response: any) => {
          const body = response

          if (response.errorCode !== '0') {
            return null
          } else {
            const output = !isFirstSearch ? body.listFile.items : []
            const pagedData = new PagedData<any>()
            const pageObject = new Page()

            pageObject.pageNumber = !isFirstSearch ? page : 1
            pageObject.pageSize = rows
            pageObject.size = !isFirstSearch ? body.listFile.size : 0
            pageObject.totalElements = !isFirstSearch ? body.listFile.total : 0
            pageObject.totalPages =
              pageObject.totalElements / pageObject.pageSize

            pagedData.data = output

            pagedData.page = pageObject

            pagedData['payrollCompanyDetails'] = body.payrollCompanyDetails
            pagedData['accountList'] = body.accountList

            return pagedData
          }
        }),
        catchError(this.handleError),
      )
  }

  downloadFile(fileData): Observable<any> {
    const data = {
      file: fileData,
    }
    return this.http.post(
      this.servicesUrl + '/payrollWPS/MOLFiles/download',
      data,
      { responseType: 'blob' },
    )
  }

  downloadAllFile(files): Observable<any> {
    const data = {
      filesSelected: files,
    }
    return this.http.post(
      this.servicesUrl + '/payrollWPS/MOLFiles/download/list',
      data,
      { responseType: 'blob' },
    )
  }
}
