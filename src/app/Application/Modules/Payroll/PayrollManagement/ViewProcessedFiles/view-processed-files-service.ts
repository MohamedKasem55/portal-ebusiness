import { DatePipe } from '@angular/common'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Exception } from 'app/Application/Model/exception'
import {
  BehaviorSubject,
  Observable,
  of,
  throwError as observableThrowError,
} from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { Page } from '../../../../Model/page'
import { PagedData } from '../../../../Model/paged-data'

@Injectable()
export class ViewProcessedFilesService {
  servicesUrl: string
  public cacheCombos: Map<String, any> = new Map<String, any>()
  public allComboData: any = []
  currentItem: BehaviorSubject<any> = new BehaviorSubject<any>(null)

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    private datePipe: DatePipe,
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

  getStaticData(combos: string[]): Observable<any[]> {
    const combosRequest: any = []
    for (let i = 0; i < combos.length; i++) {
      // if(!this.cacheCombos.has(combos[i])){
      combosRequest.push(combos[i])
      // }
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

  public getDataTableResults(
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

    //console.log("FILE NAME");
    //console.log(systemFileName);

    if (
      amountfrom != undefined ||
      amountto != undefined ||
      batchName != '' ||
      customerReference != '' ||
      debitAccount != '' ||
      fileType != '' ||
      initiationDatefrom != '' ||
      initiationDateto != '' ||
      paymentDatefrom != '' ||
      paymentDateto != '' ||
      systemFileName != '' ||
      purpose != ''
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
        amountFrom: amountfrom ? amountfrom : null,
        amountTo: amountto ? amountto : null,
        batchName: batchName ? batchName : null,
        customerReference: customerReference ? customerReference : null,
        debitAccount: debitAccount ? debitAccount : null,
        fileType: fileType ? fileType : null,
        initiationDateFrom: initiationDatefrom
          ? this.datePipe.transform(initiationDatefrom, 'yyyy-MM-dd')
          : null,
        initiationDateTo: initiationDateto
          ? this.datePipe.transform(initiationDateto, 'yyyy-MM-dd')
          : null,
        paymentDatefrom: paymentDatefrom
          ? this.datePipe.transform(paymentDatefrom, 'yyyy-MM-dd')
          : null,
        paymentDateto: paymentDateto
          ? this.datePipe.transform(paymentDateto, 'yyyy-MM-dd')
          : null,
        systemFileName: systemFileName ? systemFileName : null,
        paymentPurpose: purpose ? purpose : null,
        search: true,
        page,
        rows,
      }
    }

    return this.http
      .post(this.servicesUrl + '/payrollStandard/processedFile/list', data)
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
            return result
          }
        }),
        catchError(this.handleError),
      )
  }

  public getDataTableGetFilesResults(
    page: number,
    rows: number,
    wpsSalaryFileDTOSelected: any,
    payrollCompanyDetails: any,
  ): Observable<any> {
    const data = {
      file: wpsSalaryFileDTOSelected,
      payrollCompanyDetails,
      page,
      rows,
    }

    return this.http
      .post(this.servicesUrl + '/payrollStandard/processedFile/related', data)
      .pipe(
        map((response: any) => {
          let result: any
          const body = response

          if (response.errorCode !== '0') {
            return null
          } else {
            const output = body.files
            const pagedData = new PagedData<any>()
            const pageObject = new Page()
            //
            pageObject.pageNumber = 1
            pageObject.pageSize = body.files.length //rows;
            pageObject.size = body.files.length
            pageObject.totalElements = body.files.length
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

  public getFileDetail(
    wpsSalaryFileDTO,
    payrollCompanyDetails,
  ): Observable<any> {
    const data = {
      file: wpsSalaryFileDTO,
      payrollCompanyDetails,
    }

    return this.http
      .post(this.servicesUrl + '/payrollStandard/sentFile/details', data)
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

  public getOtherFileDetail(
    wpsSalaryFileDTO,
    payrollCompanyDetails,
  ): Observable<any> {
    const data = {
      file: wpsSalaryFileDTO,
      payrollCompanyDetails,
    }

    //console.log(wpsSalaryFileDTO);

    return this.http
      .post(this.servicesUrl + '/payrollStandard/processedFile/details', data)
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

  public cancel(salaryFile: any, requestValidate: any) {
    const data = {
      feedBackFilesDetails: salaryFile,
      requestValidate,
    }

    return this.http
      .post(this.servicesUrl + '/payrollStandard/sentFile/cancel', data)
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

  downloadFile(details, salaryFile): Observable<any> {
    const data = {
      details,
      salaryFileDetails: salaryFile,
    }
    return this.http.post(
      this.servicesUrl + '/payrollStandard/processedFile/csvSent',
      data,
      { responseType: 'blob' },
    )
  }

  validateCancel() {
    return this.http
      .get(this.servicesUrl + '/payrollStandard/sentFile/previewCancel')
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

  setCurrenItem(value) {
    this.currentItem.next(value)
  }

  getCurrentItemData() {
    return this.currentItem.asObservable()
  }
}
