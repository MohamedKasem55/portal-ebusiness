/**
 * Service to obtain the balance certificate
 */
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { forkJoin, Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../core/config/config.resource.local'
import { Exception } from '../../Model/exception'
import { Page } from '../../Model/page'
import { PagedData } from '../../Model/paged-data'
import { AccountsPosTerminalList } from './accounts-pos-terminal-list.model'

@Injectable()
export class PoSStatementService {
  token: string
  servicesUrl: string
  currentUser
  terminalDetails

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

  getDatacriteria(parametros, indext, dateFromSTR, dateToSTR): Observable<any> {
    const observables: Observable<any>[] = []

    for (let param = 0; param < parametros.length; param++) {
      for (let perid = 0; perid < indext.length; perid++) {
        const ejemplo = {
          allTerminals: false,
          dateFrom: dateFromSTR,
          dateTo: dateToSTR,
          period: indext[perid].charAt(0),
          selectedTerminals: [],
        }
        ejemplo.selectedTerminals.push(parametros[param])
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
                  for (let total = 0; total < output.fileList.length; total++) {
                    output.fileList[total].terminalId =
                      parametros[param].terminalId
                    output.fileList[total].type = indext[perid]
                  }
                  return output
                }
              }),
              catchError(this.handleError),
            ),
        )
      }
    }
    return forkJoin(observables)
  }

  singleDowload(json): Observable<any> {
    const pre = JSON.stringify(json)

    return this.http.post(this.servicesUrl + '/posStatementCU/download', pre, {
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

  public getDataForDataTable(params: any): Observable<any> {
    const pre = JSON.stringify(params)

    // return this.http.post(this.servicesUrl + "/posStatementCU/searchTerminals", pre)
    return this.http
      .post(this.servicesUrl + '/posStatementCU/updateTerminal/list', pre)
      .pipe(
        map((response: any) => {
          const result: any = {}
          const body = response

          if (response.errorCode !== '0') {
            return null
          } else {
            const output = body.terminalOutputDto.items
            const pagedData = new PagedData<AccountsPosTerminalList>()
            const pageObject = new Page()

            result.terminalOutputDto = []

            pageObject.pageNumber = parseInt(params.page, 10)
            pageObject.pageSize = parseInt(params.rows, 10)
            pageObject.size = body.terminalOutputDto.size
            pageObject.totalElements = body.terminalOutputDto.total
            pageObject.totalPages =
              pageObject.totalElements / pageObject.pageSize

            for (let i = 0; i < pageObject.size; i++) {
              const jsonObj = output[i]
              jsonObj['cityForPrint'] = jsonObj.city
              jsonObj['fax'] = jsonObj.fax
              jsonObj['email'] = jsonObj.email
              jsonObj['pobox'] = jsonObj.pobox
              jsonObj['zipCode'] = jsonObj.zipCode
              result.terminalOutputDto.push(jsonObj)

              const list = new AccountsPosTerminalList(
                jsonObj.name,
                jsonObj.terminalId,
                jsonObj.account,
                jsonObj.location,
                jsonObj.region,
                jsonObj.city,
                jsonObj.mobile,
              )
              pagedData.data.push(list)
            }
            result.page = pageObject
            result.pagedData = pagedData

            return result
          }
        }),
        catchError(this.handleError),
      )
  }

  public confirmUpdateTerminal(params: any): Observable<any> {
    const pre = JSON.stringify(params)

    return this.http
      .post(this.servicesUrl + '/posStatementCU/updateTerminal/confirm', pre)
      .pipe(
        map((response: any) => {
          const result: any = {}

          if (response.errorCode !== '0') {
            return null
          } else {
            return response
          }
        }),
        catchError(this.handleError),
      )
  }

  outStandingdownload(): Observable<any> {
    //const pre = JSON.stringify(json);

    return this.http.get(this.servicesUrl + '/posStatementCU/mainOutstanding', {
      responseType: 'blob',
    })
  }

  setTerminalDetails(details) {
    this.terminalDetails = details
  }

  getTerminalDetails() {
    const termiDetails = this.terminalDetails
    return termiDetails
  }
}
