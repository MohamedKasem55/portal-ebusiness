import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
//import { AuthenticationService } from "../../../../../../core/security/authentication.service";
import { Exception } from '../../../../../Application/Model/exception'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'

@Injectable()
export class CardOperationsService {
  servicesUrl: string
  public cacheCombos: Map<String, any> = new Map<String, any>()
  public allComboData: any = []

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

  public getStaticValues(combos: string[]): Observable<any[]> {
    const combosRequest: any = []
    for (let i = 0; i < combos.length; i++) {
      if (!this.cacheCombos.has(combos[i])) {
        combosRequest.push(combos[i])
      }
    }

    if (combosRequest.length > 0) {
      const data = {
        names: combosRequest,
      }
      const req = JSON.stringify(data)
      return this.http.post(this.servicesUrl + '/statics/list', req).pipe(
        map((response: any) => {
          const body = response
          this.setComboData(body)
          return this.prepareAllCombos(combos)
        }),
        catchError(this.handleError),
      )
    } else {
      return of(this.prepareAllCombos(combos))
    }
  }

  public setComboData(body) {
    const data = body || {}
    for (let i = 0; i < data.length; i++) {
      this.cacheCombos.set(data[i].name, data[i].props)
    }
  }

  public prepareAllCombos(combos) {
    const allcombos = []
    for (let i = 0; i < combos.length; i++) {
      allcombos.push({
        comboName: combos[i],
        values: this.cacheCombos.get(combos[i]),
      })
    }
    return allcombos
  }

  public initiate(requestJson): Observable<any> {
    let body: any
    body = JSON.stringify(requestJson)

    return this.http
      .post(this.servicesUrl + '/payrollCards/operations/initiate', body)
      .pipe(
        map((response: any) => {
          //let result:any;
          const result = response

          if (response.errorCode !== '0') {
            return null
          } else {
            const output = result.cardIncentiveInstitutionsListOutput
            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  public validateMultiple(requestJson): Observable<any> {
    return this.http
      .post(
        this.servicesUrl + '/payrollCards/operations/validateMultiple',
        requestJson,
      )
      .pipe(
        map((response: any) => {
          //let result:any;
          const result = response

          if (response.errorCode !== '0') {
            return null
          } else {
            const output = result
            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  public confirmMultiple(requestJson): Observable<any> {
    let body: any
    body = JSON.stringify(requestJson)

    return this.http
      .post(this.servicesUrl + '/payrollCards/operations/confirmMultiple', body)
      .pipe(
        map((response: any) => {
          const result: any = {}
          const output = response
          if (response.errorCode !== '0') {
            result.error = true
            result.errorCode = response.errorCode
            result.errorDescription = response.errorDescription
            return result
          } else {
            return output
          }
        }),
        catchError(this.handleError),
      )
  }
}
