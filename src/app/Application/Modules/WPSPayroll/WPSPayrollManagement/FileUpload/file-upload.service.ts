import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
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
    console.error(errMsg)
    const errorService: Exception = new Exception('handle', errMsg)
    return observableThrowError(errorService)
  }

  public uploadFileEmployees(file: File): Observable<any> {
    //console.log("uploadFileEmployees");
    const headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data',
    })
    const formData = new FormData()
    formData.append('file', file)
    return this.http
      .post(
        this.servicesUrl + '/payrollWPS/employees/fileEmployees/validate',
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
        catchError(this.handleError),
      )
  }

  public uploadFileSalary(file: File, batchName: string, paymentPurpose: string): Observable<any> {
    /* const data = {
             batch: null,
             batchName: batchName,
             challengeFlag: false,
             payrollCompanyDetails : payrollDetails.payrollCompanyDetails,
             payrollFileDetails: null,
             salaryPaymentDetailsDTO:null
         };*/

    const formData = new FormData()

    //formData.append('json', JSON.stringify(data));
    formData.append('file', file)
    const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data')

    return this.http
      .post(
        this.servicesUrl +
        '/payrollWPS/salaryPayment/file/validate/v2/' +
        batchName + '/' +
        paymentPurpose,
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
        catchError(this.handleError),
      )
  }

  public saveEmployFile(employees: any): Observable<any> {
    const data = {
      employeesList: employees,
    }

    return this.http
      .post(this.servicesUrl + '/payrollWPS/employees/fileEmployees/save', data)
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

  /*public getPayrollDetails(): Observable<any> {
        //console.log('call payrollDetails');
        return this.http.get(this.servicesUrl+"/payrollWPS/salaryPayments/getPayrollDetails").map((response: any ) => {
            const body = response;
            if ( response.errorCode !== "0" ){
                   const exception: Exception = new Exception(body.errorCode, body.errorDescription);
                   return Observable.throw( exception );
            }
            else {
                const output = body;
                return output;
            }
        })catchError( this.handleError);
    }*/

  public saveSalaryFile(
    payrollBatchDTO: any,
    requestValidate: any,
    salaryPaymentDetails: any,
  ): Observable<any> {
    const data = {
      payrollBatch: payrollBatchDTO,
      requestValidate,
      salaryPaymentDetails,
    }

    return this.http
      .post(this.servicesUrl + '/payrollWPS/salaryPayment/file/confirm', data)
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

  getFileSalary() {
    const output = {
      file: new Blob(),
      fileName: '',
    }
    const data = {
      name: 'PSH_WPS_Payroll_Upload_File.xlsm',
    }

    return this.http
      .post(this.servicesUrl + '/template/download', data, {
        responseType: 'blob',
      })
      .pipe(
        map((res) => {
          output.file = res
          output.fileName = data.name
          //

          return output
        }),
      )
  }

  getFileEmployee() {
    const output = {
      file: new Blob(),
      fileName: '',
    }

    const data = {
      name: 'WPS_Payroll_employees_list.xlsm',
    }

    return this.http
      .post(this.servicesUrl + '/template/download', data, {
        responseType: 'blob',
      })
      .pipe(
        map((res) => {
          output.file = res
          output.fileName = data.name

          //

          return output
        }),
      )
  }


  getCompanyJuridicalState() {
    return this.http
      .get(this.servicesUrl + '/companyDetails/juridicalState')
      .pipe(
        map((response: any) => {
          const output = response
          if (response.errorCode !== '0') {
            return new Exception(
              output.errorCode,
              output.errorDescription,
            )
          } else {
            return output
          }
        }),
        catchError(this.handleError),
      )
  }
}
