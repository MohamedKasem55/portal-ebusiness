import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { forkJoin, Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from 'app/Application/Model/exception'

@Injectable()
export class AccountsPosSearchCriteriaRequest {
  token: string
  servicesUrl: string
  currentUser

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

  getDatacriteria(
    parametros,
    indext,
    dateFromSTR,
    dateToSTR,
    _allTerminals,
  ): Observable<any> {
    const observables: Observable<any>[] = []

    for (let perid = 0; perid < indext.length; perid++) {
      const ejemplo = {
        allTerminals: _allTerminals,
        dateFrom: dateFromSTR,
        dateTo: dateToSTR,
        period: indext[perid].charAt(0),
        selectedTerminals: parametros,
      }
      observables.push(
        this.http
          .post(
            this.servicesUrl + '/posStatementCU/searchTerminalsFiles',
            ejemplo,
          )
          .pipe(
            map((response: any) => {
              const result: any = {}
              const body = response

              if (response.errorCode !== '0') {
                return null
              } else {
                const output = body.outputDTO
                for (let i = 0; i < output.fileList.length; i++) {
                  //output.fileList[total].terminalId = parametros[total].terminalId
                  let filenameToTerminalId =
                    output.fileList[i].fileName.split('_')[1]
                  output.fileList[i].terminalId = filenameToTerminalId
                  output.fileList[i].type = indext[perid]
                }
                return output
              }
            }),
            catchError(this.handleError),
          ),
      )
    }

    return forkJoin(observables)
  }

  singleDowload(body): Observable<any> {
    return this.http.post(this.servicesUrl + '/posStatementCU/download', body, {
      responseType: 'blob',
    })
  }

  multipleDowload(json): Observable<Blob> {
    //console.log("entro aqui en el segundo service")
    //

    const headers = {
      'Content-Type': 'application/zip',
      Accept: 'application/zip',
    }

    const pre = JSON.stringify(json)
    //console.log("imprimo pre")
    //console.log(pre)
    return this.http.post(
      this.servicesUrl + '/posStatementCU/downloadBundle',
      pre,
      { responseType: 'blob' },
    )
  }
}
