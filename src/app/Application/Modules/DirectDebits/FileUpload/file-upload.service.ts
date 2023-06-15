import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from 'app/Application/Model/exception'

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

  public uploadFilePayer(file: File): Observable<any> {
    //console.log("uploadFileEmployees");
    const headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data',
    })
    const formData = new FormData()
    formData.append('file', file)
    return this.http
      .post(
        this.servicesUrl + '/directDebits/customers/file/validate',
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

  public savePayerFile(employees: any): Observable<any> {
    const data = {
      companyCustomers: employees,
      modify: true,
    }

    data.companyCustomers.forEach((c) => (c.amount = +c.amount))

    return this.http
      .post(this.servicesUrl + '/directDebits/customers/file/confirm', data)
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

  public uploadFileDirectDebit(file: File, batchName: string): Observable<any> {
    const formData = new FormData()

    //formData.append('json', JSON.stringify(data));
    formData.append('file', file)
    const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data')

    return this.http
      .post(
        this.servicesUrl + '/directDebits/claims/file/validate/' + batchName,
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

  public saveDirectDebitFile(
    directDebit: any,
    requestValidate: any,
    directDebitFileFormat: any,
    file: any,
  ): Observable<any> {
    const formData = new FormData()

    //formData.append('json', JSON.stringify(data));

    const data = {
      directDebitBatch: directDebit,
      requestValidate,
      directDebitFileFormat,
    }
    return this.http
      .post(this.servicesUrl + '/directDebits/claims/file/confirm', data)
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

  getFileDirectDebit() {
    const output = {
      file: new Blob(),
      fileName: '',
    }

    const data = {
      name: 'DirectDebits.xlsm',
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

  getFilePayer() {
    const output = {
      file: new Blob(),
      fileName: '',
    }

    const data = {
      name: 'DirectDebitsPayer.xlsm',
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
}
