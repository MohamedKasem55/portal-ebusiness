import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of, throwError as observableThrowError } from 'rxjs'
import { catchError, map, switchMap } from 'rxjs/operators'
import { Exception } from '../../../../Application/Model/exception'
import { Page } from '../../../../Application/Model/page'
import { PagedData } from '../../../../Application/Model/paged-data'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'

@Injectable()
export class ManagePayerService {
  servicesUrl: string

  civili = null
  employeeNumber = null
  employeeName = null
  dataB: any

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

  //Mirar la salida, de momento adaptado para que siga como antes.
  public getList(datos, pageNumber, rows, search): Observable<any> {
    const data = {
      mandateReference: datos.mandateNumber,
      personalName: datos.payerName,
      bankCode: datos.bank,
      account: datos.payerAccount,
      amountFrom: datos.amountFrom,
      amountTo: datos.amountTo,
      page: pageNumber, //0,
      rows, //0,
      search,
    }
    return this.http
      .post(this.servicesUrl + '/directDebits/customers/list', data)
      .pipe(
        switchMap((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return observableThrowError(exception)
          } else {
            const output = body
            const pagedData = new PagedData<any>()
            const page = new Page()
            page.pageNumber = pageNumber
            page.pageSize = rows
            page.size = output.customerList.size
            page.totalElements = output.customerList.total
            page.totalPages = page.totalElements / page.size
            pagedData.page = page
            // output.customerList.items.forEach(item => {
            //   item.bankCodePayroll = item.bankCode;
            //   item.bankNamePayroll = item.bankName});
            pagedData.data = output.customerList.items
            pagedData.data.forEach(
              (element) => (element['bankDirect'] = element['bank']),
            )
            return of(pagedData)
          }
        }),
        catchError(this.handleError),
      )
  }

  //nueva llamada
  // public init(): Observable<any>{
  //   return this.http.get(this.servicesUrl+"/payrollWPS/employees/add/init").pipe(map( (response: any) => {
  //         const body = response;
  //         if ( response.errorCode !== "0" ){
  //                const exception: Exception = new Exception(body.errorCode, body.errorDescription);
  //                return Observable.throw( exception );
  //         }
  //         else {
  //            const output = body;
  //            return output;
  //         }
  //     }),catchError( this.handleError ));
  // }

  public valid(datos, page, row): Observable<any> {
    const customers = []
    for (let i = 0; i < datos.length; i++) {
      //console.log(datos[i].bank);
      customers.push({
        account: datos[i].account ? datos[i].account : null,
        amount: datos[i].amount ? +datos[i].amount : null,
        bank: datos[i].bank ? datos[i].bank : null,
        claimDate: datos[i].claimDate ? datos[i].claimDate : null,
        companyCustomerPk: datos[i].companyCustomerPk
          ? datos[i].companyCustomerPk
          : null,
        mandate: datos[i].mandate ? datos[i].mandate : null,
        personalName: datos[i].personalName ? datos[i].personalName : null,
        personalAddress1: datos[i].personalAddress1
          ? datos[i].personalAddress1
          : null,
        description1: datos[i].description1 ? datos[i].description1 : null,
        personalAddress2: datos[i].personalAddress2
          ? datos[i].personalAddress2
          : null,
        description2: datos[i].description2 ? datos[i].description2 : null,
        personalAddress3: datos[i].personalAddress3
          ? datos[i].personalAddress3
          : null,
        description3: datos[i].description3 ? datos[i].description3 : null,
        description4: datos[i].description4 ? datos[i].description4 : null,
        dueDate: datos[i].dueDate ? datos[i].dueDate : null,
        frequency: datos[i].frequency ? datos[i].frequency : null,
        indexSelected: datos[i].indexSelected ? datos[i].indexSelected : null,
        instalmentNumber: datos[i].instalmentNumber
          ? datos[i].instalmentNumber
          : null,
        selected: datos[i].selected ? datos[i].selected : null,
      })
    }

    const data = {
      companyCustomers: customers,
      modify: false,
    }

    return this.http
      .post(this.servicesUrl + '/directDebits/customers/validate', data)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
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

  public confirm(datos, page, row): Observable<any> {
    const data = {
      companyCustomers: datos,
      page,
      rows: row,
    }

    data.companyCustomers.forEach((c) => (c.amount = +c.amount))

    return this.http
      .post(this.servicesUrl + '/directDebits/customers/save', data)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
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

  public delete(datos): Observable<any> {
    const customer = []
    for (let i = 0; i < datos.length; i++) {
      customer.push(datos[i])
    }

    const data = {
      companyCustomers: customer,
    }

    data.companyCustomers.forEach((c) => (c.amount = +c.amount))

    let _param: HttpParams = new HttpParams()
    _param = _param.append('deletebody', JSON.stringify(data))

    return this.http
      .delete(this.servicesUrl + '/directDebits/customers/delete', {
        params: _param,
      })
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
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

  public validModify(datos, page, row): Observable<any> {
    //console.log(datos);
    const customers = []
    for (let i = 0; i < datos.length; i++) {
      datos[i].amount = +datos[i].amount
      customers.push(datos[i])
    }

    const data = {
      companyCustomers: customers,
      modify: true,
    }

    return this.http
      .post(this.servicesUrl + '/directDebits/customers/validate', data)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
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

  public confirmModify(datos, page, row): Observable<any> {
    const customers = []
    for (let i = 0; i < datos.length; i++) {
      datos[i].amount = +datos[i].amount
      customers.push(datos[i])
    }

    const data = {
      companyCustomers: customers,
      modify: true,
    }

    return this.http
      .post(this.servicesUrl + '/directDebits/customers/save', data)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
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
}
