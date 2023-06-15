import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { Exception } from '../../../../Model/exception'

@Injectable()
export class FileUploadService {
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

    const errorService: Exception = new Exception('handle', errMsg)
    return errorService
  }

  public uploadFileEmployees(file: File): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data',
    })
    const formData = new FormData()
    formData.append('file', file)
    return this.http
      .post(
        this.servicesUrl + '/payrollStandard/payrollEmployees/uploadFile',
        formData,
        { headers },
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
      )
  }

  public uploadFileSalary(
    file: File,
    batchName: any,
    payrollDetails: any,
  ): Observable<any> {
    const data = {
      batch: null,
      batchName,
      challengeFlag: false,
      payrollCompanyDetails: payrollDetails.payrollCompanyDetails,
      payrollFileDetails: null,
      salaryPaymentDetailsDTO: null,
    }

    const formData = new FormData()

    formData.append('json', JSON.stringify(data))
    formData.append('file', file)
    const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data')

    return this.http
      .post(
        this.servicesUrl + '/payrollStandard/importPayroll/importFile',
        formData,
        { headers },
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
      )
  }

  public saveEmployFile(employees: any): Observable<any> {
    const data = {
      uploadEmployeeList: employees,
    }

    return this.http
      .post(
        this.servicesUrl + '/payrollStandard/payrollEmployees/saveFile',
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
            return output
          }
        }),
      )
  }

  public getPayrollDetails(): Observable<any> {
    ////console.log('call payrollDetails');
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
      )
  }

  public saveSalaryFile(
    payrollBatchDTO: any,
    paymentDetails: any,
    _requestValidate: RequestValidate,
  ): Observable<any> {
    const data = {
      payrollBatchDTO,
      salaryPaymentDetailsDTO: paymentDetails,
      requestValidate: _requestValidate,
    }

    return this.http
      .post(
        this.servicesUrl + '/payrollStandard/importPayroll/confirmUploadFile',
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
            return output
          }
        }),
      )
  }
}
