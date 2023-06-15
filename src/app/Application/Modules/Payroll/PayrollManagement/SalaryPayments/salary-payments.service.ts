import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { Exception } from '../../../../Model/exception'
import { Page } from '../../../../Model/page'
import { PagedData } from '../../../../Model/paged-data'

@Injectable()
export class SalaryPaymentsService {
  servicesUrl: string

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

  public payrollDetails(): Observable<any> {
    return this.http
      .get(
        this.servicesUrl + '/payrollStandard/salaryPayments/getPayrollDetails',
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
            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  public employeeWithoutAccount(order, orderType, page, rows): Observable<any> {
    return this.listPayrollEmploy(
      null,
      null,
      null,
      null,
      page,
      rows,
      order,
      orderType,
    )
  }

  /**
   *@deprecated()
   */
  public listPayrollWithoutAccountEmployee(
    accountSelected,
    batchName,
    customerReference,
    employeesList,
    listCompletePagination,
    paymentDate,
    selectedEmployeeList,
    selectedIndexList,
    unselectedEmployeeList,
    order,
    orderType,
    pageNumber,
    rows,
    isSelected,
  ): Observable<any> {
    const data = {
      accountSelected,
      batchName,
      customerReference,
      employeesList,
      listCompletePagination,
      paymentDate,
      selectedEmployeeList,
      selectedIndexList,
      unselectedEmployeeList,
      order,
      orderType,
      page: pageNumber,
      rows,
      isSelected,
    }

    return this.http
      .post(
        this.servicesUrl +
          '/payrollStandard/salaryPayments/getListPayrollWithoutAccountEmployees',
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
            pagedData.data = output
            return pagedData
          }
        }),
        catchError(this.handleError),
      )
  }

  /**
   *@deprecated()
   */
  public prepareVariables(datos, search): Observable<any> {
    const data = {
      civilianId: datos.civilianId,
      employeeName: datos.employeeName,
      employeeNumber: datos.employeeNumber,
      search,
    }

    return this.http
      .post(
        this.servicesUrl + '/payrollStandard/salaryPayments/prepareVariables',
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
            return body
          }
        }),
        catchError(this.handleError),
      )
  }

  public listPayrollEmploy(
    account,
    paymentDate,
    batchName,
    datos,
    pageNumber,
    rows,
    order,
    oerderType,
  ): Observable<any> {
    const data = {
      accountSelected: account, //"string",
      batchName, //"string",
      civilianID: datos != null ? datos.civilianId : null, //"string",
      customerReference: null, //"string",
      employeeName: datos != null ? datos.employeeName : null, //"string",
      employeeNumber: datos != null ? datos.employeeNumber : null, //"string",
      listCompletePagination: [true],
      page: pageNumber, //0,
      paymentDate, //"string",
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
            pagedData.data = output
            return pagedData
          }
        }),
        catchError(this.handleError),
      )
  }

  /**
   *@deprecated()
   */
  public initSalaryPaymentDetails(
    payrollDetails,
    employData,
    selectedEmployee,
  ): Observable<any> {
    const data = {
      accountListDTO: payrollDetails.accountListDTOLocal,
      accountSelected: '', //204000010006080932741
      order: null,
      orderType: null,
      page: 1,
      payrollCompanyDetails: payrollDetails.payrollCompanyDetails,
      rows: 20,
      salaryPaymentBatchDTO: null,
      salaryPaymentDetailsDTO: employData.salaryPaymentDetailsDTO,
      selectedEmployeeList: selectedEmployee,
      typeAction: null,
    }

    return this.http
      .post(
        this.servicesUrl +
          '/payrollStandard/salaryPayments/initSalaryPaymentDetails',
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
            return body
          }
        }),
        catchError(this.handleError),
      )
  }

  /**
   *@deprecated()
   */
  public confirmSalaryPayments(
    payrollDetails,
    employData,
    selectedEmployee,
  ): Observable<any> {
    const data = {
      payrollCompanyDetails: '', //(PayrollParametersDTO, optional),
      salaryPaymentDetailsDTO: '', // (SalaryPaymentDetailsDTO, optional),
      selectedEmployeeList: '', //(Array[CompanyEmployeeDTO], optional)
    }

    return this.http
      .post(
        this.servicesUrl +
          '/payrollStandard/salaryPayments/confirmBatchPayroll',
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
            return body
          }
        }),
        catchError(this.handleError),
      )
  }

  /**
   *@deprecated()
   */
  public processSalaryPayments(
    payrollDetails,
    employData,
    selectedEmployee,
  ): Observable<any> {
    const data = {
      payrollCompanyDetails: '', //(PayrollParametersDTO, optional),
      requestValidateOTP: '', //(RequestValidateOTP, optional),
      salaryPaymentDetailsDTO: '', //(SalaryPaymentDetailsDTO, optional),
      selectedEmployeeList: '', //(Array[CompanyEmployeeDTO], optional)
    }
    return this.http
      .post(
        this.servicesUrl +
          '/payrollStandard/salaryPayments/processBatchPayroll',
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
            return body
          }
        }),
        catchError(this.handleError),
      )
  }

  public validateSalaryPayments(
    salaryForm,
    account,
    employData,
    selectedEmployee,
  ): Observable<any> {
    const data = {
      accountSelected: account.value.fullAccountNumber,
      batchName: salaryForm.batchName,
      paymentDate: salaryForm.valueDate.toJSON(),
      selectedEmployeeList: selectedEmployee,
    }

    return this.http
      .post(
        this.servicesUrl +
          '/payrollStandard/salaryPayments/validateBatchPayroll',
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
            return body
          }
        }),
        catchError(this.handleError),
      )
  }

  public confirmBatchSalaryPayments(
    payrollDetails,
    employData,
    initPayments,
    selectedEmployee,
    requestValidate,
  ): Observable<any> {
    const data = {
      requestValidate,
      payrollCompanyDetails: payrollDetails.payrollCompanyDetails, //(PayrollParametersDTO, optional),
      salaryPaymentDetailsDTO: initPayments.salaryPaymentDetailsDTO,
      selectedEmployeeList: selectedEmployee,
    }

    return this.http
      .post(
        this.servicesUrl +
          '/payrollStandard/salaryPayments/confirmBatchPayroll',
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
            return body
          }
        }),
        catchError(this.handleError),
      )
  }
}
