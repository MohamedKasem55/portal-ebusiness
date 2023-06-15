import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import {
  BehaviorSubject,
  Observable,
  of,
  throwError as observableThrowError,
} from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from 'app/Application/Model/exception'

@Injectable()
export class FeedBackFilesService {
  servicesUrl: string
  fileName: any
  private fileSelected: BehaviorSubject<any> = new BehaviorSubject<any>(null)

  constructor(private http: HttpClient, public config: ConfigResourceService) {
    this.servicesUrl = config.getServicesUrl()
  }

  // Service management error
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

  public getResults(page: number, rows: number): Observable<any> {
    const body = {
      page,
      rows,
    }

    return this.http
      .post(`${this.servicesUrl}/billPaymentService/feedBackFile/list`, body)
      .pipe(
        map((response: any) => response),
        catchError(this.handleError),
      )
  }

  public details(filename): Observable<any> {
    const data = {
      fileReference: filename,
    }

    const req = JSON.stringify(data)

    return this.http
      .post(this.servicesUrl + '/billPaymentService/feedBackFile/details', req)
      .pipe(
        map((response: any) => {
          const body = response

          if (response.errorCode !== '0') {
            return null
          } else {
            return body.billPaymentDetailsOutput
          }
        }),
        catchError(this.handleError),
      )
  }

  public delete(file) {
    const data = {
      fileToDelete: file,
    }

    const req = JSON.stringify(data)

    return this.http
      .post(this.servicesUrl + '/billPaymentService/feedBackFile/delete', req)
      .pipe(
        map((response: any) => {
          const body = response

          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return observableThrowError(exception)
          } else {
            return of(body)
          }
        }),
        catchError(this.handleError),
      )
  }

  setFileName(filename) {
    this.fileName = filename
  }

  getFileName() {
    return this.fileName
  }

  setFileSelected(value: any): void {
    this.fileSelected.next(value)
  }

  getFileSelected(): Observable<any> {
    return this.fileSelected.asObservable()
  }
}
