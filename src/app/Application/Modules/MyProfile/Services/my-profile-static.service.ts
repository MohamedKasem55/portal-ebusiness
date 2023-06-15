import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Observable, of, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { Exception } from '../../../../Application/Model/exception'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { KeyValue } from '../Model/key-value-static-service.model'
import { PromiseType } from 'protractor/built/plugins'

@Injectable()
export class MyProfileStaticService {
  servicesUrl: string

  public cacheCombosEn: Map<String, any> = new Map<String, any>()
  public cacheCombosAr: Map<String, any> = new Map<String, any>()

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    public translate: TranslateService,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  getCacheCombos() {
    if (this.translate.currentLang === 'en') {
      return this.cacheCombosEn
    } else {
      return this.cacheCombosAr
    }
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
    //console.error(errMsg);
    const errorService: Exception = new Exception('handle', errMsg)
    return observableThrowError(errorService)
  }

  setComboData(body) {
    const data = body || {}
    const cacheCombos = this.getCacheCombos()
    for (let i = 0; i < data.length; i++) {
      cacheCombos.set(data[i].name, data[i].props)
    }
  }

  prepareAllCombos(combos) {
    const allcombos = []
    const cacheCombos = this.getCacheCombos()
    for (let i = 0; i < combos.length; i++) {
      allcombos.push({
        comboName: combos[i],
        values: cacheCombos.get(combos[i]),
      })
    }
    return allcombos
  }

  getAllCombos(combos: string[]): Observable<any[]> {
    const cacheCombos = this.getCacheCombos()
    const combosRequest: any = []
    for (let i = 0; i < combos.length; i++) {
      if (!cacheCombos.has(combos[i])) {
        combosRequest.push(combos[i])
      }
    }
    if (combosRequest.length > 0) {
      const data = {
        names: combosRequest,
      }
      const body = JSON.stringify(data)
      return this.http.post(this.servicesUrl + '/statics/list', body).pipe(
        map((response: any) => {
          this.setComboData(response)
          return this.prepareAllCombos(combos)
        }),
        catchError(this.handleError),
      )
    } else {
      return of(this.prepareAllCombos(combos))
    }
  }

  getProperty(key, name) {
    const data = {
      key,
      name,
    }
    const body = JSON.stringify(data)
    return this.http.post(this.servicesUrl + '/statics/property', body).pipe(
      map((response: any) => {
        return response
      }),
      catchError(this.handleError),
    )
  }

  public getKeyValue(name: string): Observable<Array<KeyValue>> {
    const data = {
      name,
    }

    return this.http.post(this.servicesUrl + '/statics/model', data).pipe(
      map((response: any) => {
        if (response === null) return null

        return [
          new KeyValue('ar', response.props['1']),
          new KeyValue('en', response.props['2']),
        ]
      }),
      catchError(this.handleError),
    )
  }
}
