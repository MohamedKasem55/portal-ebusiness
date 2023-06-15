/**
 * Service to obtain the balance certificate
 */
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import {
  BehaviorSubject,
  Observable,
  throwError as observableThrowError,
} from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from '../../../Model/exception'

@Injectable()
export class FeedbackTransferService {
  token: string
  servicesUrl: string
  currentUser
  // file:any=null;
  file: BehaviorSubject<any> = new BehaviorSubject<any>(null)

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
      .post(this.servicesUrl + '/transfers/feedBackFile/list', body)
      .pipe(
        map((response: any) => response),
        catchError(this.handleError),
      )
  }

  public getDetails(file): Observable<any> {
    const data = {
      fileReference: file.fileReference,
      fileType: file.fileType,
    }

    const req = JSON.stringify(data)

    return this.http
      .post(this.servicesUrl + '/transfers/feedBackFile/details', req)
      .pipe(
        map((response: any) => {
          const body = response

          if (response.errorCode !== '0') {
            return null
          } else {
            return body
          }
        }),
        catchError(this.handleError),
      )
  }

  setFile(file) {
    this.file.next(file)
  }

  getFile() {
    return this.file.asObservable()
  }
}
