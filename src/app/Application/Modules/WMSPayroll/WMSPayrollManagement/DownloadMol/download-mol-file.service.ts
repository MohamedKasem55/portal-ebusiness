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
    page: number,
    rows: number,
    amountfrom: number,
    amountto: number,
    batchName: string,
    customerReference: string,
    debitAccount: string,
    valueDatefrom: string,
    valueDateto: string,
    initiateDatefrom: string,
    initiateDateto: string,
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
      valueDatefrom != '' ||
      valueDateto != '' ||
      initiateDatefrom != '' ||
      initiateDateto != '' ||
      systemFileName != ''
    ) {
      filtros = true
    }
    if (
      amountfrom == null &&
      amountto == null &&
      batchName == null &&
      customerReference == null &&
      valueDatefrom == null &&
      valueDateto == null &&
      initiateDatefrom == null &&
      initiateDateto == null &&
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
        amountFrom: amountfrom,
        amountTo: amountto,
        batchName,
        customerReference,
        debitAccount,
        initiationDateFrom: valueDatefrom,
        initiationDateTo: valueDateto,
        paymentDatefrom: initiateDatefrom,
        paymentDateto: initiateDateto,
        systemFileName,
        search: true,
        page,
        rows,
      }
    }

    return this.http
      .post(this.servicesUrl + '/payrollWPS/MOLFiles/list', data)
      .pipe(
        map((response: any) => {
          let result: any
          const body = response

          if (response.errorCode !== '0') {
            return null
          } else {
            const output = body.listFile.items
            const pagedData = new PagedData<any>()
            const pageObject = new Page()

            pageObject.pageNumber = page
            pageObject.pageSize = rows
            pageObject.size = body.listFile.size
            pageObject.totalElements = body.listFile.total
            pageObject.totalPages =
              pageObject.totalElements / pageObject.pageSize

            pagedData.data = output

            pagedData.page = pageObject
            result = pagedData
            result['payrollCompanyDetails'] = body.payrollCompanyDetails
            result['accountList'] = body.accountList
            return result
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
