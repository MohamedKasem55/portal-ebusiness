import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../core/config/config.resource.local'

@Injectable()
export class ModelService {
  private servicesUrl: string

  private propsStore: any

  constructor(
    private http: HttpClient,
    private _config: ConfigResourceService,
  ) {
    this.servicesUrl = _config.getServicesUrl()
    this.propsStore = {}
  }

  retrieveValue(propArray, key): string {
    if (!propArray || !key) return ''

    const searchResult: any[] = (propArray as any[]).filter(
      (p) => p.key === key,
    )
    return searchResult.length > 0 ? searchResult[0].value : ''
  }

  getModel(lang: string, prop: string): any {
    if (this.propsStore[prop] && this.propsStore[prop][lang]) {
      return this.propsStore[prop][lang]
    } else {
      if (!this.propsStore[prop]) this.propsStore[prop] = []

      if (!this.propsStore[prop][lang]) this.propsStore[prop][lang] = []

      const data: any = {}
      data.name = prop

      return this.http.post(this.servicesUrl + '/statics/model', data).pipe(
        map((response: any) => {
          if (response.props) {
            const result = []
            for (const _prop in response.props) {
              if (_prop)
                result.push({ key: _prop, value: response.props[_prop] })
            }

            this.propsStore[prop][lang] = result
            return result
          } else return '[]'
        }),
        catchError((error: any, caught: Observable<any>): Observable<any> => {
          return of('[]')
        }),
      )
    }
  }

  getModelObserver(lang: string, prop: string): any {
    if (this.propsStore[prop] && this.propsStore[prop][lang]) {
      return of(this.propsStore[prop][lang])
    } else {
      if (!this.propsStore[prop]) {
        this.propsStore[prop] = []
      }
      if (!this.propsStore[prop][lang]) {
        this.propsStore[prop][lang] = []
      }
      const data: any = {}
      data.name = prop

      return this.http.post(this.servicesUrl + '/statics/model', data).pipe(
        map((response: any) => {
          if (response.props) {
            const result = []

            for (const _prop in response.props) {
              if (_prop)
                result.push({ key: _prop, value: response.props[_prop] })
            }

            this.propsStore[prop][lang] = result

            return result
          } else {
            return of('[]')
          }
        }),
        catchError((error: any, caught: Observable<any>): Observable<any> => {
          return of('[]')
        }),
      )
    }
  }
}
