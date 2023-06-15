import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { Injectable } from '@angular/core'
import { catchError, map } from 'rxjs/operators'
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http'
import { Page } from '../../../../Model/page'
import { Exception } from '../../../../Model/exception'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { PagedData } from '../../../../Model/paged-data'

@Injectable()
export class ManageEmployeeService {
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

  public getEmployList(datos, pageNumber, rows): Observable<any> {
    const data = {
      accountSelected: null, //"string",
      batchName: null, //"string",
      civilianID: datos.civilianId, //"string",
      customerReference: null, //"string",
      employeeName: datos.employeeName, //"string",
      employeeNumber: datos.employeeNumber, //"string",
      listCompletePagination: [true],
      page: pageNumber, //0,
      paymentDate: null, //"string",
      rows, //0,
      search: true,
      totalEmployees: null, //0
    }

    return this.http
      .post(
        this.servicesUrl +
          '/payrollStandard/salaryPayments/getListPayrollEmployees',
        data,
      )
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
            const pagedData = new PagedData<any>()
            const page = new Page()
            page.pageNumber = pageNumber
            page.pageSize = rows
            page.size = output.size
            page.totalElements = output.total
            page.totalPages = page.totalElements / page.size
            const size = output.size
            pagedData.page = page
            output.employeesList.forEach((item) => {
              item.bankCodePayroll = item.bankCode
            })
            pagedData.data = output
            return pagedData
          }
        }),
        catchError(this.handleError),
      )
  }

  public addEmployees(datos): Observable<any> {
    const employ = []
    for (let i = 0; i < datos.length; i++) {
      employ.push({
        account: datos[i].account,
        bank: datos[i].bank,
        civilianId: datos[i].civilianId,
        employeeName: datos[i].employeeName,
        employeeNumber: datos[i].employeeNumber,
        salary: datos[i].salary,
      })
    }

    const data = {
      employeesInputList: employ,
    }

    return this.http
      .post(this.servicesUrl + '/payrollStandard/payrollEmployees/new', data)
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

  public saveEmployees(datos): Observable<any> {
    const data = {
      employeesList: datos,
    }

    return this.http
      .post(this.servicesUrl + '/payrollStandard/payrollEmployees/save', data)
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

  public deleteEmployees(datos): Observable<any> {
    const employ = []
    for (let i = 0; i < datos.length; i++) {
      employ.push(datos[i].employ)
    }

    const data = {
      selectedEmployeeList: employ,
    }

    let _param: HttpParams = new HttpParams()
    _param = _param.append('deletebody', JSON.stringify(data))

    return this.http
      .delete(this.servicesUrl + '/payrollStandard/payrollEmployees/delete', {
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

  public validModifyEmployees(datos): Observable<any> {
    const employ = []
    for (let i = 0; i < datos.length; i++) {
      employ.push({
        account: datos[i].account,
        accountFrom15length: null,
        bankCode: datos[i].bank,
        bankName: null,
        blockAmount: datos[i].employ.blockAmount,
        civilianId: datos[i].civilianId,
        companyPk: datos[i].employ.companyPk,
        employeePk: datos[i].employ.employeePk,
        employeeReference: datos[i].employeeNumber,
        kawadar: datos[i].employ.kawadar,
        lastUpdate: datos[i].employ.lastUpdate,
        name: datos[i].employeeName,
        processFlag: datos[i].employ.processFlag,
        rajhiValidAccount: datos[i].employ.rajhiValidAccount,
        salary: datos[i].salary,
        status: datos[i].employ.status,
      })
    }

    const data = {
      employeesList: employ,
    }

    return this.http
      .post(this.servicesUrl + '/payrollStandard/payrollEmployees/modify', data)
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

  public modifyEmployees(datos): Observable<any> {
    const data = {
      employeesList: datos,
    }

    return this.http
      .put(this.servicesUrl + '/payrollStandard/payrollEmployees/update', data)
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
