import { DatePipe } from '@angular/common'
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from '../../../Model/exception'
import { Page } from '../../../Model/page'
import { PagedData } from '../../../Model/paged-data'

@Injectable()
export class ClaimService {
  servicesUrl: string

  element: any

  constructor(
    public datePipe: DatePipe,
    private http: HttpClient,
    public config: ConfigResourceService,
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

  getData(searchData, page, rows): Observable<any> {
    const data: any = {
      ticketNumber: searchData.idClaim ? searchData.idClaim : null, //"string",
      terminalNumber: searchData.terminalNumber
        ? searchData.terminalNumber
        : null,
      amountFrom: searchData.amountFrom ? searchData.amountFrom : null,
      amountTo: searchData.amountTo ? searchData.amountTo : null,
      //type: searchData.typeOfClaim,//"string",
      dateFrom: this.datePipe.transform(searchData.dateFrom, 'yyyy-MM-dd'), //"string",
      dateTo: this.datePipe.transform(searchData.dateTo, 'yyyy-MM-dd'), //"string",
      order: 'asc',
      orderType: 'ticketNumber',
      page, //0,
      rows, //0,
    }

    const body = JSON.stringify(data)

    return this.http
      .post(this.servicesUrl + '/posManagement/claim/list', body)
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

  public details(element): Observable<any> {
    const data = {
      batch: element,
    }
    return this.http
      .post(this.servicesUrl + '/posManagement/claim/details', data)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode != 0) {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return exception
          } else {
            const output = body.batch

            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  public getTransactionList(
    datos,
    pageNumber,
    rows,
    order,
    orderType,
  ): Observable<any> {
    //console.log(datos);
    const data = {
      terminalID: datos.terminalNumber, //"string",
      merchantNum: datos.merchantNumber,
      //type: datos.typeOfClaim,//"string",
      fromDate: this.datePipe.transform(datos.dateFrom, 'yyyy-MM-dd'), //"string",
      toDate: this.datePipe.transform(datos.dateTo, 'yyyy-MM-dd'), //"string",
      //order: order,
      //orderType: orderType,
      page: pageNumber, //0,
      rows, //0,
    }

    return this.http
      .post(this.servicesUrl + '/posManagement/claim/transactionList', data)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode != 0) {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return exception
          } else {
            const output = body
            const pagedData = new PagedData<any>()
            const page = new Page()
            page.pageNumber = pageNumber
            page.pageSize = rows
            page.size = output.listTrxvsMerchant.size
            page.totalElements = output.listTrxvsMerchant.total
            page.totalPages = page.totalElements / page.size
            const size = output.size
            pagedData.page = page
            pagedData.data = output.listTrxvsMerchant.items
            return pagedData
          }
        }),
        catchError(this.handleError),
      )
  }

  public confirm(datos, requestValidate): Observable<any> {
    //console.log('servicio',datos);
    const data = {
      batchList: datos.batchList,
      requestValidate,
    }

    return this.http
      .post(this.servicesUrl + '/posManagement/claim/confirm', data)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode != 0) {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return exception
          } else {
            const output = body

            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  public validate(datos, file): Observable<any> {
    const data = {
      claims: [],
      mobile: datos.mobile,
    }
    const files: any[] = []
    for (let i = datos.elements.length - 1; i >= 0; i--) {
      data.claims.push({
        accountNumber: datos.elements[i].trxnAcct,
        terminalNumber: datos.elements[i].terminalID,
        transactionAmount: datos.elements[i].amountSARCur,
        reconciliationAmount: datos.elements[i].amountForCur,
        transactionDate: this.datePipe.transform(
          datos.elements[i].trxnDate,
          'yyyy-MM-dd',
        ),
      })
      files.push(file[datos.elements[i].fileIndex])
    }
    const formData = new FormData()

    formData.append('json', JSON.stringify(data))
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < files.length; ++i) {
      formData.append('files', files[i])
    }
    const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data')

    return this.http
      .post(this.servicesUrl + '/posManagement/claim/validate', formData, {
        headers,
      })
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode != 0) {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return exception
          } else {
            const output = body

            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  getTerminals(): Observable<any> {
    const data: any = {}
    const url = this.config.getServicesUrl() + '/posManagement/searchTerminals'
    return this.http.get(url, { params: data }).pipe(
      map((response: any) => {
        const body = response
        if (response.errorCode != 0) {
          const errorService: Exception = new Exception(
            body.errorCode,
            body.errorDescription,
          )
          return observableThrowError(errorService)
        } else {
          const output = response
          const result = output

          return result
        }
      }),
      catchError(this.handleError),
    )
  }

  getAccounts(): Observable<any> {
    const url =
      this.config.getServicesUrl() + '/posStatementCU/account/accountMain'
    return this.http.get(url).pipe(
      map((response: any) => {
        const body = response
        if (response.errorCode != 0) {
          const errorService: Exception = new Exception(
            body.errorCode,
            body.errorDescription,
          )
          return observableThrowError(errorService)
        } else {
          const output = response
          const result = output
          result['accountListDTO'] = response.accountListPos
          return result
        }
      }),
      catchError(this.handleError),
    )
  }

  setDataElement(payment) {
    this.element = payment
  }

  getDataElement() {
    const pay = this.element
    return pay
  }
}
