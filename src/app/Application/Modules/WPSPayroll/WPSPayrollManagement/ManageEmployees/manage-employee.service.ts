import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { Exception } from '../../../../../Application/Model/exception'
import { Page } from '../../../../../Application/Model/page'
import { PagedData } from '../../../../../Application/Model/paged-data'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'

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

  //Mirar la salida, de momento adaptado para que siga como antes.
  public getEmployList(
    datos,
    pageNumber,
    rows,
    order,
    orderType,
  ): Observable<any> {
    const data = {
      civilianId: datos.civilianId, //"string",
      empName: datos.employeeName, //"string",
      employeeNumber: datos.employeeNumber, //"string",
      departmentId: datos.departmentId,
      order,
      orderType,
      page: pageNumber, //0,
      rows, //0,
      search: true,
    }
    /*order [valores]
          employeeReference
          name
          civilianId
          bankCode
          account
          salary*/

    return this.http
      .post(this.servicesUrl + '/payrollWPS/employees/list', data)
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
            page.size = output.employeesList.size
            page.totalElements = output.employeesList.total
            page.totalPages = page.totalElements / page.size
            const size = output.size
            pagedData.page = page
            //console.log(output.employeesList);
            output.employeesList.items.forEach((item) => {
              item.bankCodePayroll = item.bankCode
              item.bankNamePayroll = item.bankName
            })
            pagedData.data = output.employeesList.items
            pagedData['departmentListSelected'] = output.departmentListSelected
            pagedData['departmentsAll'] = output.departmentsAll
            pagedData['departments'] = output.departments

            //console.log(pagedData);
            return pagedData
          }
        }),
        catchError(this.handleError),
      )
  }

  //nueva llamada
  public initEmployee(): Observable<any> {
    return this.http
      .get(this.servicesUrl + '/payrollWPS/employees/add/init')
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

  public validEmployees(datos, currencyCode): Observable<any> {
    const employ = []
    for (let i = 0; i < datos.length; i++) {
      employ.push({
        account: datos[i].account,
        bankCode: datos[i].bank,
        civilianId: datos[i].civilianId,
        name: datos[i].employeeName,
        employeeReference: datos[i].employeeNumber,
        salary: datos[i].salary,
        departmentId: datos[i].departmentId,
        salaryBasic: datos[i].salaryBasic,
        allowanceHousing: datos[i].allowanceHousing,
        allowanceOther: datos[i].allowanceOther,
        deductions: datos[i].deductions,
        currencyCode,
      })
    }

    const data = {
      employeesList: employ,
    }
    //console.log(datos);
    return this.http
      .post(this.servicesUrl + '/payrollWPS/employees/add/validate', data)
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

  public confirmEmployees(datos): Observable<any> {
    const data = {
      employeesList: datos,
    }

    return this.http
      .post(this.servicesUrl + '/payrollWPS/employees/add/confirm', data)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
              body.generateChallengeAndOTP,
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
      employeesList: employ,
    }

    let _param: HttpParams = new HttpParams()
    _param = _param.append('deletebody', JSON.stringify(data))

    return this.http
      .post(this.servicesUrl + '/payrollWPS/employees/delete/confirm', data)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
              body.generateChallengeAndOTP,
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

  public initModifyEmployee(): Observable<any> {
    return this.http
      .get(this.servicesUrl + '/payrollWPS/employees/modify/init')
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

  public validModifyEmployees(datos, currencyCode): Observable<any> {
    //console.log(datos);
    const employ = []
    for (let i = 0; i < datos.length; i++) {
      employ.push({
        account: datos[i].account,
        bankCode: datos[i].bank,
        bankName: null,
        blockAmount: datos[i].employ.blockAmount,
        civilianId: datos[i].civilianId,
        currencyCode,
        companyPk: datos[i].employ.companyPk,
        employeePk: datos[i].employ.employeePk,
        employeeReference: datos[i].employeeNumber,
        departmentId: datos[i].departmentId,
        kawadar: datos[i].employ.kawadar,
        lastUpdate: datos[i].employ.lastUpdate,
        name: datos[i].employeeName,
        processFlag: datos[i].employ.processFlag,
        rajhiValidAccount: datos[i].employ.rajhiValidAccount,
        salary: datos[i].salary,
        employeeReferenceOLD: datos[i].employeeReferenceOLD,
        civilianIdOLD: datos[i].civilianIdOLD,
        status: datos[i].employ.status,
        allowanceHousing: datos[i].allowanceHousing,
        allowanceOther: datos[i].allowanceOther,
        salaryBasic: datos[i].salaryBasic,
        deductions: datos[i].deductions,
        accountOLD: datos[i].accountOLD,
      })
    }

    const data = {
      employeesList: employ,
    }

    return this.http
      .post(this.servicesUrl + '/payrollWPS/employees/modify/validate', data)
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

  public confirmModifyEmployees(datos): Observable<any> {
    const data = {
      employeesList: datos,
    }

    return this.http
      .post(this.servicesUrl + '/payrollWPS/employees/modify/confirm', data)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
              body.generateChallengeAndOTP,
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
