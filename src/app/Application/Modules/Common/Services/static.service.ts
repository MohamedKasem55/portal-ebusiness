import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Observable, of, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from '../../../Model/exception'
import { isNumeric } from 'rxjs/internal-compatibility'

@Injectable()
export class StaticService {
  servicesUrl: string

  public cacheCombosEn: Map<string, any> = new Map<string, any>()
  public cacheCombosAr: Map<string, any> = new Map<string, any>()

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    public translate: TranslateService,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  public getCacheCombos() {
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
    console.error(errMsg)
    const errorService: Exception = new Exception('handle', errMsg)
    return observableThrowError(errorService)
  }

  public setComboData(body) {
    const data = body || {}
    const cacheCombos = this.getCacheCombos()
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < data.length; i++) {
      cacheCombos.set(data[i].name, data[i].props)
    }
  }

  public prepareAllCombos(combos) {
    const allcombos = []
    const cacheCombos = this.getCacheCombos()
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < combos.length; i++) {
      allcombos.push({
        comboName: combos[i],
        values: cacheCombos.get(combos[i]),
      })
    }
    return allcombos
  }

  public getAllCombos(combos: string[]): Observable<any[]> {
    const cacheCombos = this.getCacheCombos()
    const combosRequest: any = []
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < combos.length; i++) {
      if (!cacheCombos.has(combos[i])) {
        combosRequest.push(combos[i])
      }
    }
    if (combosRequest.length > 0) {
      const data = {
        names: combosRequest,
      }
      return this.http.post(this.servicesUrl + '/statics/list', data).pipe(
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

  public getAllCombosAsArrays(
    combos: string[],
    orderByKey = false,
    orderType = 'asc',
  ): Observable<any> {
    return this.getAllCombos(combos).pipe(
      map((result) => {
        const combosData: any = result
        const combosArrayData = {}
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < combos.length; i++) {
          combosArrayData['_' + combos[i]] =
            combosData[combos.indexOf(combos[i])]['values']
          combosArrayData[combos[i]] = this.getObjectKeysValuesAsArray(
            combosData[combos.indexOf(combos[i])]['values'],
            orderByKey,
            orderType,
          )
        }
        return combosArrayData
      }),
    )
  }

  public getObjectKeysValuesAsArray(
    object,
    orderByKey = false,
    orderType = 'asc',
  ): any[] {
    const arrayData = []
    Object.keys(object).map((key, index) => {
      arrayData.push({ key, value: object[key] })
    })
    if (orderByKey) {
      if (orderType == 'desc') {
        arrayData.sort((a, b) => {
          if (a.key < b.key) {
            return 1
          }
          if (a.key > b.key) {
            return -1
          }
          return 0
        })
      } else {
        arrayData.sort((a, b) => {
          if(isNumeric(a.key) && isNumeric(b.key)){
            if (Number(a.key) > Number(b.key)) {
              return 1
            }
            if (Number(a.key) < Number(b.key)) {
              return -1
            }
          }
          return 0
        })
      }
    }
    return arrayData
  }

  public getProperty(key, name) {
    const data = {
      key,
      name,
    }
    return this.http.post(this.servicesUrl + '/statics/property', data).pipe(
      map((response: any) => response),
      catchError(this.handleError),
    )
  }

  public staticRecoverValues(combos, data, label) {
    const auxData = []
    const index = Object.keys(data[combos.indexOf(label)]['values']).sort(
      (a, b) =>
        //console.log(a,b);
        data[combos.indexOf(label)]['values'][a] >
        data[combos.indexOf(label)]['values'][b]
          ? 1
          : data[combos.indexOf(label)]['values'][b] >
          data[combos.indexOf(label)]['values'][a]
          ? -1
          : 0,
    )
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < index.length; i++) {
      auxData.push({
        key: index[i],
        value: data[combos.indexOf(label)]['values'][index[i]],
      })
    }
    return auxData
  }

  public getCompoByName(comboName: string, combos: any[]): any[] {
    let output = []
    combos.forEach((c, i) => {
      if (c.comboName === comboName) {
        output = combos[i]
      }
    })
    return output
  }
}
