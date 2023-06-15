import { Injectable } from '@angular/core'
import { catchError, map } from 'rxjs/operators'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from 'app/Application/Model/exception'
import { throwError as observableThrowError } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class CdmterminalService {
  servicesUrl: string
  terminalDetails: any

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

  public getlist() {
    return this.http.get(this.servicesUrl + '/lockbox/terminals').pipe(
      map((response: any) => {
        return response
      }),
      catchError(this.handleError),
    )
  }

  public getlistId(id) {
    return this.http.get(this.servicesUrl + '/lockbox/terminal/' + id).pipe(
      map((response: any) => {
        return response
      }),
      catchError(this.handleError),
    )
  }

  public listStatementData(data) {
    return this.http
      .post(this.servicesUrl + '/lockbox/terminalstatment', data)
      .pipe(
        map((response: any) => {
          let result: any
          let page = data.page
          let rows = data.rows
          const body = response

          if (response.errorCode !== '0') {
            return null
          } else {
            //console.log("success",body);
            return result
          }
        }),
        catchError(this.handleError),
      )
  }

  setTerminalDetails(details) {
    this.terminalDetails = details
  }

  getTerminalDetails() {
    const termiDetails = this.terminalDetails
    return termiDetails
  }
}
