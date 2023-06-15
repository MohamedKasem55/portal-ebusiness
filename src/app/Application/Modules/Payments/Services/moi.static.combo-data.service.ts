import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from 'app/Application/Model/exception'

@Injectable()
export class MoiStaticComboDataService {
  servicesUrl: string
  public cacheCombos: Map<String, any> = new Map<String, any>()
  public allComboData: any = []

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

  setComboData(body) {
    const data = body || {}
    for (let i = 0; i < data.length; i++) {
      this.cacheCombos.set(data[i].name, data[i].props)
    }
  }

  prepareAllCombos(combos) {
    const allcombos = []
    for (let i = 0; i < combos.length; i++) {
      allcombos.push({
        comboName: combos[i],
        values: this.cacheCombos.get(combos[i]),
      })
    }
    return allcombos
  }

  getAllCombos(combos: string[]): Observable<any[]> {
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
      const body = JSON.stringify(data)
      //console.log("json static");
      //console.log(body);
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
}
